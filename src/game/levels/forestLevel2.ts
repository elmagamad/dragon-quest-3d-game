

import type { LevelDef, Vec2 } from '@/game/types';

function coinLine(x0: number, x1: number, step: number, y: number): Vec2[] {
  const coins: Vec2[] = [];

  for (let x = x0; x <= x1 + 1e-6; x += step) {
    coins.push({ x: Number(x.toFixed(2)), y });
  }

  return coins;
}

export const forestLevel2: LevelDef = {
  name: 'Level 2',
  world: 'World 2: Dark Enchanted Forest',

  platforms: [
    { x: 0, y: 0, w: 14 },
    { x: 15, y: 2, w: 5 },
    { x: 23, y: 4, w: 4 },
    { x: 30, y: 0, w: 8 },
    { x: 40, y: 3, w: 5 },
    { x: 49, y: 0, w: 10 },
    { x: 61, y: 4, w: 4 },
    { x: 69, y: 1.5, w: 7 },
    { x: 79, y: 4, w: 5 },
    { x: 88, y: 0, w: 10 },
    { x: 100, y: 3, w: 5 },
    { x: 109, y: 0, w: 14 },
    { x: 122, y: 2, w: 5 },
    { x: 131, y: 0, w: 12 },
  ],

  walls: [
    {
      minX: -12,
      maxX: -9.6,
      minY: -5,
      maxY: 30,
      minZ: -3,
      maxZ: 3,
    },
  ],

  coins: [
    ...coinLine(-5, 5, 2.5, 1.3),
    ...coinLine(13, 17, 2, 3.3),
    ...coinLine(21.5, 24.5, 1.5, 5.3),
    ...coinLine(28, 34, 2, 1.3),
    ...coinLine(38.5, 42.5, 2, 4.3),
    ...coinLine(46, 54, 2, 1.3),
    ...coinLine(59.5, 62.5, 1.5, 5.3),
    ...coinLine(66, 72, 2, 2.8),
    ...coinLine(77, 81, 2, 5.3),
    ...coinLine(85, 91, 2, 1.3),
    ...coinLine(98.5, 101.5, 1.5, 4.3),
    ...coinLine(106, 114, 2, 1.3),
    ...coinLine(120.5, 123.5, 1.5, 3.3),
    ...coinLine(128, 136, 2, 1.3),
  ],

  enemies: [
    { platform: 0, x: 3, range: 4 },
    { platform: 1, x: 15, range: 2, kind: 'brute' },
    { platform: 3, x: 30, range: 3 },
    { platform: 4, x: 40, range: 2, kind: 'brute' },
    { platform: 5, x: 49, range: 4 },
    { platform: 7, x: 69, range: 3 },
    { platform: 8, x: 79, range: 2, kind: 'brute' },
    { platform: 9, x: 88, range: 4 },
    { platform: 11, x: 109, range: 4 },
    { platform: 13, x: 131, range: 4, kind: 'brute' },
  ],

  checkpoints: [
    { x: -6, y: 0 },
    { x: 14, y: 2 },
    { x: 32, y: 0 },
    { x: 49, y: 0 },
    { x: 70, y: 1.5 },
    { x: 89, y: 0 },
    { x: 110, y: 0 },
    { x: 132, y: 0 },
  ],

  spawn: { x: -6, y: 0 },

  portal: { x: 136, y: 0 },
};
