import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.filestackcontent.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // for the cypress tests
      },
    ],
  },
};

export default nextConfig;
