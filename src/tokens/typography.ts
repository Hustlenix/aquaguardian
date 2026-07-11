export const typography = {
  fontFamily: {
    display: "'Cinzel', serif",
    elegant: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
    numeric: "'Space Grotesk', sans-serif",
  },
  fontSize: {
    hero: 'clamp(4rem, 10vw, 8rem)',
    chapterTitle: 'clamp(3rem, 6vw, 5rem)',
    sectionTitle: 'clamp(2rem, 4vw, 3.5rem)',
    subtitle: 'clamp(1.5rem, 2.5vw, 2.25rem)',
    body: 'clamp(1rem, 1.25vw, 1.375rem)',
    caption: 'clamp(0.875rem, 1vw, 1rem)',
    label: '0.75rem',
  },
  lineHeight: { hero: '1.1', body: '1.6', tight: '1.2' },
  letterSpacing: { wide: '0.08em', wider: '0.12em', normal: '0' },
} as const
