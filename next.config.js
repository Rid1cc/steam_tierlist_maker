/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for development
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
        port: '',
        pathname: '/store_item_assets/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        port: '',
        pathname: '/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
        port: '',
        pathname: '/steam/apps/**',
      }
    ],
    // Don't try to optimize Steam images - they often 404
    unoptimized: false,
    dangerouslyAllowSVG: true
  },
}

module.exports = nextConfig