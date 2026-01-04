import React from 'react';
import { Tooltip } from './Tooltip';

interface InspirationRailProps {
  onSelect: (concept: string) => void;
}

const INSPIRATION_PROMPTS = [
  { emoji: '💀', text: 'Geometric Skull & Roses' },
  { emoji: '🐉', text: 'Japanese Dragon Sleeve' },
  { emoji: '⚓', text: 'Traditional Anchor & Swallow' },
  { emoji: '🐺', text: 'Realistic Wolf in Forest' },
  { emoji: '🗡️', text: 'Dagger through Heart' },
  { emoji: '👁️', text: 'Abstract Cyberpunk Eye' },
];

export const InspirationRail = React.memo<InspirationRailProps>(({ onSelect }) => {
  return (
    <ul
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x"
      aria-label="Inspiration prompts"
    >
      {INSPIRATION_PROMPTS.map((prompt) => (
        <li key={prompt.text} className="snap-start flex-shrink-0">
          <Tooltip content="Use this concept">
            <button
              onClick={() => onSelect(prompt.text)}
              className="flex items-center gap-2 px-4 py-2 bg-ink-900 border border-ink-700 rounded-md hover:border-accent-gold/50 hover:text-accent-gold transition-all text-xs font-bold text-ink-400 shadow-sm active:scale-95 uppercase tracking-wide"
            >
              <span aria-hidden="true">{prompt.emoji}</span>
              <span>{prompt.text}</span>
            </button>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
});

InspirationRail.displayName = 'InspirationRail';
