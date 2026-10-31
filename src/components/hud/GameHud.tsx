import { Coins, Heart, Star } from 'lucide-react';
import { MAX_HEALTH } from '@/game/constants';
import type { LevelDef } from '@/game/types';

interface GameHudProps {
  level: LevelDef;
  health: number;
  coins: number;
}

export function GameHud({ level, health, coins }: GameHudProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-slate-900 shadow-lg backdrop-blur">
        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
        <span>{level.name}</span>
      </div>

      <div
        className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 shadow-lg backdrop-blur"
        role="img"
        aria-label={`${health} of ${MAX_HEALTH} hearts`}
      >
        {Array.from({ length: MAX_HEALTH }, (_, i) => (
          <Heart
            key={i}
            className={`h-5 w-5 transition-colors duration-300 ${
              i < health ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
            }`}
          />
        ))}
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold tabular-nums text-slate-900 shadow-lg backdrop-blur"
        aria-label={`${coins} coins`}
      >
        <Coins className="h-4 w-4 text-amber-500" />
        <span>{coins}</span>
      </div>
    </div>
  );
}
