import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/v1/create-qr-code',
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

  // 기존 webpack 설정은 webpack 사용 시에만 적용됨
  webpack: (config) => {
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

export default nextConfig;
