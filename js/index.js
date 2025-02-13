import "../css/styles.css";
import p5 from "p5";
window.p5 = p5;

import { registerSW } from "virtual:pwa-register";
import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";

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

initializeRouter();
showOnlyCurrentLinks();

import "./core/app.js";
