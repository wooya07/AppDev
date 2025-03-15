import withPWA from 'next-pwa';

// PWA 설정
const pwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // PWA Builder와 호환되는 서비스 워커 설정
  sw: {
    dest: 'public',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 이미지 최적화 비활성화 (PWA Builder와 호환성을 위해)
  images: {
    unoptimized: true,
  },
};

export default pwa(nextConfig);

