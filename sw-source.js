import { Serwist } from "serwist";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { Route } from "@serwist/routing";

self.__SW_MANIFEST;

// Utility function to handle response cloning and body reading
async function cloneAndCacheResponse(response, cache, request) {
  // Create a new response with decompressed body
  const blob = await response.blob();
  const newResponse = new Response(blob, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });

  // Cache the new response
  await cache.put(request, newResponse.clone());
  return newResponse;
}

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
});

// Handle JS, HTML, and CSS files with explicit decompression
sw.registerRoute(
  new Route(
    ({ url }) => url.pathname.match(/\.(js|html|css)$/),
    async ({ request }) => {
      try {
        // Try network first
        const networkResponse = await fetch(request);
        const cache = await caches.open("mindart-content");

        // Clone and cache the response with decompressed body
        return await cloneAndCacheResponse(networkResponse, cache, request);
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

// Register other asset route
sw.registerRoute(
  new Route(
    ({ url }) => {
      return url.pathname.match(/\.(png|jpg|jpeg|svg|gif|mp3|woff2)$/);
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

sw.addEventListeners();
