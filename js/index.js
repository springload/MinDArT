import "../css/styles.css";
import p5 from "p5";
window.p5 = p5; // Make it globally available

// Import app code
import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";
import { registerServiceWorker } from "./register-sw.js";

// Initialize the app
initializeRouter();
showOnlyCurrentLinks();

// Only register service worker in production
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Import app module
import "./core/app.js";
