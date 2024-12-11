import { Serwist } from "@serwist/sw";

// self.__SW_MANIFEST is a special placeholder that will be replaced during build
// with an array of URLs and other metadata about files that should be precached.
// The injectManifest function in our build process handles this replacement.
const sw = new Serwist({
  // This array will be populated with the list of files to precache
  // It comes from the glob patterns we defined in our build config
  precacheEntries: self.__SW_MANIFEST,

  // skipWaiting: true means the new service worker will activate immediately
  // rather than waiting for all tabs using the old version to close
  skipWaiting: true,

  // clientsClaim: true means the service worker will take control of all pages
  // within scope immediately, rather than waiting for them to be reloaded
  clientsClaim: true,

  // Options specific to precaching behavior
  precacheOptions: {
    // This will remove any cached files that are no longer in the manifest
    // when a new service worker is activated
    cleanupOutdatedCaches: true,
  },

  // runtimeCaching defines how to handle requests that aren't in the precache
  runtimeCaching: [
    {
      // urlPattern is a function that returns true for URLs that should use this strategy
      // Here we're checking the request's destination property to determine the type of resource
      urlPattern: ({ request }) =>
        request.destination === "image" ||
        request.destination === "script" ||
        request.destination === "style" ||
        request.destination === "font" ||
        request.destination === "audio",
      // 'CacheFirst' means we'll try to get the resource from the cache first
      // Only if it's not in the cache will we fetch it from the network
      // This is good for assets that don't change often
      handler: "CacheFirst",
      options: {
        // Name of the cache where runtime-cached resources will be stored
        // This is separate from the precache storage
        cacheName: "mindart-assets",
        expiration: {
          // How long items should stay in the runtime cache
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxEntries: 500, // Limit number of entries to prevent unlimited cache growth
          purgeOnQuotaError: true, // Automatically cleanup if we hit storage limits
        },
        cacheableResponse: {
          statuses: [0, 200], // Only cache successful responses (and opaque responses)
        },
      },
    },
  ],
});

// Register event listeners for the service worker
// This sets up handlers for install, activate, and fetch events
// - install: precaches all the files in the manifest
// - activate: cleans up old caches
// - fetch: handles intercepting and responding to network requests
sw.addEventListeners();
