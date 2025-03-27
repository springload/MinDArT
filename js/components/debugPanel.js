import { addInteractionHandlers } from "../utils/events.js";

class DebugPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.messages = [];
    this.maxMessages = 15;
    this.visible = true;
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  addEventListeners() {
    const toggleButton = this.shadowRoot.querySelector(".toggle");
    if (toggleButton) {
      addInteractionHandlers(toggleButton, () => {
        this.visible = !this.visible;
        this.render();
        this.addEventListeners(); // Reattach event listeners after render
      });
    }

    // Add clear functionality
    const clearButton = this.shadowRoot.querySelector(".clear");
    if (clearButton) {
      addInteractionHandlers(clearButton, () => {
        this.messages = [];
        this.render();
        this.addEventListeners(); // Reattach event listeners after render
      });
    }

    // Add force check button
    const checkButton = this.shadowRoot.querySelector(".force-check");
    if (checkButton) {
      addInteractionHandlers(checkButton, () => {
        this.forceCheckForUpdates();
      });
    }

    // Add force activate button
    const activateButton = this.shadowRoot.querySelector(".force-activate");
    if (activateButton) {
      addInteractionHandlers(activateButton, () => {
        this.forceActivateWaiting();
      });
    }
  }

  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    this.messages.unshift({ timestamp, message });

    // Keep only recent messages
    if (this.messages.length > this.maxMessages) {
      this.messages.pop();
    }

    this.render();
    this.addEventListeners(); // Reattach event listeners after render
  }

  async logServiceWorkerStatus() {
    if (!("serviceWorker" in navigator)) {
      this.log("Service Worker not supported");
      return;
    }

    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        this.log("No SW registration found");
        return;
      }

      this.log(`SW scope: ${reg.scope}`);

      // Check update state
      if (reg.installing) {
        this.log("SW state: installing (new SW being installed)");
      }

      if (reg.waiting) {
        this.log("SW state: waiting (update ready but not active)");
      }

      if (reg.active) {
        this.log(`SW state: active (${reg.active.state})`);
      }

      // Check if updatePending flag is set
      try {
        const pwaModule = await import("../utils/pwa.js");
        if (typeof pwaModule.updatePending !== "undefined") {
          this.log(`updatePending flag: ${pwaModule.updatePending}`);
        }

        if (
          typeof pwaModule.checkSWUpdate === "function" ||
          typeof pwaModule.checkForUpdates === "function"
        ) {
          this.log("Update checker is available");
        }
      } catch (e) {
        this.log(`Error checking update status: ${e.message}`);
      }

      // Check if we're on the home screen
      const isHomeScreen = !new URLSearchParams(window.location.search).get(
        "app"
      );
      this.log(`On home screen: ${isHomeScreen}`);

      // Check navigator controller
      if (navigator.serviceWorker.controller) {
        this.log("Page is controlled by a service worker");
      } else {
        this.log("Page is NOT controlled by a service worker");
      }
    } catch (error) {
      this.log(`Error checking SW: ${error.message}`);
    }
  }

  async forceCheckForUpdates() {
    this.log("Manually triggering update check...");
    try {
      const pwaModule = await import("../utils/pwa.js");
      if (typeof pwaModule.checkForUpdates === "function") {
        const result = await pwaModule.checkForUpdates();
        this.log(`Update check result: ${result}`);
      } else {
        this.log("checkForUpdates function not found");
      }
    } catch (e) {
      this.log(`Error checking updates: ${e.message}`);
    }
  }

  async forceActivateWaiting() {
    this.log("Attempting to activate waiting service worker...");
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.waiting) {
        this.log("Found waiting worker - sending skipWaiting message");
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      } else {
        this.log("No waiting worker to activate");
      }
    } catch (e) {
      this.log(`Error activating: ${e.message}`);
    }
  }

  render() {
    const style = `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        font-family: monospace;
        font-size: 14px;
        width: 100%;
        max-width: 500px;
      }
      
      .debug-panel {
        --debug-color: lightseagreen;
        margin-block-start: 1.5rem;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.8);
        color: var(--debug-color);
        border: 1px solid var(--debug-color);
        padding: 8px;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      
      .button-group {
        display: flex;
        gap: 4px;
      }
      
      button {
        border-radius: 4px;
        background: none;
        border: 1px solid var(--debug-color);
        color: var(--debug-color);
        padding: 2px 6px;
        cursor: pointer;
        font-size: 12px;
      }
      
      button:hover {
        background-color: hsla(177, 69.5%, 41.2%, 0.4);
      }
      
      .message {
        margin-bottom: 4px;
        word-wrap: break-word;
      }
      
      .timestamp {
        color: #ccc;
        margin-right: 6px;
      }
      
      .toggle {
      border: 1px solid rgba(0, 0, 0, 0.8);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        padding: 4px 8px;
      }
    `;

    const messages = this.messages
      .map(
        (msg) => `
      <div class="message">
        <span class="timestamp">[${msg.timestamp}]</span>
        <span class="content">${msg.message}</span>
      </div>
    `
      )
      .join("");

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <button class="toggle">${this.visible ? "Hide" : "Show"}</button>
      ${
        this.visible
          ? `<div class="debug-panel">
               <div class="controls">
                 <span>PWA Debug</span>
                 <div class="button-group">
                   <button class="force-check">Check</button>
                   <button class="force-activate">Activate</button>
                   <button class="clear">Clear</button>
                 </div>
               </div>
               <div class="messages">
                 ${messages}
               </div>
             </div>`
          : ""
      }
    `;
  }
}

customElements.define("debug-panel", DebugPanel);

// Global helper to log to the debug panel
window.debugLog = (message) => {
  const panel = document.querySelector("debug-panel");
  if (panel) {
    panel.log(message);
  } else {
    console.log("[PWA Debug]", message);
  }
};

// Monitor PWA events
if ("serviceWorker" in navigator) {
  // Track controller change events
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.debugLog("Service worker controller changed");
  });

  // Track message events from service worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data) {
      window.debugLog(`Message from SW: ${JSON.stringify(event.data)}`);
    }
  });
}

// Monitor registration and update events from the PWA plugin
document.addEventListener("vite-pwa:register-result", (e) => {
  window.debugLog(`PWA registered: ${e.detail.registered}`);
});

document.addEventListener("vite-pwa:ready", (e) => {
  window.debugLog("PWA is ready");
});

document.addEventListener("vite-pwa:needs-refresh", () => {
  window.debugLog("PWA needs refresh - update available");
});

document.addEventListener("vite-pwa:offline-ready", () => {
  window.debugLog("PWA ready for offline use");
});

export const logDebug = window.debugLog;
