/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["dtuio9ne3dc5i.cloudfront.net", "res.cloudinary.com"],
  },
  redirects: async () => {
    return [
      {
        source: "/privacy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
