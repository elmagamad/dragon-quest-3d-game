
import { useCallback, useEffect, useState } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHud } from '@/components/hud/GameHud';
import { GameOverlay, type OverlayKind } from '@/components/hud/GameOverlay';
import { TouchControls } from '@/components/hud/TouchControls';
import { MAX_HEALTH } from '@/game/constants';
import { createInputState, useGameControls } from '@/game/input';
import { forestLevel1 } from '@/game/levels/forestLevel1';
import { forestLevel2 } from '@/game/levels/forestLevel2';
import type { LevelDef, SimEvent } from '@/game/types';

type Status = OverlayKind | 'playing' | 'select';

const BONUS_COINS = 500;
const WALLET_KEY = 'dragonQuestWallet';
const LEVELS_KEY = 'dragonQuestUnlockedLevels';

function App() {
  const [input] = useState(createInputState);
  const [status, setStatus] = useState<Status>('ready');
  const [runId, setRunId] = useState(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [coins, setCoins] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(1);

  const [wallet, setWallet] = useState(() => {
    return Number(localStorage.getItem(WALLET_KEY)) || 0;
  });

  const [unlockedLevels, setUnlockedLevels] = useState<number[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(LEVELS_KEY) || '[1]'
      );
    } catch {
      return [1];
    }
  });

  const levels: Record<number, LevelDef> = {
    1: forestLevel1,
    2: forestLevel2,
  };

  const currentLevel = levels[selectedLevel] ?? forestLevel1;

  useEffect(() => {
    localStorage.setItem(WALLET_KEY, String(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem(
      LEVELS_KEY,
      JSON.stringify(unlockedLevels)
    );
  }, [unlockedLevels]);

  useGameControls(input);

  const startRun = useCallback(() => {
    setRunId((id) => id + 1);
    setHealth(MAX_HEALTH);
    setCoins(0);
    setStatus('playing');
  }, []);

  const handleEvent = useCallback((event: SimEvent) => {
    switch (event.type) {
      case 'coin':
        setCoins((count) => count + event.amount);
        setWallet((current) => current + event.amount);
        break;

      case 'hurt':
        setHealth(event.health);
        break;

      case 'won':
        if (selectedLevel === 1) {
          setWallet((current) => current + BONUS_COINS);
          setUnlockedLevels((current) =>
            current.includes(2) ? current : [...current, 2]
          );
        }
        setStatus('complete');
        break;

      case 'defeated':
        setStatus('defeated');
        break;
    }
  }, [selectedLevel]);

  const playing = status === 'playing';

  return (
    <div className="fixed left-0 top-0 h-[100dvh] w-[100vw] touch-none select-none overflow-hidden overscroll-none bg-sky-200">

      {status === 'select' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950 p-5">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 p-6 text-white shadow-2xl">

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Dragon Quest
              </p>

              <h1 className="mt-2 text-3xl font-black">
                Select Your Level
              </h1>

              <div className="mt-4 rounded-xl bg-black/40 p-3">
                <p className="text-sm text-amber-300">Your Wallet</p>
                <p className="text-2xl font-black">🪙 {wallet}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">

              <button
                onClick={() => {
                  setSelectedLevel(1);
                  setStatus('ready');
                }}
                className="w-full rounded-2xl border-2 border-emerald-400 bg-emerald-900/50 p-4 text-left transition hover:bg-emerald-800"
              >
                <div className="text-lg font-bold">🌲 Level 1</div>
                <div className="text-sm text-emerald-200">
                  Enchanted Forest · Unlocked
                </div>
              </button>

              <button
                disabled={!unlockedLevels.includes(2)}
                onClick={() => {
                  setSelectedLevel(2);
                  setStatus('ready');
                }}
                className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                  unlockedLevels.includes(2)
                    ? 'border-amber-400 bg-amber-900/40 hover:bg-amber-800'
                    : 'border-slate-700 bg-slate-800 opacity-60'
                }`}
              >
                <div className="text-lg font-bold">
                  {unlockedLevels.includes(2)
                    ? '🌑 Level 2'
                    : '🔒 Level 2'}
                </div>

                <div className="text-sm text-slate-300">
                  Dark Enchanted Forest ·{' '}
                  {unlockedLevels.includes(2)
                    ? 'Unlocked'
                    : 'Defeat Forest Guardian to unlock'}
                </div>
              </button>

            </div>

            <button
              onClick={() => setStatus('ready')}
              className="mt-5 w-full rounded-full bg-slate-700 px-5 py-3 font-bold hover:bg-slate-600"
            >
              Back
            </button>

          </div>
        </div>
      )}

      <GameCanvas
        active={playing}
        runId={runId}
        input={input}
        onEvent={handleEvent}
        level={currentLevel}
      />

      {playing && (
        <>
          <GameHud
            level={currentLevel}
            health={health}
            coins={coins}
          />
          <TouchControls input={input} />
        </>
      )}

      {!playing && status !== 'select' && (
        <GameOverlay
          kind={status}
          coins={coins}
          totalCoins={currentLevel.coins.length}
          onPlay={
            status === 'complete'
              ? () => setStatus('select')
              : startRun
          }
        />
      )}

      {!playing && status === 'ready' && (
        <button
          onClick={() => setStatus('select')}
          className="absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-xl"
        >
          🌍 Select Level
        </button>
      )}

      <div className="absolute right-3 top-3 z-40 rounded-xl bg-black/70 px-4 py-2 text-white">
        <div className="text-xs text-yellow-300">TOTAL WALLET</div>
        <div className="text-lg font-bold">🪙 {wallet}</div>
      </div>

    </div>
  );
}

export default App;
