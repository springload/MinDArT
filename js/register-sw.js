export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      // Check if we're in a secure context or true localhost
      const isLocalhost = Boolean(
        window.location.hostname === "localhost" ||
          window.location.hostname === "[::1]" ||
          window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
          )
      );

      // Only register if we're in HTTPS or true localhost
      if (window.location.protocol === "https:" || isLocalhost) {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available, notify user if desired
              if (confirm("New version available! Reload to update?")) {
                window.location.reload();
              }
            }
          });
        });

        console.log(
          "Service Worker registered successfully:",
          registration.scope
        );
      } else {
        console.log(
          "Service Worker not registered - requires HTTPS or localhost"
        );
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}
