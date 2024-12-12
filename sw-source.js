import { Serwist } from "serwist";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { Route } from "@serwist/routing";

// Debug helpers at global scope
self.debugCache = async function () {
  const cache = await caches.open(
    "serwist-precache-v2-https://mindart-nine.vercel.app/"
  );
  const keys = await cache.keys();
  for (const request of keys) {
    const response = await cache.match(request);
    console.group("Cache entry:", request.url);
    console.log("Type:", response.headers.get("Content-Type"));
    console.log("Length:", response.headers.get("Content-Length"));
    console.log("Encoding:", response.headers.get("Content-Encoding"));
    const clone = response.clone();
    const body = await clone.blob();
    console.log("Actual blob size:", body.size);
    console.groupEnd();
  }
};

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
});

// Debug the precaching process
self.addEventListener("install", (event) => {
  console.log("[DEBUG] Service Worker installing");
  event.waitUntil(
    (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for precaching
        console.log("[DEBUG] Checking cache contents after install");
        await self.debugCache();
      } catch (err) {
        console.error("[DEBUG] Install error:", err);
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  console.log("[DEBUG] Service Worker activating");
  event.waitUntil(
    (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for activation
        console.log("[DEBUG] Checking cache contents after activate");
        await self.debugCache();
      } catch (err) {
        console.error("[DEBUG] Activate error:", err);
      }
    })()
  );
});

sw.addEventListeners();
