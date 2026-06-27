// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.payrollpro.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;