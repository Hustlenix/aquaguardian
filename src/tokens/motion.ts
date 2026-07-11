export const motion = {
  duration: {
    micro: 300,
    ui: 600,
    reveal: 1200,
    scene: 2000,
    environment: 4000,
    particle: Infinity,
  },
  easing: {
    water: [0.25, 0.1, 0.25, 1],
    emerge: [0.34, 1.56, 0.64, 1],
    fade: [0.4, 0, 0.2, 1],
  },
  scroll: {
    duration: 1.2,
    easing: 0.1,
  },
} as const
