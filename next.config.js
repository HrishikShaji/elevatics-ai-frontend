/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            { hostname: "lh3.googleusercontent.com", protocol: "https" }
            , { hostname: "avatars.githubusercontent.com", protocol: "https" }
        ]
    }
};

module.exports = nextConfig;
