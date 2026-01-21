export interface MuzzleFlashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export interface MuzzleFlash {
  id: number;
  side: "left" | "right";
  particles: MuzzleFlashParticle[];
}

export interface Position {
  x: number;
  y: number;
}

export interface GunPositions {
  left: Position;
  right: Position;
}

export interface AttackModeState {
  isAttackMode: boolean;
  isEnteringAttackMode: boolean;
  isExitingAttackMode: boolean;
  attackMessage: string | null;
}

export interface GlitchState {
  isGlitching: boolean;
  showCyberAvatar: boolean;
}
