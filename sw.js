import { Serwist } from "serwist";

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,

  skipWaiting: true,
  clientsClaim: true,

  precacheOptions: {
    cleanupOutdatedCaches: true,
  },

  runtimeCaching: [
    {
      urlPattern: ({ request }) =>
        request.destination === "image" ||
        request.destination === "script" ||
        request.destination === "style" ||
        request.destination === "font" ||
        request.destination === "audio",
      handler: "CacheFirst",
      options: {
        cacheName: "mindart-assets",
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxEntries: 500,
          purgeOnQuotaError: true,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

sw.addEventListeners();
