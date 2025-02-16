import { addInteractionHandlers } from "../utils/events.js";
import { initializeAudioContext, playClick } from "../utils/audio.js";

/**
 * A web component that displays an initial loading dialog with app icon and start button.
 * Handles audio initialization and emits an event when the user starts the app.
 *
 * @extends HTMLElement
 * @fires app-start - When the start button is clicked and audio is initialized
 * @customElement loading-dialog
 */
class LoadingDialog extends HTMLElement {
  /**
   * Specifies which attributes should trigger attributeChangedCallback.
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ["app-name"];
  }

  /**
   * Creates an instance of LoadingDialog.
   */
  constructor() {
    super();
  }

  /**
   * Called when the element is added to the document.
   * Renders the dialog based on the current app-name.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Called when an observed attribute changes.
   * i.e. re-renders the dialog if "app-name" changes.
   *
   * @param {string} name - Name of the changed attribute
   * @param {string|null} oldValue - Previous value
   * @param {string|null} newValue - New value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "app-name" && oldValue !== newValue && oldValue !== null) {
      this.render();
    }
  }

  /**
   * Renders the dialog with app icon and start button.
   * Icon path is constructed based on the app-name attribute.
   * @private
   */
  render() {
    const appName = this.getAttribute("app-name");
    const iconPath = appName
      ? `${import.meta.env.BASE_URL}images/${appName}-icon-white.webp`
      : "";
    const iconHtml = appName
      ? `<img src="${iconPath}" alt="${appName} icon">`
      : "";

    this.innerHTML = `
      <dialog class="loading-dialog" data-element="loading-dialog" open>
        <div class="loading-dialog__inner">
          ${iconHtml}
          <button class="loading-dialog__start-button" data-element="start-button">
            Touch here to begin
          </button>
        </div>
      </dialog>
    `;

    this.setupEventListeners();
  }

  /**
   * Sets up event handlers for the start button.
   * Initializes audio context and fires app-start event when clicked.
   * @private
   * @throws {Error} If required dialog elements are not found
   */
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
