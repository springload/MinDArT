import { DEBUG_ENABLED } from "./debug-config.js";

// Only import the debug panel component if debugging is enabled
if (DEBUG_ENABLED) {
  import("../components/debugPanel.js").catch(console.error);
}

const appendDebugPanel = () => {
  if (!DEBUG_ENABLED) return;

  if (!document.querySelector("debug-panel")) {
    const debugPanel = document.createElement("debug-panel");
    document.body.appendChild(debugPanel);
  }
};

const monitorPWA = () => {
  if (!DEBUG_ENABLED) return;

  // Log initial state
  window.debugLog(`Monitoring started: ${new Date().toISOString()}`);
  window.debugLog(`Page URL: ${window.location.href}`);
  window.debugLog(`Browser online: ${navigator.onLine}`);

  // Save original console methods to log to both console and debug panel
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  // Override console methods to also log to debug panel
  console.log = (...args) => {
    originalConsoleLog.apply(console, args);
    if (
      DEBUG_ENABLED &&
      args[0] &&
      typeof args[0] === "string" &&
      (args[0].includes("SW") ||
        args[0].includes("service") ||
        args[0].includes("PWA") ||
        args[0].includes("update") ||
        args[0].includes("refresh"))
    ) {
      window.debugLog(args.join(" "));
    }
  };

  console.warn = (...args) => {
    originalConsoleWarn.apply(console, args);
    if (
      DEBUG_ENABLED &&
      args[0] &&
      typeof args[0] === "string" &&
      (args[0].includes("SW") ||
        args[0].includes("service") ||
        args[0].includes("PWA"))
    ) {
      window.debugLog(`WARNING: ${args.join(" ")}`);
    }
  };

  console.error = (...args) => {
    originalConsoleError.apply(console, args);
    if (
      DEBUG_ENABLED &&
      args[0] &&
      typeof args[0] === "string" &&
      (args[0].includes("SW") ||
        args[0].includes("service") ||
        args[0].includes("PWA"))
    ) {
      window.debugLog(`ERROR: ${args.join(" ")}`);
    }
  };

  // Monitor online/offline status
  window.addEventListener("online", () => {
    window.debugLog("Browser went online");
  });

  window.addEventListener("offline", () => {
    window.debugLog("Browser went offline");
  });

  // Monitor navigation events
  window.addEventListener("popstate", (event) => {
    const isHomeScreen = !new URLSearchParams(window.location.search).get(
      "app"
    );
    window.debugLog(
      `Navigation: ${isHomeScreen ? "Home screen" : "App screen"}`
    );

    // When returning to home screen, we should check for updates
    if (isHomeScreen) {
      window.debugLog("Returned to home screen - update check should happen");
    }
  });

  // Enhanced global debug helper
  window.pwaDebug = {
    checkStatus: async () => {
      if (!("serviceWorker" in navigator)) {
        window.debugLog("Service Worker not supported");
        return;
      }

      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          window.debugLog(`SW registered: ${reg.scope}`);
          window.debugLog(`SW installing: ${!!reg.installing}`);
          window.debugLog(`SW waiting: ${!!reg.waiting}`);
          window.debugLog(`SW active: ${!!reg.active}`);
          window.debugLog(
            `Page controlled: ${!!navigator.serviceWorker.controller}`
          );

          // Check for the updater function
          try {
            const pwa = await import("./pwa.js");
            window.debugLog(`Update functions: ${Object.keys(pwa).join(", ")}`);

            // Check internal state
            if (typeof pwa.updatePending !== "undefined") {
              window.debugLog(`updatePending: ${pwa.updatePending}`);
            }

            if (typeof pwa.refreshing !== "undefined") {
              window.debugLog(`refreshing: ${pwa.refreshing}`);
            }

            if (typeof pwa.checkSWUpdate !== "undefined") {
              window.debugLog(
                `checkSWUpdate available: ${!!pwa.checkSWUpdate}`
              );
            }
          } catch (e) {
            window.debugLog(`Error importing pwa.js: ${e.message}`);
          }
        } else {
          window.debugLog("No service worker registration found");
        }
      } catch (error) {
        window.debugLog(`Error checking status: ${error.message}`);
      }
    },

    // Force activation of a waiting worker (for testing)
    activateWaiting: async () => {
      if (!("serviceWorker" in navigator)) return;

      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.waiting) {
          window.debugLog("Sending skipWaiting message to waiting worker");
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        } else {
          window.debugLog("No waiting worker to activate");
        }
      } catch (error) {
        window.debugLog(`Error activating worker: ${error.message}`);
      }
    },

    // Force check for updates
    forceCheck: async () => {
      window.debugLog("Manually checking for updates");
      try {
        const pwa = await import("./pwa.js");
        if (typeof pwa.checkForUpdates === "function") {
          const result = await pwa.checkForUpdates();
          window.debugLog(`Manual check result: ${result}`);
        } else {
          window.debugLog("checkForUpdates function not found");
        }
      } catch (error) {
        window.debugLog(`Error during manual check: ${error.message}`);
      }
    },
  };

  // Run an initial status check
  window.pwaDebug.checkStatus();

  // Set up periodic checks
  setInterval(() => {
    window.pwaDebug.checkStatus();
  }, 15000);
};

// Initialize when the document is ready
if (document.readyState === "complete") {
  appendDebugPanel();
  monitorPWA();
} else {
  window.addEventListener("load", () => {
    appendDebugPanel();
    monitorPWA();
  });
}
