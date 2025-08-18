/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'komas500.s3.eu-north-1.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'backendapi-prod.onrender.com',
        pathname: '/api/v1/2401/file/get/**',
      },
      {
        protocol: 'https',
        hostname: 'backendapi-3ms0.onrender.com',
        pathname: '/api/v1/2401/file/get/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
  // new
  async redirects() {
    return [
      // Redirect from backend callback URL to our verify-payment page
      {
        source: '/api/payment/callback',
        destination: '/verify-payment',
        permanent: false,
      },
    ]
  },
  eslint: {
    //  Remove during final build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
