import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {},
    },
  },
  // Allow development access from local network IPs
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.29.221', // Current local IP
    '192.168.*.*',     // Local network range
    '10.*.*.*',        // Private network range
    '172.16.*.*',      // Private network range
  ],
};

export default nextConfig;
