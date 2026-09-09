import {projectId, dataset} from './sanity/env';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
