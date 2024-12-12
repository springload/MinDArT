import { Serwist } from "serwist";
import { CacheFirst, NetworkFirst } from "serwist/strategies";
import { ExpirationPlugin } from "serwist/expiration";
import { CacheableResponsePlugin } from "serwist/cacheable-response";

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
  new CacheFirst({
    cacheName: "mindart-assets",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        maxEntries: 500,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

sw.registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "mindart-pages",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

sw.addEventListeners();
