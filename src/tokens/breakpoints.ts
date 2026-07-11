export const breakpoints = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
} as const

export const mediaQueries = {
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  mobile: `@media (max-width: ${breakpoints.tablet - 1}px)`,
} as const
