import React from 'react';
import { BodyPlacement, ProjectMode } from '../types';
import { Tooltip } from './Tooltip';

interface PlacementGridProps {
  selectedPlacement: BodyPlacement;
  mode: ProjectMode;
  onSelect: (placement: BodyPlacement) => void;
}

const PLACEMENT_ICONS: Record<BodyPlacement, string> = {
  [BodyPlacement.PAPER]: '📄',
  [BodyPlacement.ARM]: '💪',
  [BodyPlacement.LEG]: '🦵',
  [BodyPlacement.BACK]: '🔙',
  [BodyPlacement.CHEST]: '👕',
  [BodyPlacement.HAND]: '✋',
  [BodyPlacement.NECK]: '👤',
};

const ALL_PLACEMENTS = Object.values(BodyPlacement);

export const PlacementGrid = React.memo<PlacementGridProps>(({ selectedPlacement, mode, onSelect }) => {
  const visiblePlacements = React.useMemo(() =>
    ALL_PLACEMENTS.filter(p => mode === ProjectMode.SINGLE ? true : p !== BodyPlacement.PAPER),
  [mode]);

  return (
    <div role="group" aria-label="Body Placement" className="grid grid-cols-2 gap-2">
      {visiblePlacements.map((place) => (
        <Tooltip key={place} content={`Select ${place}`} className="w-full h-full">
          <button
            aria-pressed={selectedPlacement === place}
            aria-label={`Select ${place} placement`}
            onClick={() => onSelect(place)}
            className={`w-full h-full px-3 py-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              selectedPlacement === place
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                : 'border-ink-700 bg-ink-900 text-ink-400 hover:border-ink-500'
            }`}
          >
            <span className="text-lg">{PLACEMENT_ICONS[place]}</span>
            {place.split(' (')[0].split(' / ')[0]}
          </button>
        </Tooltip>
      ))}
    </div>
  );
});

PlacementGrid.displayName = 'PlacementGrid';
