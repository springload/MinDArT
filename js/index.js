import "../css/styles.css";
import { registerSW } from "virtual:pwa-register";
import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";
import { initPWAUpdater } from "./utils/pwa.js";
import p5 from "p5";
window.p5 = p5;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log("SW ready! Scope:", registration.scope);
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
// Enable checking for PWA updates whenever we navigate back to the home view
initPWAUpdater();
