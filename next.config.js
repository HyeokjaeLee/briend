/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
// eslint-disable-next-line import/extensions
const runtimeCaching = require('next-pwa/cache.js');

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = withPWA({
  dest: 'public',
  disable: !isProduction,
  runtimeCaching,
})({
  images: {
    domains: ['chart.apis.google.com'],
  },
});

module.exports = nextConfig;
