
import type { LevelDef } from '../types';

export const dragonLevel3: LevelDef = {
  name: 'Level 3',
  world: 'World 3: Dragon’s Kingdom',

  platforms: [
    { x: -10, y: -2, width: 20 },
    { x: 12, y: 0, width: 8 },
    { x: 24, y: 2, width: 8 },
    { x: 36, y: 0, width: 10 },
    { x: 50, y: 3, width: 8 },
    { x: 62, y: 0, width: 10 },
    { x: 76, y: 2, width: 8 },
    { x: 88, y: 0, width: 12 },
    { x: 104, y: 3, width: 8 },
    { x: 116, y: 0, width: 20 },
  ],

  spawn: { x: -6, y: 0 },

  portal: { x: 132, y: 0 },

  boss: {
    name: 'Ancient Fire Dragon',
    health: 300,
    damage: 20,
    reward: 2000,
    position: 116,
  },
};

