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
      // Use new RegExp instead of RegExp literal
      urlPattern: new RegExp("\\.(png|jpg|jpeg|svg|gif|mp3|js|css|woff2)$"),
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
    {
      // Use proper RouteMatchCallback type
      urlPattern: ({ url, request }) =>
        request.mode === "navigate" && !url.pathname.startsWith("/_"),
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
