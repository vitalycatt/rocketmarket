const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.culture.ru', 'cdnjs.cloudflare.com'],
    unoptimized: true,
  },
  // Configure proper static handling
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  output: 'standalone',
  
  // Experimental configurations
  experimental: {
    outputFileTracingExcludes: {
      '**/node_modules/**': ['*'],
      '**/.next/**': ['*'],
      '**/dist/**': ['*'],
    },
    outputFileTracingIncludes: {
      '/api/**/*': ['**/*'],
    },
  },

  // Ensure proper route handling
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  // Handle redirects
  async redirects() {
    return [];
  },

  // Handle rewrites
  async rewrites() {
    return [
      {
        source: '/api/docs',
        destination: '/api-docs',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
