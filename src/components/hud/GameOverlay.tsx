
import {
  Play,
  RotateCcw,
  Skull,
  Trophy,
  Coins,
  Sparkles,
  LockKeyhole,
} from 'lucide-react';

export type OverlayKind =
  | 'ready'
  | 'defeated'
  | 'complete';

interface GameOverlayProps {
  kind: OverlayKind;
  coins: number;
  totalCoins: number;
  onPlay: () => void;
}

export function GameOverlay({
  kind,
  coins,
  totalCoins,
  onPlay,
}: GameOverlayProps) {
  const bonus = kind === 'complete' ? 500 : 0;
  const totalEarned = coins + bonus;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="animate-rise w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">

        {kind === 'ready' && <ReadyContent />}

        {kind === 'defeated' && <DefeatedContent />}

        {kind === 'complete' && (
          <CompleteContent
            coins={coins}
            totalCoins={totalCoins}
            totalEarned={totalEarned}
          />
        )}

        <button
          type="button"
          onClick={onPlay}
          autoFocus
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          {kind === 'ready' && (
            <>
              <Play className="h-5 w-5 fill-white" />
              Start adventure
            </>
          )}

          {kind === 'defeated' && (
            <>
              <RotateCcw className="h-5 w-5" />
              Try again
            </>
          )}

          {kind === 'complete' && (
            <>
              <Sparkles className="h-5 w-5" />
              Continue Adventure
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// START SCREEN
function ReadyContent() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        World 1 · Level 1
      </p>

      <h1 className="mt-2 font-serif text-4xl font-bold leading-[1.2] text-slate-900">
        Dragon Quest
      </h1>

      <p className="mt-2 text-base leading-[1.5] text-slate-600">
        Guide the knight through the Enchanted Forest.
      </p>

      <ul className="mt-5 space-y-2 text-left text-sm leading-[1.5] text-slate-700">
        <li>⚔️ Defeat enemies with your sword.</li>
        <li>🪙 Collect gold coins.</li>
        <li>🌲 Explore the enchanted forest.</li>
        <li>🐉 Face the mighty Forest Guardian.</li>
      </ul>

      <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-[1.5] text-slate-600">
        Phone: use the buttons to move and jump.
        Computer: Arrow keys or A and D to move,
        Space to jump, and X to attack.
      </p>
    </>
  );
}

// DEFEAT SCREEN
function DefeatedContent() {
  return (
    <>
      <Skull className="mx-auto h-14 w-14 text-rose-500" />

      <h2 className="mt-4 font-serif text-3xl font-bold leading-[1.2] text-slate-900">
        The forest won this time
      </h2>

      <p className="mt-2 text-base leading-[1.5] text-slate-600">
        You ran out of hearts. Rise again, brave knight!
      </p>
    </>
  );
}

// VICTORY SCREEN
function CompleteContent({
  coins,
  totalCoins,
  totalEarned,
}: {
  coins: number;
  totalCoins: number;
  totalEarned: number;
}) {
  return (
    <>
      <Trophy className="mx-auto h-16 w-16 animate-bounce text-amber-500" />

      <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
        Legendary Victory
      </p>

      <h2 className="mt-3 font-serif text-3xl font-black leading-[1.2] text-slate-900">
        FOREST GUARDIAN DEFEATED!
      </h2>

      <p className="mt-3 text-base leading-[1.6] text-slate-600">
        You conquered the Enchanted Forest!
      </p>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 px-4 py-4">
        <Sparkles className="mx-auto h-6 w-6 text-amber-500" />

        <p className="mt-2 text-sm font-bold text-amber-800">
          LEGENDARY REWARD
        </p>

        <div className="mt-2 flex items-center justify-center gap-2">
          <Coins className="h-7 w-7 text-amber-500" />

          <span className="text-3xl font-black text-amber-600">
            +500 BONUS COINS
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-white/80 p-3">
          <p className="text-xs font-semibold text-slate-500">
            TOTAL REWARD THIS RUN
          </p>

          <p className="mt-1 text-2xl font-black text-emerald-700">
            🪙 {totalEarned} Coins
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Coins collected: {coins} / {totalCoins}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-100 p-3 text-emerald-800">
        <LockKeyhole className="h-5 w-5" />

        <span className="text-sm font-bold">
          LEVEL 2 UNLOCKED!
        </span>
      </div>
    </>
  );
}
