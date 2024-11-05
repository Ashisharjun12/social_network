/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'api.dicebear.com'],
    unoptimized: true
  }
}

module.exports = nextConfig 