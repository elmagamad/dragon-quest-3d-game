import { Play, RotateCcw, Skull, Trophy } from 'lucide-react';

export type OverlayKind = 'ready' | 'defeated' | 'complete';

interface GameOverlayProps {
  kind: OverlayKind;
  coins: number;
  totalCoins: number;
  onPlay: () => void;
}

export function GameOverlay({ kind, coins, totalCoins, onPlay }: GameOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-[2px]">
      <div className="animate-rise w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        {kind === 'ready' && <ReadyContent />}
        {kind === 'defeated' && <DefeatedContent />}
        {kind === 'complete' && <CompleteContent coins={coins} totalCoins={totalCoins} />}

        <button
          type="button"
          onClick={onPlay}
          autoFocus
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          {kind === 'ready' && (
            <>
              <Play className="h-5 w-5 fill-white" /> Start adventure
            </>
          )}
          {kind === 'defeated' && (
            <>
              <RotateCcw className="h-5 w-5" /> Try again
            </>
          )}
          {kind === 'complete' && (
            <>
              <RotateCcw className="h-5 w-5" /> Play again
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ReadyContent() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">World 1 · Level 1</p>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-[1.2] text-slate-900">Dragon Quest</h1>
      <p className="mt-2 text-base leading-[1.5] text-slate-600">Guide the knight through the Enchanted Forest.</p>
      <ul className="mt-5 space-y-2 text-left text-sm leading-[1.5] text-slate-700">
        <li>Jump onto Thornlings to defeat them.</li>
        <li>Collect gold coins along the way.</li>
        <li>Reach the glowing portal to finish the level.</li>
      </ul>
      <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-[1.5] text-slate-600">
        Phone: use the buttons to move and jump. Computer: arrow keys or A and D to move, Space to jump.
      </p>
    </>
  );
}

function DefeatedContent() {
  return (
    <>
      <Skull className="mx-auto h-14 w-14 text-rose-500" />
      <h2 className="mt-4 font-serif text-3xl font-bold leading-[1.2] text-slate-900">The forest won this time</h2>
      <p className="mt-2 text-base leading-[1.5] text-slate-600">
        You ran out of hearts. Give it another go and keep your footing.
      </p>
    </>
  );
}

function CompleteContent({ coins, totalCoins }: { coins: number; totalCoins: number }) {
  return (
    <>
      <Trophy className="mx-auto h-14 w-14 text-amber-500" />
      <h2 className="mt-4 font-serif text-3xl font-bold leading-[1.2] text-slate-900">LEVEL COMPLETE</h2>
      <p className="mt-2 text-base leading-[1.5] text-slate-600">
        You reached the portal with {coins} of {totalCoins} coins.
      </p>
    </>
  );
}
