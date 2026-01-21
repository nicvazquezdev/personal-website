export const GLITCH_DURATION = 400;

export const EASTER_EGG_MESSAGES: (string | null)[] = [
  null,
  null,
  null,
  "hey...",
  null,
  "stop that",
  null,
  null,
  "seriously?",
  null,
  null,
];

export const MUZZLE_FLASH_COLORS = [
  "#ff4500",
  "#ff6b35",
  "#ff8c42",
  "#ffd166",
  "#fff3b0",
  "#ffffff",
];

export const IMAGE_SIZES = {
  normal: 180,
  attack: 280,
} as const;

export const PARTICLE_CONFIG = {
  count: 10,
  velocityX: { min: 10, max: 26 },
  velocityY: { min: 6, max: 18 },
  size: { min: 5, max: 15 },
  opacityDecay: 0.08,
  sizeDecay: 0.3,
  maxFrames: 15,
  maxFlashes: 8,
} as const;
