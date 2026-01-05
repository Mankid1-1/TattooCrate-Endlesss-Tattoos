import React from 'react';
import { TattooStyle } from '../types';
import { Tooltip } from './Tooltip';

interface StyleGridProps {
  selectedStyle: TattooStyle;
  onSelect: (style: TattooStyle) => void;
}

const getStyleEmoji = (style: TattooStyle) => {
    switch(style) {
        case TattooStyle.TRADITIONAL: return '⚓';
        case TattooStyle.NEO_TRADITIONAL: return '🦅';
        case TattooStyle.JAPANESE: return '👹';
        case TattooStyle.BLACK_GREY: return '🎭';
        case TattooStyle.NEW_SCHOOL: return '🛹';
        case TattooStyle.BIOMECHANICAL: return '🦾';
        case TattooStyle.TRASH_POLKA: return '🔴';
        case TattooStyle.WATERCOLOR: return '🎨';
        case TattooStyle.GEOMETRIC: return '📐';
        case TattooStyle.TRIBAL: return '🗿';
        case TattooStyle.BLACKWORK: return '⚫';
        case TattooStyle.REALISM: return '📸';
        case TattooStyle.FINE_LINE: return '✨';
        case TattooStyle.IGNORANT: return '🖍️';
        case TattooStyle.SKETCH: return '✏️';
        case TattooStyle.GLITCH: return '📺';
        default: return '🖋️';
    }
}

const TATTOO_STYLES = Object.values(TattooStyle);

export const StyleGrid = React.memo<StyleGridProps>(({ selectedStyle, onSelect }) => {
  return (
    <div
      role="group"
      aria-label="Tattoo Style"
      className="grid grid-cols-2 gap-2 h-64 overflow-y-auto pr-1 custom-scrollbar"
    >
        {TATTOO_STYLES.map((s) => (
            <Tooltip key={s} content={s} position="top" className="w-full">
              <button
                  aria-pressed={selectedStyle === s}
                  aria-label={`Select ${s} style`}
                  onClick={() => onSelect(s)}
                  className={`w-full p-3 rounded-lg border text-left transition-all group ${
                      selectedStyle === s
                      ? 'border-accent-gold bg-accent-gold/10'
                      : 'border-ink-700 bg-ink-900 hover:border-ink-500'
                  }`}
              >
                  <div className={`w-full h-12 rounded bg-ink-950 overflow-hidden relative mb-2 flex items-center justify-center ${selectedStyle === s ? 'ring-1 ring-accent-gold' : ''}`}>
                     <span className="text-2xl filter grayscale contrast-125 group-hover:filter-none transition-all">{getStyleEmoji(s)}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${selectedStyle === s ? 'text-accent-gold' : 'text-ink-400'}`}>
                      {s.split(' ')[0]}
                  </span>
              </button>
            </Tooltip>
        ))}
    </div>
  );
});

StyleGrid.displayName = 'StyleGrid';
