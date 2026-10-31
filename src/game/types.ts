
export interface Vec2 {
  x: number;
  y: number;
}

export interface Platform {
  x: number;
  y: number;
  w: number;
}

export interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export type EnemyKind = 'thornling' | 'brute';

export interface EnemySpawn {
  platform: number;
  x: number;
  range: number;
  kind?: EnemyKind;
}

export interface BossDef {
  name: string;
  health: number;
  damage: number;
  reward: number;
  position: number;
}

export interface LevelDef {
  name: string;
  world: string;
  maxJumps?: number;
  platforms: Platform[];
  walls: Box[];
  coins: Vec2[];
  enemies: EnemySpawn[];
  checkpoints: Vec2[];
  spawn: Vec2;
  portal: Vec2;
  boss?: BossDef;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  jumpsRemaining: number;
  groundY: number;
  coyote: number;
  jumpBuffer: number;
  stun: number;
  invuln: number;
  health: number;
  facing: 1 | -1;
  anim: number;
  checkpoint: number;
  swingTime: number;
  swingId: number;
  attackCooldown: number;
}

export interface EnemyState {
  kind: EnemyKind;
  x: number;
  y: number;
  minX: number;
  maxX: number;
  leashMin: number;
  leashMax: number;
  dir: 1 | -1;
  alive: boolean;
  deadTime: number;
  phase: number;
  health: number;
  hitFlash: number;
  lastHitSwing: number;
  windup: number;
  cooldown: number;
}

export interface CoinState {
  x: number;
  y: number;
  collected: boolean;
}

export type Outcome = 'running' | 'won' | 'lost';

export interface Sim {
  level: LevelDef;
  boxes: Box[];
  player: PlayerState;
  enemies: EnemyState[];
  coins: CoinState[];
  outcome: Outcome;
  elapsed: number;
}

export type SimEvent =
  | { type: 'coin'; amount: number }
  | { type: 'hurt'; health: number }
  | { type: 'won' }
  | { type: 'defeated' };
