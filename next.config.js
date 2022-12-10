/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  env: {
    API_URL: process.env.API_URL,
  },
}

module.exports = nextConfig
