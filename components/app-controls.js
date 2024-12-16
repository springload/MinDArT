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
    const menuLink = this.querySelector("a");

    // Add click sounds to all controls
    [resetButton, saveButton, menuLink].forEach((element) => {
      if (window.addClickSound && element) {
        window.addClickSound(element);
      }
    });

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("app-reset"));
      });
    }

    if (saveButton) {
      saveButton.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("app-save"));
      });
    }
  }
}

customElements.define("app-controls", AppControls);
