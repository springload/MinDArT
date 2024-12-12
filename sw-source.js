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
    plugins: [
      {
        // Debug plugin for precaching
        precacheWillUpdate: async ({ request, response }) => {
          console.log("Precaching:", request.url);
          console.log("Headers:", [...response.headers.entries()]);
          return response;
        },
      },
    ],
  },
});

// Runtime caching for any files not in precache
sw.registerRoute(
  new Route(
    ({ url }) =>
      url.pathname.match(/\.(js|html|css|png|jpg|jpeg|svg|gif|mp3|woff2)$/),
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
          // Debug plugin for runtime caching
          cacheWillUpdate: async ({ request, response }) => {
            console.log("Runtime caching:", request.url);
            console.log("Headers:", [...response.headers.entries()]);
            return response;
          },
        },
      ],
    })
  )
);

sw.addEventListeners();

// Additional debugging
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});
