import { Serwist } from "serwist";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { Route } from "@serwist/routing";

// Debug helper
function logResponseDetails(phase, request, response) {
  console.group(`${phase} - ${request.url}`);
  console.log("Content-Type:", response.headers.get("Content-Type"));
  console.log("Content-Length:", response.headers.get("Content-Length"));
  console.log("Content-Encoding:", response.headers.get("Content-Encoding"));
  console.log("Cache-Control:", response.headers.get("Cache-Control"));
  console.log("All Headers:", [...response.headers.entries()]);
  console.groupEnd();
}

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    plugins: [
      {
        precacheWillUpdate: async ({ request, response }) => {
          console.log("Precaching started for:", request.url);
          logResponseDetails("Before Precache", request, response);

          // Clone and log the response before returning
          const clone = response.clone();
          const body = await clone.blob();
          console.log("Body size:", body.size);

          const newResponse = new Response(body, {
            headers: new Headers({
              "Content-Type": response.headers.get("Content-Type"),
              "Content-Length": body.size.toString(),
              ...Object.fromEntries(response.headers.entries()),
            }),
            status: response.status,
            statusText: response.statusText,
          });

          logResponseDetails("After Precache Transform", request, newResponse);
          return newResponse;
        },
      },
    ],
  },
});

// Runtime caching as fallback
sw.registerRoute(
  new Route(
    ({ url }) => true,
    new CacheFirst({
      cacheName: "mindart-runtime",
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxEntries: 500,
          purgeOnQuotaError: true,
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        {
          cacheWillUpdate: async ({ request, response }) => {
            console.log("Runtime caching started for:", request.url);
            logResponseDetails("Runtime Cache", request, response);
            return response;
          },
        },
      ],
    })
  )
);

// Additional event debugging
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("Current caches:", cacheNames);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("Active caches after activation:", cacheNames);

      // Log the contents of each cache
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.open(cacheName).then((cache) => {
            return cache.keys().then((requests) => {
              console.group(`Cache contents for ${cacheName}:`);
              requests.forEach((request) => {
                console.log(request.url);
              });
              console.groupEnd();
            });
          });
        })
      );
    })
  );
});

sw.addEventListeners();
