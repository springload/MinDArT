// Tracking this prevents an infinite refresh loop when a new service worker takes control.
let refreshing = false;

/**
 * Check for updates to the PWA's service worker.
 *
 * 1. Checks if we're online and have service worker support
 * 2. Finds the current service worker registration
 * 3. Asks it to check for updates from the server
 *
 * @returns {Promise<boolean>} Returns true if an update check was performed
 */
export async function checkForUpdates() {
  // Only check if browser supports service workers and we're online
  if (!("serviceWorker" in navigator) || !navigator.onLine) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    // Download a new service worker, if an update exists.
    // The new service worker will take over when the page next reloads.
    await registration.update();
    return true;
  } catch (error) {
    console.error("Error checking for updates:", error);
    return false;
  }
}

/**
 * Initialize the PWA update system.
 *
 * Update flow:
 * 1. User navigates back to home view
 * 2. checkForUpdates() is called and finds an update
 * 3. New service worker is downloaded and installed in the background
 * 4. When the new service worker takes control ('controllerchange' event),
 *    we reload the page once to ensure the new version is running completely
 *
 * This function only sets up the controllerchange handler - the actual update
 * checks happen in the router when returning to the home view.
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
}
