export const colors = {
  ocean: { black: '#010B13', abyss: '#041220', navy: '#071A2F' },
  royal: { ocean: '#005C99', crystal: '#38BDF8', seafoam: '#4FD1C5' },
  bioluminescent: { cyan: '#00E5FF' },
  gold: { atlantean: '#D4AF37', light: '#FFD700' },
  neutral: { white: '#F8FAFC', stone: '#CBD5E1' },
} as const

export type ColorToken = keyof typeof colors
