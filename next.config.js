/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Ensures the app can be deployed or containerized easily
  output: 'standalone',

  // 2. Fixes the Mongoose/MongoDB bundling errors
  // In Next.js 15+, this moved from 'experimental' to the top level
  serverExternalPackages: ['mongodb', 'mongoose'],

  // 3. Image optimization settings
  images: {
    unoptimized: true,
  },

  // 4. Turbopack & Workspace Root Fix
  // This explicitly tells Next.js where your project starts 
  // to stop it from looking at your Downloads folder.
  experimental: {
    turbopack: {
      root: '.',
    },
  },

  // 5. API Headers & CORS
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;