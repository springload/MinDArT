import { registerSW } from "virtual:pwa-register";

// Tracking this prevents an infinite refresh loop when a new service worker takes control.
let refreshing = false;
let checkSWUpdate = null;
let updatePending = false;

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
        console.log("New content available, refresh waiting for home screen");
        updatePending = true;
        // Don't call the reload immediately
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
      // We only trigger the update check here, but won't apply it yet
      return await checkSWUpdate(true); // Force check for updates
    }

    return false;
  } catch (error) {
    console.error("Error checking for updates:", error);
    return false;
  }
}

/**
 * Apply any pending updates if we're on the home screen.
 * Call this periodically to check if we can refresh.
 */
export function applyUpdatesIfOnHomeScreen() {
  // Only proceed if there's an update waiting to be applied
  if (!updatePending) return;

  // Check if we're on the home screen by looking for the 'app' query parameter
  const isOnHomeScreen = !new URLSearchParams(window.location.search).get(
    "app"
  );

  if (isOnHomeScreen) {
    console.log("On home screen with pending update - refreshing page");
    updatePending = false;
    window.location.reload();
  } else {
    console.log("Update pending but not on home screen - waiting");
  }
}

/**
 * Initialize the PWA update system.
 * This now uses the manual registration approach.
 */
export function initPWAUpdater() {
  if (!("serviceWorker" in navigator)) return;

  // When a new service worker takes control, reload the page once,
  // but ONLY if we're on the home screen
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;

      // Check if we're on the home screen
      const isOnHomeScreen = !new URLSearchParams(window.location.search).get(
        "app"
      );

      if (isOnHomeScreen) {
        console.log("Service worker changed - refreshing on home screen");
        window.location.reload();
      } else {
        console.log(
          "Service worker changed but not refreshing - not on home screen"
        );
        // Mark update as pending so we can apply it later
        updatePending = true;
      }
    }
  });

  // Register service worker on home screen only
  if (!new URLSearchParams(window.location.search).get("app")) {
    registerServiceWorker();
  }

  // Check periodically if we can apply updates
  setInterval(applyUpdatesIfOnHomeScreen, 5000);
}
