import { addInteractionHandlers } from "../functions.js";
import { initializeAudioContext, playClick } from "../shared/audio.js";

class LoadingDialog extends HTMLElement {
  static get observedAttributes() {
    return ["app-name"];
  }

  #eventListenersInitialized = false;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "app-name" && oldValue !== newValue && oldValue !== null) {
      this.render();
    }
  }

  render() {
    const appName = this.getAttribute("app-name");
    const iconPath = appName ? `../assets/${appName}-icon-white.png` : "";
    const iconHtml = appName
      ? `<img src="${iconPath}" alt="${appName} icon">`
      : "";

    this.innerHTML = `
      <dialog class="loading-screen" data-element="loading-dialog" open>
        <div class="loading-screen__inner">
          <div class="loading-screen__loading" id="p5_loading">
            ${iconHtml}
            <p class="loading-screen__text">Loading...</p>
          </div>
          <button class="loading-screen__start" data-element="start-button">
            Touch here to begin
          </button>
        </div>
      </dialog>
    `;

    // Set up event listeners after render if not already done
    if (!this.#eventListenersInitialized) {
      this.setupEventListeners();
      this.#eventListenersInitialized = true;
    }
  }

  setupEventListeners() {
    const dialog = this.querySelector('[data-element="loading-dialog"]');
    const startButton = this.querySelector('[data-element="start-button"]');

    if (!dialog || !startButton) {
      throw new Error("Loading dialog: Required elements not found");
    }

    const handleStart = () => {
      initializeAudioContext();
      playClick();
      dialog.close();
      this.dispatchEvent(new CustomEvent("app-start"));
    };

    addInteractionHandlers(startButton, handleStart);

    const checkLoading = setInterval(() => {
      if (!document.getElementById("p5_loading")) {
        startButton.style.display = "block";
        clearInterval(checkLoading);
      }
    }, 100);
  }
}

customElements.define("loading-dialog", LoadingDialog);
