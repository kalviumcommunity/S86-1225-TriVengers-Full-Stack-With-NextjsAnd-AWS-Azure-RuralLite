/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    // Ensure Turbopack treats the `rurallite` folder as root
    root: __dirname,
  },
  // Enable standalone mode for Docker deployment
  output: "standalone",
  // Optimize for production
  swcMinify: true,
  // Image optimization for production
  images: {
    unoptimized: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
