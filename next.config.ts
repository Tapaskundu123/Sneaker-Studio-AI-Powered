/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 This ensures Next knows your real project root (important if you’re in a subfolder)
  turbopack: {
    root: "./", // or "../" if your next.config.ts is nested inside my-app
  },

  async rewrites() {
    return [
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
