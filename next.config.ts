import type { NextConfig } from 'next'

const isStatic = process.env.STATIC_EXPORT === 'true'

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  basePath: isStatic ? '/aquaguardian' : undefined,
  assetPrefix: isStatic ? '/aquaguardian/' : undefined,
  trailingSlash: isStatic ? true : undefined,
}

export default nextConfig
