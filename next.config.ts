import {projectId, dataset} from './sanity/env';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
        ],
      },
      {
        // Exclude Studio itself and all nested Studio routes.
        source: '/:path((?!studio(?:/|$)).*)',
        headers: [
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
        ],
      },
      ...(process.env.VERCEL_ENV === 'preview'
        ? [{
            source: '/:path*',
            headers: [
              {key: 'X-Robots-Tag', value: 'noindex'},
            ],
          }]
        : []),
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: `/images/${projectId}/${dataset}/*`,
        // Sanity generates variable sizing and crop query parameters.
      },
    ],
  },
};

export default nextConfig;
