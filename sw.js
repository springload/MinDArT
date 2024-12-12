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
      // Match any request that ends with these file extensions
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|mp3|js|css|woff2)$/,
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
    // Add a route for HTML navigation requests
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "mindart-pages",
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
});

sw.addEventListeners();
