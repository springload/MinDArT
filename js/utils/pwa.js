import { registerSW } from "virtual:pwa-register";
import { DEBUG_ENABLED } from "./debug-config.js";

// Tracking this prevents an infinite refresh loop when a new service worker takes control.
let refreshing = false;
let checkSWUpdate = null;
let updatePending = false;
let updateCheckInterval = null;
let statusCheckInterval = null;

// Make these accessible for debugging
export { refreshing, checkSWUpdate, updatePending };

// Wrapper for debugLog that only logs if DEBUG_ENABLED and window.debugLog exists
const logDebug = (message) => {
  if (DEBUG_ENABLED && typeof window.debugLog === "function") {
    window.debugLog(message);
  }
};

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

        logDebug("UPDATE DETECTED: New content available");
      },
      onOfflineReady() {
        console.log("App ready to work offline");
      },
      onRegistered(registration) {
        console.log("SW registered with scope:", registration?.scope);

        logDebug(
          `SW registration successful with scope: ${registration?.scope}`
        );

        // After registration, immediately check for updates
        if (registration) {
          setTimeout(() => {
            registration
              .update()
              .catch((err) =>
                console.error("Error checking for updates:", err)
              );
          }, 1000);
        }
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
  if (!("serviceWorker" in navigator)) {
    console.log("Service worker not supported - skipping update check");
    return false;
  }

  if (!navigator.onLine) {
    console.log("Browser is offline - skipping update check");
    return false;
  }

  console.log("Checking for updates...");

  logDebug("Executing checkForUpdates()");
  logDebug(`checkSWUpdate exists: ${!!checkSWUpdate}`);

  try {
    // First, manually call update() on the registration
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      console.log("Manually checking for service worker updates");
      logDebug("Calling registration.update() to check for new service worker");
      await registration.update();
    }

    if (!checkSWUpdate) {
      // If no update function exists yet, try to register first
      logDebug("No update function found - attempting registration");
      checkSWUpdate = registerServiceWorker();
    }

    if (checkSWUpdate) {
      // We only trigger the update check here, but won't apply it yet
      logDebug("Calling update check function with forceUpdate=true");

      const result = await checkSWUpdate(true); // Force check for updates

      logDebug(`Update check returned: ${result}`);

      return result;
    }

    logDebug("No update function available after attempted registration");

    return false;
  } catch (error) {
    console.error("Error checking for updates:", error);

    logDebug(`Error in checkForUpdates: ${error.message}`);

    return false;
  }
}

/**
 * Apply any pending updates if we're on the home screen.
 */
export function applyPendingUpdates() {
  // Only proceed if there's an update waiting to be applied
  if (!updatePending) {
    return false;
  }

  console.log("Update pending - refreshing page");
  logDebug("REFRESHING: Applying pending update");

  updatePending = false;
  window.location.reload();
  return true;
}

/**
 * Manually check service worker for updates
 * This is a complement to checkForUpdates that checks the registration directly
 */
export async function checkServiceWorkerStatus() {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    // Check if there's a waiting worker
    if (registration.waiting) {
      console.log("Service worker update available but waiting");

      logDebug("Found waiting worker during status check");

      // Mark as pending update
      updatePending = true;
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking service worker status:", error);
    return false;
  }
}

/**
 * Start periodic update checks - only call when on home screen
 */
export function startUpdateChecks() {
  // Clear any existing intervals to prevent duplicates
  stopUpdateChecks();

  // Immediately check for updates
  checkForUpdates().then((hasUpdate) => {
    logDebug(`Initial update check on home screen: ${hasUpdate}`);
    if (hasUpdate) {
      applyPendingUpdates();
    }
  });

  // Also check service worker status
  checkServiceWorkerStatus().then((hasWaiting) => {
    if (hasWaiting) {
      applyPendingUpdates();
    }
  });

  // Set up periodic checks for when we stay on the home screen
  updateCheckInterval = setInterval(() => {
    checkForUpdates();
  }, 60000); // Check every minute

  statusCheckInterval = setInterval(async () => {
    const hasWaiting = await checkServiceWorkerStatus();
    // If we found a waiting worker, we need to set updatePending flag
    if (hasWaiting) {
      updatePending = true;
      applyPendingUpdates();
    }
  }, 30000);
}

/**
 * Stop periodic update checks - call when leaving home screen
 */
export function stopUpdateChecks() {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }

  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
    statusCheckInterval = null;
  }
}

/**
 * Initialize the PWA update system.
 * This now uses the manual registration approach.
 */
export function initPWAUpdater() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service worker not supported - skipping PWA updater");
    return;
  }

  // When a new service worker takes control, reload the page once,
  // but ONLY if we're on the home screen
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Service worker controller changed");

    logDebug("CONTROLLER CHANGED: Service worker controller changed");

    if (!refreshing) {
      refreshing = true;

      // Check if we're on the home screen
      const isOnHomeScreen = !new URLSearchParams(window.location.search).get(
        "app"
      );

      if (isOnHomeScreen) {
        console.log("Service worker changed - refreshing on home screen");

        logDebug("On home screen during controller change - refreshing");

        window.location.reload();
      } else {
        console.log(
          "Service worker changed but not refreshing - not on home screen"
        );

        logDebug(
          "Not on home screen during controller change - marking update pending"
        );

        // Mark update as pending so we can apply it later
        updatePending = true;
      }
    }
  });

  // Register service worker immediately
  registerServiceWorker();

  // Initial check - if we're on the home screen, start update monitoring
  if (!new URLSearchParams(window.location.search).get("app")) {
    startUpdateChecks();
  }

  // Listen for navigation events to start/stop update checks appropriately
  window.addEventListener("popstate", () => {
    const isOnHomeScreen = !new URLSearchParams(window.location.search).get(
      "app"
    );
    if (isOnHomeScreen) {
      startUpdateChecks();
    } else {
      stopUpdateChecks();
    }
  });
}

// Force activation of waiting service worker - for debugging
export async function forceSkipWaiting() {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      console.log("Telling waiting worker to skip waiting");

      logDebug("Sending skipWaiting message to waiting worker");

      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error forcing skip waiting:", error);
    return false;
  }
}
