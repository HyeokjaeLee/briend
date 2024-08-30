/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          options: { icon: true },
          as: '*.ts',
        },
      },
    },
  },
};

export default nextConfig;
