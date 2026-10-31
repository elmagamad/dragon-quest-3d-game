
import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

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

  useEffect(() => {
    setBossIntroVisible(false);
    setBossFightStarted(false);
    setDevMenuVisible(false);
  }, [runId, level]);

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

      {/* Fixed Developer Button */}
      {active && (
        <button
          type="button"
          onClick={() => setDevMenuVisible(true)}
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            width: 52,
            height: 52,
            borderRadius: 14,
            border: '2px solid #fbbf24',
            background: '#111827',
            color: '#fbbf24',
            fontSize: 26,
            fontWeight: 'bold',
            zIndex: 99999,
            cursor: 'pointer',
            touchAction: 'manipulation',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          ⚙️
        </button>
      )}

      {/* Developer Menu */}
      {devMenuVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            padding: 16,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 340,
              maxHeight: '90dvh',
              overflowY: 'auto',
              padding: 22,
              borderRadius: 20,
              background: '#111827',
              border: '2px solid #fbbf24',
              color: 'white',
              fontFamily: 'sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <h2
              style={{
                color: '#fbbf24',
                margin: '0 0 8px',
                textAlign: 'center',
                fontSize: 22,
              }}
            >
              🛠 Developer Menu
            </h2>

            <p
              style={{
                color: '#9ca3af',
                fontSize: 12,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              GAME TESTING TOOLS
            </p>

            <button
              type="button"
              onClick={() => sendCommand('boss')}
              style={buttonStyle}
            >
              🌀 Teleport to Boss
            </button>

            <button
              type="button"
              onClick={() => sendCommand('god')}
              style={buttonStyle}
            >
              🛡️ Toggle God Mode
            </button>

            <button
              type="button"
              onClick={() => sendCommand('kill')}
              style={buttonStyle}
            >
              ⚔️ Instant Kill Boss
            </button>

            <button
              type="button"
              onClick={() => sendCommand('complete')}
              style={{
                ...buttonStyle,
                background: '#166534',
              }}
            >
              🏆 Complete Level
            </button>

            <button
              type="button"
              onClick={() => setDevMenuVisible(false)}
              style={{
                ...buttonStyle,
                background: '#374151',
                marginBottom: 0,
              }}
            >
              ✖ Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Boss Intro */}
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

const buttonStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '14px 10px',
  marginBottom: 10,
  border: '1px solid #4b5563',
  borderRadius: 10,
  background: '#1f2937',
  color: 'white',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  touchAction: 'manipulation',
};
