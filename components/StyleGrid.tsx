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

interface StyleButtonProps {
    style: TattooStyle;
    isSelected: boolean;
    onSelect: (style: TattooStyle) => void;
}

const StyleButton = React.memo(({ style, isSelected, onSelect }: StyleButtonProps) => {
    const handleClick = React.useCallback(() => onSelect(style), [onSelect, style]);

    return (
        <Tooltip content={style} position="top" className="w-full">
              <button
                  aria-pressed={isSelected}
                  aria-label={`Select ${style} style`}
                  onClick={handleClick}
                  className={`w-full p-3 rounded-lg border text-left transition-all group ${
                      isSelected
                      ? 'border-accent-gold bg-accent-gold/10'
                      : 'border-ink-700 bg-ink-900 hover:border-ink-500'
                  }`}
              >
                  <div className={`w-full h-12 rounded bg-ink-950 overflow-hidden relative mb-2 flex items-center justify-center ${isSelected ? 'ring-1 ring-accent-gold' : ''}`}>
                     <span className="text-2xl filter grayscale contrast-125 group-hover:filter-none transition-all">{getStyleEmoji(style)}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-accent-gold' : 'text-ink-400'}`}>
                      {style.split(' ')[0]}
                  </span>
              </button>
        </Tooltip>
    );
});

StyleButton.displayName = 'StyleButton';

/**
 * ⚡ Performance Optimization:
 * Extracted StyleButton to a memoized component to prevent re-rendering the entire grid list
 * when only the selection state changes. Now only the previously selected button and the
 * newly selected button will re-render, instead of all ~16 buttons.
 */
export const StyleGrid = React.memo<StyleGridProps>(({ selectedStyle, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto pr-1 custom-scrollbar">
        {TATTOO_STYLES.map((s) => (
            <StyleButton
                key={s}
                style={s}
                isSelected={selectedStyle === s}
                onSelect={onSelect}
            />
        ))}
    </div>
  );
});

StyleGrid.displayName = 'StyleGrid';
