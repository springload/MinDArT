import { addInteractionHandlers } from "../utils/events.js";
import { playClick } from "../utils/audio.js";
/**
 * A web component that provides common application controls (home, reset, save).
 * Emits custom events for reset and save actions, and handles navigation for home.
 *
 * @extends HTMLElement
 * @fires app-reset - When the reset button is clicked
 * @fires app-save - When the save button is clicked
 * @customElement app-controls
 */
class AppControls extends HTMLElement {
  /**
   * Creates an instance of AppControls.
   */
  constructor() {
    super();
  }

  /**
   * Called when the element is added to the document.
   * Renders the control buttons and sets up event listeners.
   */
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  /**
   * Renders the component's HTML structure.
   * Creates home link, reset button, and save button with theme styling.
   * @private
   */
  render() {
    this.innerHTML = `
      <div class="app-controls" data-element="app-controls">
        <a href="" class="btn btn--theme" data-element="home-link">Main Menu</a>
        <button class="btn btn--theme" data-element="reset-button">New</button>
        <button class="btn btn--theme" data-element="save-button">Save</button>
      </div>
    `;
  }

  /**
   * Sets up event listeners for each button.
   * @private
   */
  setupEventListeners() {
    const resetButton = this.querySelector('[data-element="reset-button"]');
    const saveButton = this.querySelector('[data-element="save-button"]');
    const homeLink = this.querySelector('[data-element="home-link"]');

    /**
     * Event handler functions for each button
     * @type {Object.<string, Function>}
     */
    const actions = {
      reset: () => {
        playClick();
        this.dispatchEvent(new CustomEvent("app-reset"));
      },
      save: () => {
        playClick();
        this.dispatchEvent(new CustomEvent("app-save"));
      },
      home: (e) => {
        e.preventDefault();
        playClick();
        window.history.pushState({}, "", window.location.pathname);
        window.dispatchEvent(new PopStateEvent("popstate"));
      },
    };

    if (resetButton) {
      addInteractionHandlers(resetButton, actions.reset);
    }

    if (saveButton) {
      addInteractionHandlers(saveButton, actions.save);
    }

    if (homeLink) {
      addInteractionHandlers(homeLink, actions.home);
    }
  }
}

customElements.define("app-controls", AppControls);
