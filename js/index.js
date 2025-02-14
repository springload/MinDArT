import "../css/styles.css";
import { registerSW } from "virtual:pwa-register";
import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";
import p5 from "p5";
window.p5 = p5; // make p5.js globally available to all apps

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log("SW ready! Scope:", registration.scope);
  });

  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Message from SW:", event.data);
  });

  // Monitor SW state changes
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Service Worker controller changed");
  });
}

registerSW({
  immediate: true,
  onRegisteredSW(swScriptUrl) {
    console.log("SW registered:", swScriptUrl);
  },
  onRegisterError(error) {
    console.error("SW registration error:", error);
  },
  onOfflineReady() {
    console.log("PWA application ready to work offline");
  },
  onNeedRefresh() {
    console.log("New content available, please refresh");
  },
});

// set up page routing
initializeRouter();
// set up home view
showOnlyCurrentLinks();
// initialize app code
import "./core/app.js";

// periodically check for PWA updates
import { initPWAUpdater } from "./utils/pwa-update.js";
import "./components/pwa-update-notifier.js";
initPWAUpdater();
