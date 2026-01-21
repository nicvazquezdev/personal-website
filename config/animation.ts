// Animation timing and configuration constants

export const ANIMATION = {
  // Typing animation settings
  typing: {
    speed: 50, // ms per character
    lineDelay: 200, // ms delay between lines
    startDelay: 500, // ms delay before starting
  },

  // Clock and time-based updates
  clock: {
    updateInterval: 1000, // ms - update every second
  },

  // LastUpdated component
  lastUpdated: {
    updateInterval: 60000, // ms - update every minute
  },

  // FloatingPerson easter egg
  floatingAvatar: {
    clickAnimationDuration: 300, // ms
    easterEggMessageDuration: 2000, // ms
    purpleGlowFadeInterval: 100, // ms
    purpleGlowFadeAmount: 0.02,
    parallaxEasing: 0.3, // seconds for transform transition
    parallaxFactor: 16, // multiplier for mouse movement
    // Attack mode settings
    attackModeDuration: 5000, // ms - duration of attack mode
    attackModeParallaxFactor: 80, // more aggressive cursor following
    attackModeParallaxEasing: 0.08, // faster response to cursor
    laserInterval: 150, // ms between laser shots
    attackModeMessageDuration: 2000, // ms - duration of attack message
  },

  // Hover effects
  hover: {
    highlightDuration: 300, // ms for transition
  },

  // Terminal navigation
  terminal: {
    navigationDelay: 300, // ms delay before route navigation
  },
} as const;

export type AnimationConfig = typeof ANIMATION;
