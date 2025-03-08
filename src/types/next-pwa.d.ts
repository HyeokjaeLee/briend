// src/types/next-pwa.d.ts
declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAOptions {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    scope?: string;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        networkTimeoutSeconds?: number;
        cachableResponse?: {
          statuses: number[];
        };
      };
    }>;
  }

  export default function withPWA(
    options?: PWAOptions,
  ): (nextConfig: NextConfig) => NextConfig;
}
