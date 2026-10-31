import { useCallback, useState } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHud } from '@/components/hud/GameHud';
import { GameOverlay, type OverlayKind } from '@/components/hud/GameOverlay';
import { TouchControls } from '@/components/hud/TouchControls';
import { MAX_HEALTH } from '@/game/constants';
import { createInputState, useGameControls } from '@/game/input';
import { forestLevel1 } from '@/game/levels/forestLevel1';
import type { SimEvent } from '@/game/types';

type Status = OverlayKind | 'playing';

function App() {
  const [input] = useState(createInputState);
  const [status, setStatus] = useState<Status>('ready');
  const [runId, setRunId] = useState(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [coins, setCoins] = useState(0);

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
        break;
      case 'hurt':
        setHealth(event.health);
        break;
      case 'won':
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
      <GameCanvas active={playing} runId={runId} input={input} onEvent={handleEvent} />

      {playing && (
        <>
          <GameHud level={forestLevel1} health={health} coins={coins} />
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
    </div>
  );
}

export default App;
