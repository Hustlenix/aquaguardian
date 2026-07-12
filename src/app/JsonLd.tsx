export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AquaGuardian',
    url: 'https://hustlenix.github.io/aquaguardian',
    description:
      'AI-powered autonomous underwater vehicle for ocean monitoring and restoration.',
    foundingDate: '2026',
    knowsAbout: [
      'Ocean Conservation',
      'Autonomous Underwater Vehicles',
      'Artificial Intelligence',
      'Marine Biology',
    ],
    slogan: 'A new intelligence protects the depths',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
