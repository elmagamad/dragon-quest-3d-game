
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';

import { GameScene } from '@/components/game/GameScene';
import { BossIntro } from '@/components/game/BossIntro';

import type { InputState } from '@/game/input';
import { PALETTE } from '@/game/palette';
import type { SimEvent } from '@/game/types';

interface GameCanvasProps {
  active: boolean;
  runId: number;
  input: InputState;
  onEvent: (event: SimEvent) => void;
}

export function GameCanvas({
  active,
  runId,
  input,
  onEvent,
}: GameCanvasProps) {
  const [bossIntroVisible, setBossIntroVisible] =
    useState(false);

  const [bossFightStarted, setBossFightStarted] =
    useState(false);

  const [victoryVisible, setVictoryVisible] =
    useState(false);

  const [rewardClaimed, setRewardClaimed] =
    useState(false);

  useEffect(() => {
    setBossIntroVisible(false);
    setBossFightStarted(false);
    setVictoryVisible(false);
    setRewardClaimed(false);
  }, [runId]);

  const handleVictory = () => {
    setVictoryVisible(true);
  };

  const handleNextLevel = () => {
    setVictoryVisible(false);
    setRewardClaimed(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Canvas
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
          key={runId}
          active={active && !victoryVisible}
          input={input}
          onEvent={onEvent}
          bossFightStarted={bossFightStarted}
          onBossTrigger={() => setBossIntroVisible(true)}
        />
      </Canvas>

      {/* Boss Introduction */}
      <BossIntro
        show={bossIntroVisible && !victoryVisible}
        onComplete={() => {
          setBossIntroVisible(false);
          setBossFightStarted(true);
        }}
      />

      {/* Victory Screen */}
      {victoryVisible && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(circle, rgba(20,40,20,0.88), rgba(0,0,0,0.96))',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(36px, 9vw, 72px)',
              fontWeight: 900,
              color: '#ffd700',
              textShadow: '0 0 25px #ff9800',
              marginBottom: 12,
            }}
          >
            🏆 YOU WIN!
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            FOREST GUARDIAN DEFEATED
          </div>

          <div
            style={{
              fontSize: 20,
              color: '#a5ffb0',
              marginBottom: 30,
            }}
          >
            {rewardClaimed
              ? 'Reward claimed!'
              : '🎁 Reward: 500 Coins'}
          </div>

          <button
            onClick={handleNextLevel}
            style={{
              padding: '16px 36px',
              borderRadius: 12,
              border: '2px solid #ffd700',
              background: 'linear-gradient(135deg, #ffb300, #ff6f00)',
              color: '#1b1600',
              fontSize: 20,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(255,193,7,0.5)',
            }}
          >
            {rewardClaimed
              ? 'LEVEL 2 UNLOCKED'
              : 'NEXT LEVEL ➜'}
          </button>
        </div>
      )}
    </div>
  );
}
