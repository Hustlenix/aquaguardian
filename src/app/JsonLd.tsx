export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AquaGuardian',
    url: 'https://hustlenix.github.io/aquaguardian',
    description:
      'An interactive 3D concept experience exploring autonomous ocean restoration — a fictional narrative paired with real, cited ocean science.',
    about: [
      'Ocean Conservation',
      'Autonomous Underwater Vehicles',
      'Artificial Intelligence',
      'Marine Biology',
    ],
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
