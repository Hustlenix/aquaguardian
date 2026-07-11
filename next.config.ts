import type { NextConfig } from 'next'

const isStatic = process.env.STATIC_EXPORT === 'true'

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  output: isStatic ? 'export' : undefined,
  basePath: isStatic ? '/aquaguardian' : undefined,
  assetPrefix: isStatic ? '/aquaguardian/' : undefined,
  trailingSlash: isStatic ? true : undefined,
  images: {
    unoptimized: isStatic ? true : undefined,
    formats: isStatic ? undefined : ['image/avif', 'image/webp'],
  },
}

export default nextConfig
