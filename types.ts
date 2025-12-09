export interface Vector {
  x: number;
  y: number;
}

export interface GameObject {
  pos: Vector;
  radius: number;
}

export interface Player extends GameObject {
  health: number;
  maxHealth: number;
}

export interface Boss extends GameObject {
  health: number;
  maxHealth: number;
  phase: number;
  patternCooldown: number;
}

export interface Projectile extends GameObject {
  velocity: Vector;
  damage: number;
  rotation?: number;
}

export interface Collectible extends GameObject {
  value: number;
  velocity: Vector;
}

export interface GameState {
  player: Player;
  boss: Boss;
  playerProjectiles: Projectile[];
  bossProjectiles: Projectile[];
  collectibles: Collectible[];
  score: number;
  level: number;
  mousePos: Vector;
  isShooting: boolean;
  gameTime: number;
  screenShake: number;
  checksum: string;
}

export enum GameStatus {
    StartScreen,
    Playing,
    Paused,
    GameOver,
}

export interface LevelConfig {
    bossHealth: number;
    bossRadius: number;
    collectibleCount: number;
    patterns: BossPattern[];
}

export type BossPatternType = 'burst' | 'spiral' | 'targeted' | 'wave' | 'laserSweep' | 'minions';

export interface BossPattern {
    type: BossPatternType;
    cooldown: number; // time until this pattern can be used again
    duration: number; // how long the pattern lasts
    projectileSpeed: number;
    projectileCount?: number;
    fireRate?: number; // projectiles per second
    angle?: number; // for spiral
}
