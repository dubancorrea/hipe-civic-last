/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Deployment optimization
  output: 'standalone',

  // 2. Database bundling (Next.js 14/15 standard)
  serverExternalPackages: ['mongodb', 'mongoose'],

  // 3. Image optimization
  images: {
    unoptimized: true,
  },

  // 4. API Headers & CORS
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