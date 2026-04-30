/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Deployment optimization
  output: 'standalone',

  // 2. Database bundling
  // Ensures Mongoose and MongoDB work correctly in the Vercel build environment
  serverExternalPackages: ['mongodb', 'mongoose'],

  // 3. Image optimization
  images: {
    unoptimized: true,
  },

  // 4. Addressing the Middleware-to-Proxy warning
  // Next.js 16 prefers defining routing and proxying here
  experimental: {
    proxy: true,
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


// Force sync 123s