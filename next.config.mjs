/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enforce type checking during build to avoid shipping type errors to production
    ignoreBuildErrors: false,
  },
}

export default nextConfig
