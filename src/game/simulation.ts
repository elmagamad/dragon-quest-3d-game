import {
  AIR_ACCEL,
  COIN_RADIUS,
  COYOTE_TIME,
  ENEMY_HALF_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_SPEED,
  FALL_LIMIT,
  GROUND_ACCEL,
  BRUTE_HALF_WIDTH,
  BRUTE_HEALTH,
  JUMP_BUFFER_TIME,
  JUMP_VELOCITY,
  MAX_HEALTH,
  MOVE_SPEED,
  PLATFORM_DEPTH,
  PLATFORM_THICKNESS,
  PLAYER_CENTER_HEIGHT,
  PLAYER_HALF_WIDTH,
  PLAYER_HEIGHT,
  PORTAL_RADIUS,
  STOMP_BOUNCE,
} from '@/game/constants';
import type { InputState } from '@/game/input';
import { hurtPlayer, applySwordHits, beginSwing, patrol, tickSwing, updateBrute } from '@/game/combat';
import { movePlayer } from '@/game/physics';
import type { EnemySpawn, LevelDef, Platform, Box, Sim, SimEvent, EnemyState } from '@/game/types';

function platformBox(p: Platform): Box {
  return {
    minX: p.x - p.w / 2,
    maxX: p.x + p.w / 2,
    minY: p.y - PLATFORM_THICKNESS,
    maxY: p.y,
    minZ: -PLATFORM_DEPTH / 2,
    maxZ: PLATFORM_DEPTH / 2,
  };
}

function createEnemy(level: LevelDef, spawn: EnemySpawn, index: number): EnemyState {
  const platform = level.platforms[spawn.platform];
  const kind = spawn.kind ?? 'thornling';
  const edgeMargin = (kind === 'brute' ? BRUTE_HALF_WIDTH : ENEMY_HALF_WIDTH) + 0.3;
  const leashMin = platform.x - platform.w / 2 + edgeMargin;
  const leashMax = platform.x + platform.w / 2 - edgeMargin;
  return {
    kind,
    x: spawn.x,
    y: platform.y,
    minX: Math.max(leashMin, spawn.x - spawn.range),
    maxX: Math.min(leashMax, spawn.x + spawn.range),
    leashMin,
    leashMax,
    dir: index % 2 === 0 ? 1 : -1,
    alive: true,
    deadTime: 0,
    phase: index * 1.7,
    health: kind === 'brute' ? BRUTE_HEALTH : 1,
    hitFlash: 0,
    lastHitSwing: -1,
    windup: 0,
    cooldown: 0,
  };
}

export function createSim(level: LevelDef): Sim {
  return {
    level,
    boxes: [...level.platforms.map(platformBox), ...level.walls],
    player: {
      x: level.spawn.x,
      y: level.spawn.y,
      vx: 0,
      vy: 0,
      onGround: false,
      groundY: level.spawn.y,
      coyote: 0,
      jumpBuffer: 0,
      stun: 0,
      invuln: 0,
      health: MAX_HEALTH,
      facing: 1,
      anim: 0,
      checkpoint: 0,
      swingTime: -1,
      swingId: 0,
      attackCooldown: 0,
    },
    enemies: level.enemies.map((spawn, i) => createEnemy(level, spawn, i)),
    coins: level.coins.map((c) => ({ x: c.x, y: c.y, collected: false })),
    outcome: 'running',
    elapsed: 0,
  };
}

function respawnAtCheckpoint(sim: Sim) {
  const p = sim.player;
  const cp = sim.level.checkpoints[p.checkpoint];
  p.x = cp.x;
  p.y = cp.y + 0.5;
  p.vx = 0;
  p.vy = 0;
  p.stun = 0;
  p.onGround = false;
  p.groundY = cp.y;
}

function updateEnemies(sim: Sim, dt: number, events: SimEvent[]) {
  for (const e of sim.enemies) {
    if (!e.alive) {
      e.deadTime += dt;
      continue;
    }
    e.phase += dt;
    e.hitFlash = Math.max(0, e.hitFlash - dt);
    if (e.kind === 'brute') updateBrute(sim, e, dt, events);
    else patrol(e, ENEMY_SPEED, dt);
  }
}

function collideEnemies(sim: Sim, prevFeetY: number, events: SimEvent[]) {
  const p = sim.player;
  for (const e of sim.enemies) {
    if (!e.alive || e.kind !== 'thornling') continue;
    const touchX = Math.abs(p.x - e.x) < PLAYER_HALF_WIDTH + ENEMY_HALF_WIDTH;
    const touchY = p.y < e.y + ENEMY_HEIGHT && p.y + PLAYER_HEIGHT > e.y;
    if (!touchX || !touchY) continue;

    const enemyTop = e.y + ENEMY_HEIGHT;
    if (p.vy < 0 && prevFeetY >= enemyTop - 0.25) {
      e.alive = false;
      e.deadTime = 0;
      p.vy = STOMP_BOUNCE;
      p.onGround = false;
      continue;
    }
    hurtPlayer(sim, e.x, events);
    if (sim.outcome !== 'running') return;
  }
}

function collectCoins(sim: Sim, events: SimEvent[]) {
  const p = sim.player;
  for (const c of sim.coins) {
    if (c.collected) continue;
    const touchX = Math.abs(p.x - c.x) < PLAYER_HALF_WIDTH + COIN_RADIUS;
    const touchY = p.y < c.y + COIN_RADIUS && p.y + PLAYER_HEIGHT > c.y - COIN_RADIUS;
    if (touchX && touchY) {
      c.collected = true;
      events.push({ type: 'coin', amount: 1 });
    }
  }
}

function updateCheckpoints(sim: Sim) {
  const p = sim.player;
  const cps = sim.level.checkpoints;
  while (p.checkpoint + 1 < cps.length && p.x >= cps[p.checkpoint + 1].x) {
    p.checkpoint += 1;
  }
}

function checkPortal(sim: Sim, events: SimEvent[]) {
  if (!sim.enemies.every((e) => !e.alive)) return;
  const p = sim.player;
  const portal = sim.level.portal;
  const dx = p.x - portal.x;
  const dy = p.y + PLAYER_CENTER_HEIGHT - (portal.y + PORTAL_RADIUS);
  if (dx * dx + dy * dy < PORTAL_RADIUS * PORTAL_RADIUS) {
    sim.outcome = 'won';
    events.push({ type: 'won' });
  }
}

export function stepSim(sim: Sim, input: InputState, dt: number): SimEvent[] {
  const events: SimEvent[] = [];
  if (sim.outcome !== 'running') return events;

  const p = sim.player;
  sim.elapsed += dt;
  p.anim += dt;
  p.invuln = Math.max(0, p.invuln - dt);
  p.stun = Math.max(0, p.stun - dt);
  tickSwing(p, dt);

  if (input.attack) {
    input.attack = false;
    if (p.attackCooldown <= 0 && p.stun <= 0 && p.swingTime < 0) beginSwing(p);
  }

  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (input.jump) {
    p.jumpBuffer = JUMP_BUFFER_TIME;
    input.jump = false;
  }

  if (p.stun <= 0) {
    if (direction !== 0) p.facing = direction > 0 ? 1 : -1;
    const accel = p.onGround ? GROUND_ACCEL : AIR_ACCEL;
    p.vx += (direction * MOVE_SPEED - p.vx) * Math.min(1, accel * dt);
  }

  p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
  if (p.jumpBuffer > 0 && (p.onGround || p.coyote > 0)) {
    p.vy = JUMP_VELOCITY;
    p.onGround = false;
    p.jumpBuffer = 0;
    p.coyote = 0;
  }

  const prevFeetY = p.y;
  movePlayer(p, sim.boxes, dt);
  p.coyote = p.onGround ? COYOTE_TIME : Math.max(0, p.coyote - dt);

  updateEnemies(sim, dt, events);
  if (sim.outcome !== 'running') return events;
  applySwordHits(sim, events);
  collideEnemies(sim, prevFeetY, events);
  if (sim.outcome !== 'running') return events;

  collectCoins(sim, events);
  updateCheckpoints(sim);
  checkPortal(sim, events);
  if (sim.outcome !== 'running') return events;

  if (p.y < FALL_LIMIT) {
    hurtPlayer(sim, p.x, events);
    if (sim.outcome === 'running') respawnAtCheckpoint(sim);
  }

  return events;
}
