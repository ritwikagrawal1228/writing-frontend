/** @type {import('next').NextConfig} */
// You can choose which headers to add to the list
// after learning more below.
const securityHeaders = []

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
