/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['127.0.0.1', 'job-backend.prisunion.uz'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://job-backend.prisunion.uz',
  },
};

module.exports = nextConfig;
