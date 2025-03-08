import type { NextConfig } from 'next';
import nextPWA from 'next-pwa';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// PWA 설정
const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
        pathname: '/public*',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/v1/create-qr-code*',
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        // Turbopack에서 SVG 처리를 위한 설정
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  productionBrowserSourceMaps: IS_DEVELOPMENT,

  webpack: (config) => {
    if (IS_DEVELOPMENT) {
      config.devtool = 'source-map';
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
        },
      ],
    });

    return config;
  },
};

export default withPWA(nextConfig);
