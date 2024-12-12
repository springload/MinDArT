import { Serwist } from "serwist";

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
});

// Register routes after initialization
sw.registerRoute(
  new RegExp("\\.(png|jpg|jpeg|svg|gif|mp3|js|css|woff2)$"),
  new sw.strategies.CacheFirst({
    cacheName: "mindart-assets",
    plugins: [
      new sw.expiration.ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        maxEntries: 500,
        purgeOnQuotaError: true,
      }),
      new sw.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

sw.registerRoute(
  ({ request }) => request.mode === "navigate",
  new sw.strategies.NetworkFirst({
    cacheName: "mindart-pages",
    plugins: [
      new sw.expiration.ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

sw.addEventListeners();
