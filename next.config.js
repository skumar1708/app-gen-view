/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
            source: '/socket.io/:path*',  // Match Socket.IO requests
            destination: 'http://localhost:5000/socket.io/:path*', // Your server URL
            },
        ];
        }
    };
    
    export default nextConfig;