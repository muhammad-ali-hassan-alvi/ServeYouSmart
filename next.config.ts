import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Keep any other config options you might have here */
  reactStrictMode: true, // Optional: Enable React strict mode

  images: {
    // Use remotePatterns (recommended)
    remotePatterns: [
      {
        protocol: 'https',                 // Protocol Cloudinary uses
        hostname: 'res.cloudinary.com',    // The hostname from the error message
        port: '',                          // Default port (usually empty)
        pathname: '/**',                  // Allow any path under this hostname
                                           // You could make this stricter, e.g.:
                                           // pathname: '/dmes7ltcv/image/upload/**',
                                           // replacing 'dmes7ltcv' with your cloud name
      },
      // Add any other external image domains you need here
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
    ],

    // --- OR ---

    // Use domains (older method, still works but remotePatterns is preferred)
    // domains: ['res.cloudinary.com'], // Add other allowed domains here
  },
};

export default nextConfig;