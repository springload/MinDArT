import { PrecacheRouteOptions, precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

// Creates an updated precache manifest at the time build process is executed.
precacheAndRoute(self.__WB_MANIFEST);
