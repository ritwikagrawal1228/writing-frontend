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
    ENV_TEST: process.env.ENV_TEST,
  },
}

module.exports = nextConfig
