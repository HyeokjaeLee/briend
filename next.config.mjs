/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AUTH_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack' }],
    });

    return config;
  },
};

export default nextConfig;
