
import React, { useState } from 'react';
import { BodyPlacement, AppTier, TattooStyle, ProjectMode } from '../types';
import { Sparkles, Zap, Lock, Layers } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { StyleGrid } from './StyleGrid';
import { InspirationRail } from './InspirationRail';
import { PlacementGrid } from './PlacementGrid';

interface GeneratorFormProps {
  onGenerate: (concept: string, placement: BodyPlacement, style: TattooStyle, size: number, mode: ProjectMode) => void;
  isLoading: boolean;
  tier: AppTier;
  onUpgrade: () => void;
}

export const GeneratorForm = React.memo<GeneratorFormProps>(({ onGenerate, isLoading, tier, onUpgrade }) => {
  const [concept, setConcept] = useState('');
  const [placement, setPlacement] = useState<BodyPlacement>(BodyPlacement.ARM); // Default to Arm for Sleeve
  const [style, setStyle] = useState<TattooStyle>(TattooStyle.TRADITIONAL);
  const [mode, setMode] = useState<ProjectMode>(ProjectMode.SINGLE);
  const [projectSize, setProjectSize] = useState(4); // Default 4 items for project
  const conceptInputId = React.useId();
  const conceptInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
 palette-generator-ux-14832640893578868664
    if (!concept) {
      conceptInputRef.current?.focus();
      return;
    }

    if (!concept) return;

    // Security: Validate input length to prevent DoS
    if (concept.length > 500) {
      alert("Concept description is too long. Please keep it under 500 characters.");
      return;
    }

 ZenBeasts
    const size = mode === ProjectMode.SINGLE ? 1 : projectSize;
    onGenerate(concept, placement, style, size, mode);
  };

  return (
    <div className="bg-ink-800 rounded-xl shadow-2xl shadow-black border border-ink-700 overflow-hidden text-ink-50">
      
      {/* Mode Tabs */}
      <div className="flex border-b border-ink-700" role="tablist" aria-label="Project Mode">
          <button 
             role="tab"
             aria-selected={mode === ProjectMode.SINGLE}
             onClick={() => setMode(ProjectMode.SINGLE)}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${mode === ProjectMode.SINGLE ? 'bg-ink-800 text-accent-gold border-b-2 border-accent-gold' : 'bg-ink-900 text-ink-500 hover:text-white'}`}
          >
              <Zap className="w-4 h-4" /> Single Design
          </button>
          <button 
             role="tab"
             aria-selected={mode === ProjectMode.PROJECT}
             onClick={() => setMode(ProjectMode.PROJECT)}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${mode === ProjectMode.PROJECT ? 'bg-ink-800 text-accent-gold border-b-2 border-accent-gold' : 'bg-ink-900 text-ink-500 hover:text-white'}`}
          >
              <Layers className="w-4 h-4" /> Sleeve Project
          </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        
        {/* Concept Section */}
        <div className="space-y-4">
          <label htmlFor={conceptInputId} className="flex items-center space-x-2 text-xs font-bold text-ink-400 uppercase tracking-widest">
            <span className="text-accent-gold">01.</span>
            <span>Tattoo Concept</span>
          </label>
          
          <Tooltip content="Describe your tattoo idea" position="top" className="w-full">
            <div className="relative group w-full">
              <input 
                ref={conceptInputRef}
                id={conceptInputId}
                type="text" 
 sentinel-input-limits-17124088429024588354
                maxLength={500}

                maxLength={1000}
 ZenBeasts
                value={concept}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) setConcept(e.target.value);
                }}
                placeholder={mode === ProjectMode.PROJECT ? "e.g. Ocean theme sleeve with ships and kraken..." : "e.g. A roaring tiger, black and grey..."}
                className="w-full px-6 py-5 rounded-lg bg-ink-900 border border-ink-600 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition-all text-lg font-medium text-white placeholder:text-ink-600"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none group-focus-within:text-accent-gold transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-right text-[10px] text-ink-500 mt-1 font-mono">
                {concept.length}/500
            </div>
          </Tooltip>

          {/* Inspiration Rail */}
          <InspirationRail onSelect={setConcept} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Settings Column */}
          <div className="space-y-6">
            
            {/* Placement - Only strictly relevant for context, or selecting canvas type */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-xs font-bold text-ink-400 uppercase tracking-widest">
                <span className="text-accent-gold">02.</span>
                <span>{mode === ProjectMode.PROJECT ? 'Sleeve Canvas' : 'Placement'}</span>
              </label>
              <PlacementGrid selectedPlacement={placement} mode={mode} onSelect={setPlacement} />
            </div>

            {/* Complexity / Size */}
            {mode === ProjectMode.PROJECT && (
                <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-bold text-ink-400 uppercase tracking-widest">
                    <div className="flex items-center space-x-2">
                    <span className="text-accent-gold">03.</span>
                    <span>Project Complexity</span>
                    </div>
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {[4, 6, 8, 10].map((s) => {
                    const isLocked = tier === AppTier.FREE && s > 4;
                    return (
                        <Tooltip key={s} content={isLocked ? "Upgrade for larger sleeves" : `${s} Design Elements`} className="w-full">
                        <button 
                            aria-pressed={projectSize === s && !isLocked}
                            aria-label={isLocked ? `Unlock ${s} design elements (Pro feature)` : `Select ${s} design elements`}
                            onClick={() => isLocked ? onUpgrade() : setProjectSize(s)}
                            className={`w-full relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                projectSize === s && !isLocked
                                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' 
                                : 'border-ink-700 bg-ink-900 text-ink-500'
                            } ${!isLocked && 'hover:border-ink-500'} ${isLocked && 'opacity-60 cursor-pointer hover:border-accent-gold/30'}`}
                        >
                            <span className="font-black text-lg">{s}</span>
                            {isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] rounded-lg">
                                    <Lock className="w-3 h-3 text-ink-300" />
                                </div>
                            )}
                        </button>
                        </Tooltip>
                    );
                    })}
                </div>
                </div>
            )}
          </div>

          {/* Style Column */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-xs font-bold text-ink-400 uppercase tracking-widest">
                <span className="text-accent-gold">04.</span>
                <span>Tattoo Style</span>
            </label>
            <StyleGrid selectedStyle={style} onSelect={setStyle} />
          </div>
        </div>

        {/* Action Button */}
        <Tooltip content={!concept ? "Enter a concept first" : "Start Generation"} className="w-full">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            aria-disabled={!concept}
            className={`w-full py-5 rounded-lg text-ink-950 font-black text-lg shadow-lg shadow-accent-gold/10 transition-all transform active:scale-[0.98] hover:-translate-y-1 relative overflow-hidden ${
              !concept || isLoading 
                ? 'bg-ink-700 shadow-none text-ink-500'
                : 'bg-accent-gold hover:bg-yellow-400'
            } ${!concept ? 'cursor-not-allowed opacity-80' : ''}`}
          >
              <div className="flex items-center justify-center gap-3 relative z-10">
                  {isLoading ? (
                      <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink-900"></div>
                          <span>PREPARING STENCILS...</span>
                      </>
                  ) : (
                      <>
                          <Zap className="w-5 h-5 fill-current" />
                          <span>{mode === ProjectMode.PROJECT ? 'BUILD SLEEVE PROJECT' : 'GENERATE DESIGN'}</span>
                      </>
                  )}
              </div>
          </button>
        </Tooltip>

      </div>
    </div>
  );
});

GeneratorForm.displayName = 'GeneratorForm';
