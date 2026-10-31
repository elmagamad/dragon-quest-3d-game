
import { useCallback, useEffect, useState } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHud } from '@/components/hud/GameHud';
import { GameOverlay, type OverlayKind } from '@/components/hud/GameOverlay';
import { TouchControls } from '@/components/hud/TouchControls';
import { MAX_HEALTH } from '@/game/constants';
import { createInputState, useGameControls } from '@/game/input';
import { forestLevel1 } from '@/game/levels/forestLevel1';
import type { SimEvent } from '@/game/types';

type Status = OverlayKind | 'playing';

const BONUS_COINS = 500;
const WALLET_KEY = 'dragonQuestWallet';
const LEVELS_KEY = 'dragonQuestUnlockedLevels';

function App() {
  const [input] = useState(createInputState);
  const [status, setStatus] = useState<Status>('ready');
  const [runId, setRunId] = useState(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [coins, setCoins] = useState(0);

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
        setWallet((current) => current + BONUS_COINS);
        setUnlockedLevels((current) =>
          current.includes(2) ? current : [...current, 2]
        );
        setStatus('complete');
        break;

      case 'defeated':
        setStatus('defeated');
        break;
    }
  }, []);

  const playing = status === 'playing';

  return (
    <div className="fixed left-0 top-0 h-[100dvh] w-[100vw] touch-none select-none overflow-hidden overscroll-none bg-sky-200">

      <GameCanvas
        active={playing}
        runId={runId}
        input={input}
        onEvent={handleEvent}
      />

      {playing && (
        <>
          <GameHud
            level={forestLevel1}
            health={health}
            coins={coins}
          />
          <TouchControls input={input} />
        </>
      )}

      {!playing && (
        <GameOverlay
          kind={status}
          coins={coins}
          totalCoins={forestLevel1.coins.length}
          onPlay={startRun}
        />
      )}

      <div className="absolute top-3 right-3 z-50 rounded-xl bg-black/70 px-4 py-2 text-white">
        <div className="text-xs text-yellow-300">TOTAL WALLET</div>
        <div className="text-lg font-bold">🪙 {wallet}</div>
        <div className="text-xs text-green-300 mt-1">
          {unlockedLevels.length} Level(s) Unlocked
        </div>
      </div>

    </div>
  );
}

export default App;
