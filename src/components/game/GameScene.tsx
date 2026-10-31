
import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';

import { Coin } from '@/components/game/pickups/Coin';
import { Portal } from '@/components/game/pickups/Portal';
import { Knight } from '@/components/game/characters/Knight';
import { Brute } from '@/components/game/characters/Brute';
import { Thornling } from '@/components/game/characters/Thornling';
import { ForestGuardian } from '@/components/game/ForestGuardian';

import { Fireflies } from '@/components/game/world/Fireflies';
import { ForestDecor } from '@/components/game/world/ForestDecor';
import { Platforms } from '@/components/game/world/Platforms';

import type { InputState } from '@/game/input';
import { forestLevel1 } from '@/game/levels/forestLevel1';
import { createSim, stepSim } from '@/game/simulation';
import { hurtPlayer } from '@/game/combat';
import type { SimEvent } from '@/game/types';

const MAX_FRAME_STEP = 1 / 30;
const CAMERA_SMOOTHING = 6;
const BOSS_TRIGGER_X = 100;

const BOSS_MAX_HEALTH = 100;
const BOSS_DAMAGE = 10;
const BOSS_REACH = 2.2;

interface GameSceneProps {
  active: boolean;
  input: InputState;
  onEvent: (event: SimEvent) => void;
  bossFightStarted: boolean;
  onBossTrigger: () => void;
}

export function GameScene({
  active,
  input,
  onEvent,
  bossFightStarted,
  onBossTrigger,
}: GameSceneProps) {
  const [sim] = useState(() => createSim(forestLevel1));

  const [bossTriggered, setBossTriggered] = useState(false);
  const [bossHealth, setBossHealth] = useState(BOSS_MAX_HEALTH);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [bossHit, setBossHit] = useState(false);

  const lastBossHitSwing = useRef(-1);
  const hitTimer = useRef(0);
  const bossAttackTimer = useRef(2);

  const camera = useThree(
    (state) => state.camera
  ) as PerspectiveCamera;

  const viewport = useThree((state) => state.size);
  const focus = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, MAX_FRAME_STEP);

    if (active && !bossTriggered && sim.player.x >= BOSS_TRIGGER_X) {
      setBossTriggered(true);
      onBossTrigger();
    }

    if (hitTimer.current > 0) {
      hitTimer.current -= dt;

      if (hitTimer.current <= 0) {
        setBossHit(false);
      }
    }

    if (
      active &&
      (!bossTriggered || bossFightStarted) &&
      !bossDefeated
    ) {
      const safeInput =
  bossTriggered && !bossFightStarted
    ? {
        ...input,
        left: false,
        right: false,
        jump: false,
        attack: false,
      }
    : input;

const events = stepSim(sim, safeInput, dt);
  bossTriggered && !bossFightStarted
    ? {
        ...input,
        left: false,
        right: false,
        jump: false,
        attack: false,
      }
    : input,
  dt
);

      for (const event of events) {
        onEvent(event);
      }

      const player = sim.player;

      // Detect a successful sword hit on the boss
      if (
        bossTriggered &&
        bossFightStarted &&
        player.swingTime >= 0.15 &&
        player.swingTime <= 0.35 &&
        player.swingId !== lastBossHitSwing.current
      ) {
        const dx = 100 - player.x;
        const facingBoss = dx * player.facing > 0;
        const inRange = Math.abs(dx) <= BOSS_REACH;

        if (facingBoss && inRange && player.y < 2.5) {
          lastBossHitSwing.current = player.swingId;

          const nextHealth = Math.max(0, bossHealth - BOSS_DAMAGE);
          setBossHealth(nextHealth);

          setBossHit(true);
          hitTimer.current = 0.25;

          if (nextHealth <= 0) {
            setBossDefeated(true);
          }
        }
      }

      // Boss attacks the player when nearby
      if (bossTriggered && bossFightStarted) {
        bossAttackTimer.current -= dt;

        const distanceToBoss = Math.abs(player.x - 100);

        if (
          bossAttackTimer.current <= 0 &&
          distanceToBoss <= 3 &&
          player.y < 2
        ) {
          hurtPlayer(sim, 100, events);

          for (const event of events) {
            if (event.type === 'hurt' || event.type === 'defeated') {
              onEvent(event);
            }
          }

          bossAttackTimer.current = 2.5;
        }
      }
    }

    const { player } = sim;

    const portrait = viewport.width / viewport.height < 0.8;
    const targetFov = portrait ? 55 : 46;

    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }

    const follow = 1 - Math.exp(-CAMERA_SMOOTHING * dt);
    const distance = portrait ? 13 : 10.5;
    const height = portrait ? 2.8 : 3.4;

    camera.position.x += (player.x - camera.position.x) * follow;
    camera.position.y += (player.y + height - camera.position.y) * follow;
    camera.position.z += (distance - camera.position.z) * follow;

    focus.set(player.x, player.y + 1, 0);
    camera.lookAt(focus);
  });

  return (
    <>
      <Platforms platforms={sim.level.platforms} />
      <ForestDecor platforms={sim.level.platforms} />
      <Fireflies />

      <Knight player={sim.player} />

      {sim.enemies.map((enemy, i) =>
        enemy.kind === 'brute' ? (
          <Brute key={i} enemy={enemy} />
        ) : (
          <Thornling key={i} enemy={enemy} />
        )
      )}

      {sim.coins.map((coin, i) => (
        <Coin key={i} coin={coin} />
      ))}

      {bossTriggered && (
        <ForestGuardian
          position={[100, 0, -3]}
          health={bossHealth}
          maxHealth={BOSS_MAX_HEALTH}
          hit={bossHit}
          defeated={bossDefeated}
        />
      )}

      <Portal
        position={sim.level.portal}
        enemies={sim.enemies}
      />
    </>
  );
}
