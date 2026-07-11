export const elevation = {
  flat: 'none',
  raised: '0 4px 12px rgba(0, 229, 255, 0.15)',
  card: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 229, 255, 0.05)',
  modal: '0 16px 48px rgba(0, 0, 0, 0.4)',
  glow: {
    gold: '0 0 20px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.1)',
    cyan: '0 0 20px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.1)',
  },
} as const

export const zIndex = {
  background: 0,
  environment: 10,
  robot: 20,
  particles: 30,
  effects: 40,
  ui: 50,
  navigation: 100,
  loading: 200,
  overlay: 300,
} as const
