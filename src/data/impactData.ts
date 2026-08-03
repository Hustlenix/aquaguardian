export interface ImpactFact {
  title: string
  value: string
  detail: string
  source: string
}

export const impactFacts: ImpactFact[] = [
  {
    title: 'Annual ocean plastic entry',
    value: 'About 11 million metric tons',
    detail: 'UNEP and Pew estimate that roughly 11 million metric tons of plastic enter the ocean every year.',
    source: 'UNEP / Pew Charitable Trusts',
  },
  {
    title: 'Protected ocean area',
    value: 'About 8.4%',
    detail: 'Recent global assessments place marine protected areas at roughly 8.4% of the ocean.',
    source: 'UNEP-WCMC / Protected Planet',
  },
  {
    title: 'Coral reef risk',
    value: '70–90%',
    detail: 'A large share of the world’s coral reefs are considered at risk from warming, acidification, and local stressors.',
    source: 'UNEP / ICRI',
  },
  {
    title: 'Coastal population exposure',
    value: 'About 40%',
    detail: 'Around 40% of the global population lives within 100 km of the coast, which makes coastal stewardship especially important.',
    source: 'UNEP',
  },
  {
    title: 'Excess heat absorbed by the ocean',
    value: 'More than 90%',
    detail: 'The ocean has absorbed more than 90% of the excess heat trapped in the Earth system by greenhouse gases, which drives sea-level rise, marine heatwaves, and coral bleaching.',
    source: 'NOAA Climate.gov / NASA',
  },
  {
    title: 'Oxygen produced by the ocean',
    value: 'About 50%',
    detail: 'Scientists estimate that roughly half of Earth\u2019s oxygen production comes from the ocean, mostly from photosynthesizing plankton.',
    source: 'NOAA Ocean Service',
  },
  {
    title: 'Ghost fishing gear in the GPGP',
    value: 'About 46% of mass',
    detail: 'Abandoned fishing nets, lines, and ropes make up about 46% of the Great Pacific Garbage Patch\u2019s mass — gear that keeps trapping marine life for years.',
    source: 'Lebreton et al., Scientific Reports 2018',
  },
]

export const missionBlueprints = [
  {
    name: 'Coastal cleanup mapping',
    focus: 'Prioritize river outflows and coastal hotspots.',
    status: 'In planning',
    evidence: 'Targeted by municipal and NGO monitoring projects worldwide.',
  },
  {
    name: 'Coral reef health monitoring',
    focus: 'Track temperature, turbidity, and coral condition.',
    status: 'Pilot-ready',
    evidence: 'Aligned with reef monitoring practices used by research partners.',
  },
  {
    name: 'Community action loops',
    focus: 'Turn local cleanup actions into measurable impact stories.',
    status: 'Active',
    evidence: 'Supports school, NGO, and volunteer-led conservation efforts.',
  },
]
