import { registerSW } from "virtual:pwa-register";

// Tracking this prevents an infinite refresh loop when a new service worker takes control.
let refreshing = false;
let checkSWUpdate = null;

/**
 * Registers the service worker manually.
 * This replaces the automatic registration that would normally happen.
 *
 * @returns {function|null} Returns the update function if registration was successful
 */
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;

  console.log("Attempting to register service worker");

  try {
    // The registerSW function returns a reload prompt function
    checkSWUpdate = registerSW({
      onNeedRefresh() {
        console.log("New content available, ready to refresh");
      },
      onOfflineReady() {
        console.log("App ready to work offline");
      },
      onRegistered(registration) {
        console.log("SW registered with scope:", registration?.scope);
      },
      onRegisterError(error) {
        console.error("SW registration error:", error);
      },
    });

    return checkSWUpdate;
  } catch (error) {
    console.error("Error registering service worker:", error);
    return null;
  }
}

/**
 * Check for updates to the PWA's service worker.
 * Only call this when it's safe to refresh the page (e.g., on the home screen)
 *
 * @returns {Promise<boolean>} Returns true if an update check was performed and found updates
 */
export async function checkForUpdates() {
  // Only check if browser supports service workers and we're online
  if (!("serviceWorker" in navigator) || !navigator.onLine) return false;

  try {
    if (!checkSWUpdate) {
      // If no update function exists yet, try to register first
      checkSWUpdate = registerServiceWorker();
    }

    if (checkSWUpdate) {
      return await checkSWUpdate(true); // Force check for updates
    }

    return false;
  } catch (error) {
    console.error("Error checking for updates:", error);
    return false;
  }
}

/**
 * Initialize the PWA update system.
 * This now uses the manual registration approach.
 */
export function initPWAUpdater() {
  if (!("serviceWorker" in navigator)) return;

  // When a new service worker takes control, reload the page once.
  // This ensures we're running the latest version of the code.
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Register service worker on home screen only
  if (!new URLSearchParams(window.location.search).get("app")) {
    registerServiceWorker();
  }
}
