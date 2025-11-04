/** @type {import('next').NextConfig} */
const nextConfig = {
  // DEVELOPMENT: Disable aggressive caching to prevent stale builds
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      // Keep pages in memory for 60s instead of default 25s
      maxInactiveAge: 60 * 1000,
      // Build 1 page at a time to avoid cache issues
      pagesBufferLength: 1,
    },
  }),
  reactStrictMode: true,
  
  // ============================================
  // BASEPATH CONFIGURATION
  // ============================================
  // Use custom env variable for basePath control
  // This allows development mode with /ik routing
  // NEXT_PUBLIC_USE_BASEPATH=true -> uses /ik
  // NEXT_PUBLIC_USE_BASEPATH=false -> root path
  basePath: process.env.NEXT_PUBLIC_USE_BASEPATH === 'true' ? '/ik' : '',
  assetPrefix: process.env.NEXT_PUBLIC_USE_BASEPATH === 'true' ? '/ik' : '',
  
  // ============================================
  // BUILD CONFIGURATION
  // ============================================
  // Ignore linting/type errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ============================================
  // IMAGE OPTIMIZATION
  // ============================================
  images: {
    unoptimized: true,
  },
  
  // ============================================
  // ENVIRONMENT VARIABLES
  // ============================================
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8102',
  },
}

module.exports = nextConfig
