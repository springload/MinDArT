import { addInteractionHandlers } from "../utils/events.js";
import { playClick } from "../utils/audio.js";

class AppControls extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="app-controls" data-element="app-controls">
        <a href="/" class="btn btn--theme">Main Menu</a>
        <button class="btn btn--theme" data-element="reset-button">New</button>
        <button class="btn btn--theme" data-element="save-button">Save</button>
      </div>
    `;
  }

  setupEventListeners() {
    const resetButton = this.querySelector('[data-element="reset-button"]');
    const saveButton = this.querySelector('[data-element="save-button"]');

    const actions = {
      reset: () => {
        playClick();
        this.dispatchEvent(new CustomEvent("app-reset"));
      },
      save: () => {
        playClick();
        this.dispatchEvent(new CustomEvent("app-save"));
      },
    };

    if (resetButton) {
      addInteractionHandlers(resetButton, actions.reset);
    }

    if (saveButton) {
      addInteractionHandlers(saveButton, actions.save);
    }
  }
}

customElements.define("app-controls", AppControls);
