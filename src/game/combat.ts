import {
  BRUTE_ATTACK_RANGE,
  BRUTE_CHASE_SPEED,
  BRUTE_COOLDOWN,
  BRUTE_DETECT_RANGE,
  BRUTE_HALF_WIDTH,
  BRUTE_HEIGHT,
  BRUTE_PATROL_SPEED,
  BRUTE_WINDUP,
  ENEMY_REWARD_COINS,
  HIT_FLASH_TIME,
  HURT_INVULNERABLE_TIME,
  KNOCKBACK_SPEED_X,
  KNOCKBACK_SPEED_Y,
  KNOCKBACK_STUN,
  LEVEL_SAME_HEIGHT,
  PLAYER_HEIGHT,
  SWORD_ACTIVE_END,
  SWORD_ACTIVE_START,
  SWORD_COOLDOWN,
  SWORD_REACH,
  SWORD_SWING_DURATION,
} from '@/game/constants';
import type { EnemyState, PlayerState, Sim, SimEvent } from '@/game/types';

function overlapsVertically(playerY: number, enemyY: number, enemyHeight: number) {
  return playerY < enemyY + enemyHeight && playerY + PLAYER_HEIGHT > enemyY;
}

export function hurtPlayer(sim: Sim, fromX: number, events: SimEvent[]) {
  const p = sim.player;
  if (p.invuln > 0) return;
  p.health -= 1;
  p.invuln = HURT_INVULNERABLE_TIME;
  events.push({ type: 'hurt', health: p.health });
  if (p.health <= 0) {
    sim.outcome = 'lost';
    events.push({ type: 'defeated' });
    return;
  }
  p.stun = KNOCKBACK_STUN;
  p.vx = (p.x < fromX ? -1 : 1) * KNOCKBACK_SPEED_X;
  p.vy = KNOCKBACK_SPEED_Y;
  p.onGround = false;
}

export function patrol(e: EnemyState, speed: number, dt: number) {
  e.x += e.dir * speed * dt;
  if (e.x <= e.minX) {
    e.x = e.minX;
    e.dir = 1;
  } else if (e.x >= e.maxX) {
    e.x = e.maxX;
    e.dir = -1;
  }
}

export function beginSwing(p: PlayerState) {
  p.swingTime = 0;
  p.swingId += 1;
  p.attackCooldown = SWORD_COOLDOWN;
}

export function tickSwing(p: PlayerState, dt: number) {
  p.attackCooldown = Math.max(0, p.attackCooldown - dt);
  if (p.swingTime < 0) return;
  p.swingTime += dt;
  if (p.swingTime >= SWORD_SWING_DURATION) p.swingTime = -1;
}

export function applySwordHits(sim: Sim, events: SimEvent[]) {
  const p = sim.player;
  if (p.swingTime < SWORD_ACTIVE_START || p.swingTime > SWORD_ACTIVE_END) return;
  for (const e of sim.enemies) {
    if (!e.alive || e.kind !== 'brute' || e.lastHitSwing === p.swingId) continue;
    const dx = e.x - p.x;
    if (dx * p.facing <= 0 || Math.abs(dx) > SWORD_REACH + BRUTE_HALF_WIDTH) continue;
    if (!overlapsVertically(p.y, e.y, BRUTE_HEIGHT)) continue;

    e.lastHitSwing = p.swingId;
    e.health -= 1;
    e.hitFlash = HIT_FLASH_TIME;
    if (e.health <= 0) {
      e.alive = false;
      e.deadTime = 0;
      events.push({ type: 'coin', amount: ENEMY_REWARD_COINS });
    }
  }
}

function moveWithinLeash(e: EnemyState, speed: number, dt: number) {
  e.x = Math.min(e.leashMax, Math.max(e.leashMin, e.x + e.dir * speed * dt));
}

export function updateBrute(sim: Sim, e: EnemyState, dt: number, events: SimEvent[]) {
  const p = sim.player;
  e.cooldown = Math.max(0, e.cooldown - dt);
  const dx = p.x - e.x;
  const sameLevel = Math.abs(p.y - e.y) < LEVEL_SAME_HEIGHT;

  if (e.windup > 0) {
    e.dir = dx >= 0 ? 1 : -1;
    e.windup -= dt;
    if (e.windup <= 0) {
      e.windup = 0;
      e.cooldown = BRUTE_COOLDOWN;
      if (sameLevel && Math.abs(dx) <= BRUTE_ATTACK_RANGE) hurtPlayer(sim, e.x, events);
    }
    return;
  }

  if (sameLevel && Math.abs(dx) <= BRUTE_DETECT_RANGE) {
    e.dir = dx >= 0 ? 1 : -1;
    if (Math.abs(dx) <= BRUTE_ATTACK_RANGE) {
      if (e.cooldown <= 0) e.windup = BRUTE_WINDUP;
      return;
    }
    moveWithinLeash(e, BRUTE_CHASE_SPEED, dt);
    return;
  }

  patrol(e, BRUTE_PATROL_SPEED, dt);
}
