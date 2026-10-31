
import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';

import { GameScene } from '@/components/game/GameScene';
import { BossIntro } from '@/components/game/BossIntro';

import type { InputState } from '@/game/input';
import { PALETTE } from '@/game/palette';
import type { SimEvent, LevelDef } from '@/game/types';

interface GameCanvasProps {
  active: boolean;
  runId: number;
  input: InputState;
  onEvent: (event: SimEvent) => void;
  level: LevelDef;
}

export function GameCanvas({
  active,
  runId,
  input,
  onEvent,
  level,
}: GameCanvasProps) {
  const [bossIntroVisible, setBossIntroVisible] =
    useState(false);

  const [bossFightStarted, setBossFightStarted] =
    useState(false);

  const [devMenuVisible, setDevMenuVisible] =
    useState(false);

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    setBossIntroVisible(false);
    setBossFightStarted(false);
    setDevMenuVisible(false);
  }, [runId, level]);

  const startLongPress = () => {
    pressTimer.current = setTimeout(() => {
      setDevMenuVisible(true);
    }, 1500);
  };

  const cancelLongPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const sendCommand = (command: string) => {
    window.dispatchEvent(
      new CustomEvent('dragon-dev-command', {
        detail: command,
      })
    );
    setDevMenuVisible(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Canvas
        key={runId}
        dpr={[1, 2]}
        camera={{
          position: [0, 3.4, 10.5],
          fov: 46,
          near: 0.1,
          far: 300,
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[PALETTE.sky]} />
        <fog attach="fog" args={[PALETTE.fog, 38, 120]} />

        <hemisphereLight
          args={['#eafcff', '#4d7d3a', 1.2]}
        />

        <directionalLight
          position={[8, 18, 12]}
          intensity={1.3}
          color="#fff4d9"
        />

        <Sky
          distance={450000}
          sunPosition={[60, 25, -40]}
          turbidity={3}
          rayleigh={1.4}
        />

        <GameScene
          active={active}
          runId={runId}
          level={level}
          input={input}
          onEvent={onEvent}
          bossFightStarted={bossFightStarted}
          onBossTrigger={() => setBossIntroVisible(true)}
        />
      </Canvas>

      {/* Fixed Secret Developer Button */}
      {active && (
        <button
          onPointerDown={startLongPress}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            top: 70,
            right: 15,
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.5)',
            background: 'rgba(17,24,39,0.85)',
            color: '#fbbf24',
            fontSize: 24,
            zIndex: 9999,
            cursor: 'pointer',
            touchAction: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          }}
        >
          ⚙️
        </button>
      )}

      {/* Developer Menu */}
      {devMenuVisible && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 320,
              padding: 22,
              borderRadius: 20,
              background: '#111827',
              border: '1px solid #374151',
              color: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <h2 style={{ color: '#fbbf24', margin: '0 0 5px' }}>
              🛠 Developer Menu
            </h2>

            <p style={{ color: '#9ca3af', fontSize: 12 }}>
              TESTING TOOLS
            </p>

            <button onClick={() => sendCommand('boss')} style={buttonStyle}>
              🌀 Teleport to Boss
            </button>

            <button onClick={() => sendCommand('god')} style={buttonStyle}>
              🛡️ Toggle God Mode
            </button>

            <button onClick={() => sendCommand('kill')} style={buttonStyle}>
              ⚔️ Instant Kill Boss
            </button>

            <button
              onClick={() => sendCommand('complete')}
              style={{ ...buttonStyle, background: '#166534' }}
            >
              🏆 Complete Level
            </button>

            <button
              onClick={() => setDevMenuVisible(false)}
              style={{ ...buttonStyle, background: '#374151' }}
            >
              ✖ Close Menu
            </button>
          </div>
        </div>
      )}

      <BossIntro
        show={bossIntroVisible && active}
        onComplete={() => {
          setBossIntroVisible(false);
          setBossFightStarted(true);
        }}
      />
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '13px 10px',
  marginBottom: 10,
  border: 'none',
  borderRadius: 10,
  background: '#1f2937',
  color: 'white',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};
