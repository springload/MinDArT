class AppControls extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["app-name"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const appName = this.getAttribute("app-name");

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

    // Handle save functionality
    if (saveButton && window.save) {
      saveButton.addEventListener("click", () => {
        const appName = document.body.dataset.appName;
        window.save(
          `${appName}${window.month()}${window.day()}${window.hour()}${window.second()}.jpg`
        );
      });
    }

    // Dispatch a custom event when reset is clicked
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("reset"));
      });
    }
  }
}

customElements.define("app-controls", AppControls);
