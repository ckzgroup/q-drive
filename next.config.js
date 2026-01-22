/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
     config.resolve.alias.canvas = false;
     return config;
     },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'qudrive.qtask.net',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'hst-api.wialon.eu',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig
