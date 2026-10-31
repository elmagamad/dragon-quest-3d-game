import type { LevelDef, Vec2 } from '@/game/types';

function coinLine(x0: number, x1: number, step: number, y: number): Vec2[] {
  const coins: Vec2[] = [];
  for (let x = x0; x <= x1 + 1e-6; x += step) {
    coins.push({ x: Number(x.toFixed(2)), y });
  }
  return coins;
}

export const forestLevel1: LevelDef = {
  name: 'Level 1',
  world: 'World 1: Enchanted Forest',
  platforms: [
    { x: 0, y: 0, w: 18 },
    { x: 17, y: 0, w: 10 },
    { x: 26, y: 2.5, w: 4 },
    { x: 32, y: 4.5, w: 3.5 },
    { x: 41, y: 0, w: 14 },
    { x: 53, y: 2, w: 4 },
    { x: 64, y: 0, w: 12 },
    { x: 74, y: 2.5, w: 4 },
    { x: 85, y: 0, w: 16 },
    { x: 97, y: 1.5, w: 3 },
    { x: 112, y: 0, w: 22 },
  ],
  walls: [{ minX: -12, maxX: -9.6, minY: -5, maxY: 30, minZ: -3, maxZ: 3 }],
  coins: [
    ...coinLine(-6, 6, 3, 1.3),
    ...coinLine(13, 21, 2, 1.3),
    { x: 10.5, y: 3.5 },
    ...coinLine(24.5, 27.5, 1.5, 4.0),
    ...coinLine(30.5, 33.5, 1.5, 6.0),
    ...coinLine(35, 47, 2, 1.3),
    ...coinLine(51.5, 54.5, 1.5, 3.3),
    ...coinLine(58.5, 69.5, 2.5, 1.3),
    ...coinLine(72.5, 75.5, 1.5, 4.0),
    ...coinLine(78, 92, 3, 1.3),
    ...coinLine(95.5, 98.5, 1.5, 2.8),
    ...coinLine(102, 122, 4, 1.3),
  ],
  enemies: [
    { platform: 0, x: 4, range: 4 },
    { platform: 1, x: 17, range: 4 },
    { platform: 2, x: 26, range: 1.5 },
    { platform: 4, x: 41, range: 5 },
    { platform: 5, x: 53, range: 1.5 },
    { platform: 6, x: 64, range: 5 },
    { platform: 8, x: 85, range: 6 },
    { platform: 9, x: 97, range: 1 },
    { platform: 10, x: 112, range: 6 },
    { platform: 10, x: 104, range: 2.5, kind: 'brute' },
  ],
  checkpoints: [
    { x: -6, y: 0 },
    { x: 14, y: 0 },
    { x: 36, y: 0 },
    { x: 53, y: 2 },
    { x: 66, y: 0 },
    { x: 74, y: 2.5 },
    { x: 88, y: 0 },
    { x: 97, y: 1.5 },
    { x: 113, y: 0 },
  ],
  spawn: { x: -6, y: 0 },
  portal: { x: 117, y: 0 },
};
