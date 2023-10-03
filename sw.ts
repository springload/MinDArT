import { PrecacheRouteOptions, precacheAndRoute } from "workbox-precaching";
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';

registerRoute(({request}) => request.destination === 'style', new CacheFirst());

declare const self: ServiceWorkerGlobalScope;

// Creates an updated precache manifest at the time build process is executed.
precacheAndRoute(self.__WB_MANIFEST);
