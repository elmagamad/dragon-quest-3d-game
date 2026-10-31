
import { useMemo, useRef, useState, useEffect } from 'react';
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
import { createSim, stepSim } from '@/game/simulation';
import { hurtPlayer } from '@/game/combat';
import type { SimEvent, LevelDef } from '@/game/types';

const MAX_FRAME_STEP = 1 / 30;
const CAMERA_SMOOTHING = 6;

const BOSS_TRIGGER_X = 100;
const BOSS_POSITION_X = 100;
const BOSS_MAX_HEALTH = 100;
const BOSS_DAMAGE = 10;
const BOSS_REACH = 2.2;

interface GameSceneProps {
  active: boolean;
  runId: number;
  level: LevelDef;
  input: InputState;
  onEvent: (event: SimEvent) => void;
  bossFightStarted: boolean;
  onBossTrigger: () => void;
}

export function GameScene({
  active,
  runId,
  level,
  input,
  onEvent,
  bossFightStarted,
  onBossTrigger,
}: GameSceneProps) {
  const [sim, setSim] = useState(() => createSim(level));

  const [bossTriggered, setBossTriggered] = useState(false);
  const [bossHealth, setBossHealth] = useState(BOSS_MAX_HEALTH);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [bossHit, setBossHit] = useState(false);

  const lastBossHitSwing = useRef(-1);
  const hitTimer = useRef(0);
  const bossAttackTimer = useRef(2);
  const victorySent = useRef(false);

  const camera = useThree(
    (state) => state.camera
  ) as PerspectiveCamera;

  const viewport = useThree((state) => state.size);
  const focus = useMemo(() => new Vector3(), []);

  // Reset simulation whenever a new run or level starts
  useEffect(() => {
    setSim(createSim(level));

    setBossTriggered(false);
    setBossHealth(BOSS_MAX_HEALTH);
    setBossDefeated(false);
    setBossHit(false);

    lastBossHitSwing.current = -1;
    hitTimer.current = 0;
    bossAttackTimer.current = 2;
    victorySent.current = false;
  }, [runId, level]);
const hasBoss = level.name === 'Level 1';
  useFrame((_, delta) => {
    const dt = Math.min(delta, MAX_FRAME_STEP);

    // Boss encounter exists only in Level 1
    const hasBoss = level.name === 'Level 1';

    // Trigger boss introduction
    if (
      active &&
      hasBoss &&
      !bossTriggered &&
      sim.player.x >= BOSS_TRIGGER_X
    ) {
      setBossTriggered(true);
      onBossTrigger();
    }

    // Boss hit visual timer
    if (hitTimer.current > 0) {
      hitTimer.current -= dt;

      if (hitTimer.current <= 0) {
        setBossHit(false);
      }
    }

    // Main game simulation
    if (
      active &&
      (!bossTriggered || bossFightStarted) &&
      !bossDefeated
    ) {
      const safeInput: InputState =
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

      for (const event of events) {
        onEvent(event);
      }

      const player = sim.player;

      // Forest Guardian combat
      if (hasBoss && bossTriggered && bossFightStarted) {

        // Player sword attacks boss
        if (
          player.swingTime >= 0.15 &&
          player.swingTime <= 0.35 &&
          player.swingId !== lastBossHitSwing.current
        ) {
          const dx = BOSS_POSITION_X - player.x;
          const facingBoss = dx * player.facing > 0;
          const inRange = Math.abs(dx) <= BOSS_REACH;

          if (facingBoss && inRange && player.y < 2.5) {
            lastBossHitSwing.current = player.swingId;

            const nextHealth = Math.max(
              0,
              bossHealth - BOSS_DAMAGE
            );

            setBossHealth(nextHealth);
            setBossHit(true);
            hitTimer.current = 0.25;

            if (
              nextHealth <= 0 &&
              !victorySent.current
            ) {
              victorySent.current = true;
              setBossDefeated(true);
              onEvent({ type: 'won' });
            }
          }
        }

        // Boss attacks player
        if (!bossDefeated) {
          bossAttackTimer.current -= dt;

          const distanceToBoss = Math.abs(
            player.x - BOSS_POSITION_X
          );

          if (
            bossAttackTimer.current <= 0 &&
            distanceToBoss <= 3 &&
            player.y < 2
          ) {
            const attackEvents: SimEvent[] = [];

            hurtPlayer(
              sim,
              BOSS_POSITION_X,
              attackEvents
            );

            for (const event of attackEvents) {
              if (
                event.type === 'hurt' ||
                event.type === 'defeated'
              ) {
                onEvent(event);
              }
            }

            bossAttackTimer.current = 2.5;
          }
        }
      }
    }

    // Camera follow
    const player = sim.player;

    const portrait =
      viewport.width / viewport.height < 0.8;

    const targetFov = portrait ? 55 : 46;

    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }

    const follow =
      1 - Math.exp(-CAMERA_SMOOTHING * dt);

    const distance = portrait ? 13 : 10.5;
    const height = portrait ? 2.8 : 3.4;

    camera.position.x +=
      (player.x - camera.position.x) * follow;

    camera.position.y +=
      (player.y + height - camera.position.y) * follow;

    camera.position.z +=
      (distance - camera.position.z) * follow;

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
      )}

      {hasBoss && bossTriggered && (
        <ForestGuardian
          position={[BOSS_POSITION_X, 0, -3]}
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
