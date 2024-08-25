/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            { hostname: "lh3.googleusercontent.com", protocol: "https" }
            , { hostname: "avatars.githubusercontent.com", protocol: "https" }
            , { hostname: "images.unsplash.com", protocol: 'https' }
        ]
    }
};

module.exports = nextConfig;
