import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/id/berita', 
        permanent: true,
      },
      {
        source: '/berita',
        destination: '/id/berita', 
        permanent: true,
      },
    ];
  },
};

export default nextConfig;