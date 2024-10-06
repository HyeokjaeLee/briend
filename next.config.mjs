/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack' }],
    });

    return config;
  },
  transpilePackages: ['nanoid'],
};

export default nextConfig;
