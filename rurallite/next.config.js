/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    // Ensure Turbopack treats the `rurallite` folder as root
    root: __dirname,
  },
};

module.exports = nextConfig;
