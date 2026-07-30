import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qjboxoxtmdnoenexwtpq.supabase.co',
      },
    ],
  },
};

export default nextConfig;