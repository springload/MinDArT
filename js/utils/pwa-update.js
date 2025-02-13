async function checkForUpdates() {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    await registration.update();
    return true;
  } catch (error) {
    console.error("Error checking for updates:", error);
    return false;
  }
}

export function initPWAUpdater() {
  if (!("serviceWorker" in navigator)) return;

  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  setInterval(async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate) {
      window.dispatchEvent(new Event("sw-update-ready"));
    }
  }, 5 * 60 * 1000); // every 5 min
}
