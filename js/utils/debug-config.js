/**
 * Debug configuration module
 * Controls whether debugging features are enabled
 *
 * Set DEBUG_ENABLED to true during development when you need PWA debugging
 * Set it to false for production or when debugging is not needed
 */

export const DEBUG_ENABLED = false;

// A global debug log function that only logs if debugging is enabled
window.debugLog = (message) => {
  if (!DEBUG_ENABLED) return;

  const panel = document.querySelector("debug-panel");
  if (panel) {
    panel.log(message);
  } else {
    console.log("[PWA Debug]", message);
  }
};

export default {
  isEnabled: DEBUG_ENABLED,
};
