/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Optional: keep Cloudinary proxy if you actually use it
      {
        source: "/cloudinary/:path*",
        destination: "https://res.cloudinary.com/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
