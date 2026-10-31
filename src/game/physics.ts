import {
  GRAVITY,
  MAX_FALL_SPEED,
  PLAYER_HALF_WIDTH,
  PLAYER_HEIGHT,
} from '@/game/constants';
import type { Box, PlayerState } from '@/game/types';

const EPS = 0.001;
const HW = PLAYER_HALF_WIDTH;
const H = PLAYER_HEIGHT;

function overlapsX(p: PlayerState, b: Box) {
  return p.x + HW > b.minX && p.x - HW < b.maxX;
}

function overlapsY(p: PlayerState, b: Box) {
  return p.y + H > b.minY + EPS && p.y < b.maxY - EPS;
}

export function movePlayer(p: PlayerState, boxes: Box[], dt: number) {
  p.x += p.vx * dt;
  for (const b of boxes) {
    if (!overlapsY(p, b) || !overlapsX(p, b)) continue;
    p.x = p.vx >= 0 ? b.minX - HW : b.maxX + HW;
  }

  const prevY = p.y;
  p.vy = Math.max(p.vy - GRAVITY * dt, -MAX_FALL_SPEED);
  p.y += p.vy * dt;
  p.onGround = false;

  if (p.vy <= 0) {
    let landY = -Infinity;
    for (const b of boxes) {
      if (!overlapsX(p, b)) continue;
      if (prevY >= b.maxY - EPS && p.y < b.maxY) landY = Math.max(landY, b.maxY);
    }
    if (landY !== -Infinity) {
      p.y = landY;
      p.vy = 0;
      p.onGround = true;
      p.groundY = landY;
    }
  } else {
    let ceiling = Infinity;
    for (const b of boxes) {
      if (!overlapsX(p, b)) continue;
      if (prevY + H <= b.minY + EPS && p.y + H > b.minY) ceiling = Math.min(ceiling, b.minY);
    }
    if (ceiling !== Infinity) {
      p.y = ceiling - H;
      p.vy = 0;
    }
  }
}
