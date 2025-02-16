import { addInteractionHandlers } from "../utils/events.js";
import { initializeAudioContext, playClick } from "../utils/audio.js";

class LoadingDialog extends HTMLElement {
  static get observedAttributes() {
    return ["app-name"];
  }

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
    const iconPath = appName
      ? `${import.meta.env.BASE_URL}images/${appName}-icon-white.webp`
      : "";
    const iconHtml = appName
      ? `<img src="${iconPath}" alt="${appName} icon">`
      : "";

    this.innerHTML = `
      <dialog class="loading-screen" data-element="loading-dialog" open>
        <div class="loading-screen__inner">
          ${iconHtml}
          <button class="loading-screen__start" data-element="start-button">
            Touch here to begin
          </button>
        </div>
      </dialog>
    `;

    this.setupEventListeners();
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
  }
}

customElements.define("loading-dialog", LoadingDialog);
