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
        <a href="" class="btn btn--theme" data-element="home-link">Main Menu</a>
        <button class="btn btn--theme" data-element="reset-button">New</button>
        <button class="btn btn--theme" data-element="save-button">Save</button>
      </div>
    `;
  }

  setupEventListeners() {
    const resetButton = this.querySelector('[data-element="reset-button"]');
    const saveButton = this.querySelector('[data-element="save-button"]');
    const homeLink = this.querySelector('[data-element="home-link"]');

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
