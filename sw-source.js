import { Serwist } from "serwist";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { Route } from "@serwist/routing";

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    fetchOptions: {
      credentials: "same-origin",
    },
    matchOptions: {
      ignoreSearch: true,
    },
  },
});

// Use CacheFirst for all files
sw.registerRoute(
  new Route(
    ({ url }) =>
      url.pathname.match(/\.(js|html|css|png|jpg|jpeg|svg|gif|mp3|woff2)$/),
    new CacheFirst({
      cacheName: "mindart-all",
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
  )
);

sw.addEventListeners();
