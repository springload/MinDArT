import "../css/styles.css";
import p5 from "p5";
window.p5 = p5; // Make it globally available

// Import app code
import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";
import { registerSW } from "virtual:pwa-register";

// Initialize the app
initializeRouter();
showOnlyCurrentLinks();

// Register service worker with auto-update behavior
if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

// Import app module
import "./core/app.js";
