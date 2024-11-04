/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ignoreBuildErrors: true, DO NOT USE THIS IN PRODUCTION
  },
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
