/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/public/pages/admin/:path*'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages/login/views/login-page.html',
        permanent: false,
      },
    ]
  }
};

export default nextConfig; 