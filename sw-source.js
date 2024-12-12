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
sw.registerRoute(
  new Route(
    ({ url }) => url.pathname.endsWith(".js"),
    new NetworkFirst({
      cacheName: "mindart-scripts",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        {
          // Add a custom cacheWillUpdate plugin
          cacheWillUpdate: async ({ response }) => {
            // Clone the response before caching
            const clonedResponse = response.clone();

            // Ensure we have the full body
            const body = await clonedResponse.blob();

            // Create a new response with the full body
            return new Response(body, {
              headers: response.headers,
              status: response.status,
              statusText: response.statusText,
            });
          },
        },
      ],
    })
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
