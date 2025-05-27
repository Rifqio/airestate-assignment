import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    },
    images: {
        domains: [
            'xnakqhpczzpuusnsuejw.supabase.co',
            'cdn.prod.website-files.com'  // Added for the image URL you provided
        ],
    },
};

export default nextConfig;
