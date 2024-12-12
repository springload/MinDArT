import { Serwist } from "serwist";
import { CacheFirst, NetworkFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { Route } from "@serwist/routing";

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
});

// Register asset route
// (exclude JS files)
sw.registerRoute(
  new Route(
    ({ url }) => {
      return url.pathname.match(/\.(png|jpg|jpeg|svg|gif|mp3|css|woff2)$/);
    },
    new CacheFirst({
      cacheName: "mindart-assets",
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
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

// Special handling for JavaScript files
sw.registerRoute(
  new Route(
    ({ url }) => url.pathname.endsWith(".js"),
    async ({ request }) => {
      try {
        // Try network first
        const networkResponse = await fetch(request);
        const cache = await caches.open("mindart-scripts");

        // Clone the response before consuming it
        const responseToCache = networkResponse.clone();

        // Cache the response
        await cache.put(request, responseToCache);

        // Return the original response
        return networkResponse;
      } catch (error) {
        // If network fails, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    }
  )
);
// Register navigation route
sw.registerRoute(
  new Route(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
      cacheName: "mindart-pages",
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  )
);

sw.addEventListeners();
