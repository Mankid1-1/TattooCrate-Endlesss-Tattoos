import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { BodyPlacement, AppTier, TattooStyle, CollectionSize, DesignData, PortfolioState, AppView, AppSettings, PaperSize, ProjectMode } from './types';
import { generateTattooDesign } from './services/geminiService';
import { purchaseSubscription, restorePurchases, setPurchaseFlag } from './services/storeService';
import { GeneratorForm } from './components/GeneratorForm';
import { Tooltip } from './components/Tooltip';
import { Settings as SettingsIcon, Home, Zap, Lock } from 'lucide-react';
import { useClientConfig } from './hooks/useClientConfig';

// Lazy load components
const BookViewer = React.lazy(() => import('./components/BookViewer'));
const SettingsView = React.lazy(() => import('./components/SettingsView'));
// Optimization: Lazy load heavy overlays to reduce initial bundle size and split chunks
const UpgradeModal = React.lazy(() => import('./components/UpgradeModal').then(module => ({ default: module.UpgradeModal })));
const LoadingOverlay = React.lazy(() => import('./components/LoadingOverlay').then(module => ({ default: module.LoadingOverlay })));

const App: React.FC = () => {
  const clientConfig = useClientConfig();
  const isKiosk = clientConfig.mode === 'kiosk';
  const isOnline = clientConfig.mode === 'online';

  // Global State
  // Optimization: Lazy init to avoid re-renders on mount
  const [tier, setTier] = useState<AppTier>(() => {
    const hasPurchased = localStorage.getItem('tc_has_purchased') === 'true';
    return hasPurchased ? AppTier.PRO : AppTier.FREE;
  });

  const [view, setView] = useState<AppView>('home');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<{current: number, total: number} | undefined>(undefined);
  
  // Settings State
  // Optimization: Lazy init to avoid re-renders on mount
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('tc_app_settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch(e) { console.error("Failed to load settings"); }
    }
    return {
      paperSize: PaperSize.A4,
      defaultPlacement: BodyPlacement.PAPER
    };
  });

  // Portfolio Data
  // Optimization: Lazy init to avoid re-renders on mount
  const [portfolioState, setPortfolioState] = useState<PortfolioState>(() => {
    const savedPortfolio = localStorage.getItem('tc_portfolio_state');
    if (savedPortfolio) {
      try {
        return JSON.parse(savedPortfolio);
      } catch (e) { console.error("Failed to load portfolio"); }
    }
    return {
      concept: '',
      placement: BodyPlacement.PAPER,
      style: TattooStyle.TRADITIONAL,
      designs: [],
      lastUpdated: 0,
      mode: ProjectMode.SINGLE,
      projectLayers: []
    };
  });

  // UI
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Optimization: Stable handler for opening upgrade modal
  const handleOpenUpgradeModal = useCallback(() => {
    setShowUpgradeModal(true);
  }, []);

  // Optimization: Stable handler for closing upgrade modal
  const handleCloseUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false);
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) console.log("No API Key selected yet.");
    }
  };

  useEffect(() => {
      checkApiKey();
  }, []);

  useEffect(() => {
      if (portfolioState.designs.length > 0) {
          localStorage.setItem('tc_portfolio_state', JSON.stringify(portfolioState));
      }
  }, [portfolioState]);

  useEffect(() => {
      localStorage.setItem('tc_app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // --- Actions ---

  const handleReset = () => {
    localStorage.removeItem('tc_portfolio_state');
    setPortfolioState({
        concept: '',
        placement: appSettings.defaultPlacement,
        style: TattooStyle.TRADITIONAL,
        designs: [],
        lastUpdated: 0,
        mode: ProjectMode.SINGLE,
        projectLayers: []
    });
    setView('home');
  };

  const handleFullReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleUpgrade = useCallback(async () => {
      await purchaseSubscription();
      setPurchaseFlag();
      setTier(AppTier.PRO);
  }, []);

  const handleRestore = useCallback(async () => {
      const restoredTier = await restorePurchases();
      if (restoredTier === AppTier.PRO) {
          setTier(AppTier.PRO);
          alert("License restored.");
      } else {
          alert("No previous license found.");
      }
  }, []);

  // Optimization: Memoized to prevent re-creation on every render, allowing children like GeneratorForm to potentially optimize renders.
  const handleGenerate = useCallback(async (concept: string, placement: BodyPlacement, style: TattooStyle, size: number, mode: ProjectMode) => {
    if (tier === AppTier.FREE && size > 1) {
        setShowUpgradeModal(true);
        return;
    }

    setLoading(true);
    setLoadingProgress(size > 1 ? { current: 0, total: size } : undefined);
    
    // If starting a new project or switching concepts, reset logic can be here. 
    // For now we append or overwrite. Let's overwrite for clean slate.
    setPortfolioState({ 
        concept, placement, style, 
        designs: [], 
        lastUpdated: Date.now(),
        mode,
        projectLayers: []
    });

    try {
      // ⚡ Performance Optimization:
      // Run all generations in parallel instead of sequentially awaiting them.
      // This drastically reduces total wait time from (T * N) to roughly T.
      // We update state as each promise resolves to show progress.

      let completedCount = 0;

      const promises = Array.from({ length: size }).map(async (_, i) => {
          try {
             const imageUrl = await generateTattooDesign({
                concept,
                placement,
                style,
                tier,
                variationIndex: i,
                isProjectItem: mode === ProjectMode.PROJECT // If project mode, force flash style
             });

             const design: DesignData = {
                id: Date.now().toString() + i, // Unique ID even if generated at same ms
                originalUrl: imageUrl,
                modifiedUrl: null,
                promptUsed: concept,
                placement: placement,
                createdAt: Date.now()
             };

             // Streaming update: Update state as soon as this design is ready
             setPortfolioState(prev => ({ ...prev, designs: [...prev.designs, design] }));

          } catch (e: any) {
             console.error(`Design ${i+1} failed`, e);
             throw e; // Re-throw to be caught by Promise.all
          } finally {
             completedCount++;
             if (size > 1) {
                setLoadingProgress({ current: completedCount, total: size });
             }
          }
      });

      await Promise.all(promises);

    } catch (err: any) {
      console.error(err);
      if (err.message === "PERMISSION_DENIED") {
        if (window.aistudio && window.aistudio.openSelectKey) {
            await window.aistudio.openSelectKey();
            alert("API Key updated. Please try again!");
        } else {
            alert("Access Denied. Please check your API Key settings.");
        }
      } else {
         // Some might have succeeded, so alert might be confusing if user sees images.
         // But usually if one fails (like auth), all fail.
         // If partial failure (network), we already logged it.
         alert("Could not generate all tattoo designs. Some may have failed.");
      }
    } finally {
      setLoading(false);
      setLoadingProgress(undefined);
    }
  }, [tier]);

  // Optimization: Memoized to ensure stable prop reference for BookViewer.
  // Dependencies include specific state slices to ensure we always have fresh data for regeneration logic without breaking memoization unnecessarily.
  const handleRegenerateSinglePage = useCallback(async (pageId: string) => {
      const pageIndex = portfolioState.designs.findIndex(p => p.id === pageId);
      if (pageIndex === -1) return;

      try {
          const newUrl = await generateTattooDesign({
              concept: portfolioState.concept,
              placement: portfolioState.placement,
              style: portfolioState.style,
              tier,
              variationIndex: Math.floor(Math.random() * 1000),
              isProjectItem: portfolioState.mode === ProjectMode.PROJECT
          });

          setPortfolioState(prev => {
              const newPages = [...prev.designs];
              newPages[pageIndex] = {
                  ...newPages[pageIndex],
                  originalUrl: newUrl,
                  modifiedUrl: null
              };
              return { ...prev, designs: newPages };
          });
      } catch (e: any) {
          if (e.message === "PERMISSION_DENIED") {
             if (window.aistudio && window.aistudio.openSelectKey) await window.aistudio.openSelectKey();
          }
          console.error("Failed to regenerate", e);
      }
  }, [portfolioState.designs, portfolioState.concept, portfolioState.placement, portfolioState.style, portfolioState.mode, tier]);

  // Optimization: Stable callback (no dependencies) to prevent BookViewer re-renders when updating a single design.
  const handleUpdatePage = useCallback((pageId: string, newUrl: string) => {
      setPortfolioState(prev => ({
          ...prev,
          designs: prev.designs.map(p => p.id === pageId ? { ...p, modifiedUrl: newUrl } : p)
      }));
  }, []);

  return (
    <div className="min-h-screen font-sans bg-ink-900 text-ink-50 selection:bg-accent-gold selection:text-black pb-20 md:pb-0">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-ink-950/80 backdrop-blur-lg border-b border-ink-800 safe-top">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip content="Reset Studio" position="bottom">
                  <button
                    type="button"
                    className="flex items-center gap-2 cursor-pointer group bg-transparent border-none p-0 text-left"
                    onClick={handleReset}
                    aria-label="Reset Studio"
                  >
                       {clientConfig.logoUrl ? (
                          <img src={clientConfig.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                       ) : (
                          <div className="w-8 h-8 bg-accent-gold text-black rounded flex items-center justify-center shadow-lg shadow-accent-gold/20 transform group-hover:rotate-180 transition-transform duration-500">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </div>
                       )}
                      <span className="font-display font-black text-xl tracking-wider text-white hidden md:block uppercase">{clientConfig.parlorName}</span>
                  </button>
              </Tooltip>
              
              {!isKiosk && !isOnline && (
                <div className="hidden md:flex bg-ink-900 rounded border border-ink-800 p-0.5">
                   <button
                     onClick={() => setView('home')}
                     className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-wide ${view === 'home' ? 'bg-ink-800 text-white shadow-sm' : 'text-ink-500 hover:text-white'}`}
                   >
                      <Home className="w-3 h-3" /> Studio
                   </button>
                   <button
                     onClick={() => setView('settings')}
                     className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-wide ${view === 'settings' ? 'bg-ink-800 text-white shadow-sm' : 'text-ink-500 hover:text-white'}`}
                   >
                      <SettingsIcon className="w-3 h-3" /> Settings
                   </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!isKiosk && !isOnline && (
                <button
                  onClick={() => setView(view === 'home' ? 'settings' : 'home')}
                  className="md:hidden p-2 text-ink-400 hover:bg-ink-800 rounded-full"
                  aria-label={view === 'home' ? 'Open Settings' : 'Go to Home'}
                >
                    {view === 'home' ? <SettingsIcon className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                </button>
              )}

              {/* Hide Upgrade Button in Kiosk Mode and Online Mode */}
              {!isKiosk && !isOnline && (
                <button
                    onClick={() => tier === AppTier.FREE && handleOpenUpgradeModal()}
                    className={`px-4 py-2 rounded font-bold text-xs transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest ${
                        tier === AppTier.PRO
                        ? 'bg-ink-800 text-accent-gold border border-accent-gold/50 cursor-default'
                        : 'bg-accent-gold text-black hover:bg-yellow-400 shadow-lg shadow-accent-gold/20'
                    }`}
                >
                    {tier === AppTier.PRO ? 'PRO ARTIST' : 'GO PRO'}
                </button>
              )}
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-16">
        
        {view === 'home' ? (
          <>
            {/* Intro Hero */}
            {portfolioState.designs.length === 0 && (
                <div className="text-center space-y-6 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-700 mt-8 md:mt-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-ink-700 bg-ink-800/50 text-accent-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span>{clientConfig.tagline || 'AI POWERED INK DESIGNER'}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-none uppercase">
                        {clientConfig.parlorName}
                    </h1>
                    <p className="text-lg text-ink-400 font-light max-w-xl mx-auto">
                        Generate professional flash sheets, visualize ink on body parts, and create custom stencils in seconds.
                    </p>
                </div>
            )}

            {/* Generator Form */}
            <div id="generator" className="max-w-4xl mx-auto">
                <GeneratorForm 
                    onGenerate={handleGenerate} 
                    isLoading={loading}
                    tier={tier}
                    onUpgrade={handleOpenUpgradeModal}
                />
            </div>

            {/* Results */}
            {portfolioState.designs.length > 0 && (
                <div className="border-t border-ink-800 pt-16">
                    <Suspense fallback={<div className="flex items-center justify-center p-12 text-ink-500 animate-pulse">Loading Studio...</div>}>
                        <BookViewer
                            designs={portfolioState.designs}
                            concept={portfolioState.concept}
                            tier={tier}
                            paperSize={appSettings.paperSize}
                            mode={portfolioState.mode}
                            placement={portfolioState.placement}
                            onRegeneratePage={handleRegenerateSinglePage}
                            onUpdatePage={handleUpdatePage}
                            onUpgrade={handleOpenUpgradeModal}
                        />
                    </Suspense>
                </div>
            )}
          </>
        ) : (
          <Suspense fallback={<div className="flex items-center justify-center p-12 text-ink-500 animate-pulse">Loading Settings...</div>}>
              <SettingsView
                settings={appSettings}
                onUpdateSettings={setAppSettings}
                tier={tier}
                onResetApp={handleFullReset}
                onRestorePurchases={handleRestore}
              />
          </Suspense>
        )}

      </main>

      {/* Overlays */}
      <Suspense fallback={null}>
        {loading && <LoadingOverlay current={loadingProgress?.current} total={loadingProgress?.total} />}

        {showUpgradeModal && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={handleCloseUpgradeModal}
            onUpgrade={handleUpgrade}
            onRestore={handleRestore}
          />
        )}
      </Suspense>

      {/* Powered by TattooCrate Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-ink-950/90 backdrop-blur border-t border-ink-800 py-2 px-4 flex items-center justify-center gap-2 z-50">
           <span className="text-[10px] text-ink-400 uppercase tracking-widest">Powered by</span>
           <div className="flex items-center gap-1">
               <div className="w-3 h-3 bg-accent-gold rounded-sm"></div>
               <span className="font-display font-bold text-xs text-white tracking-wider">TATTOO<span className="text-accent-gold">CRATE</span></span>
           </div>
      </div>
    </div>
  );
};

export default App;
