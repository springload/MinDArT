class LoadingDialog extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const appName = this.getAttribute("app-name") || "";

    this.innerHTML = `
      <dialog class="loading-screen" data-element="loading-dialog" open>
        <div class="loading-screen__inner test">
          <div class="loading-screen__loading" id="p5_loading">
            <img src="../assets/${appName}-icon-white.png" alt="${appName} icon">
            <p class="loading-screen__text">Loading...</p>
          </div>
          <button class="loading-screen__start" data-element="start-button">
            Touch here to begin
          </button>
        </div>
      </dialog>
    `;
  }

  setupEventListeners() {
    const dialog = this.querySelector('[data-element="loading-dialog"]');
    const startButton = this.querySelector('[data-element="start-button"]');

    if (!dialog || !startButton) {
      throw new Error("Loading dialog: Required elements not found");
    }

    startButton.addEventListener("click", () => {
      // Play click sound if available
      if (window.playClick) {
        window.playClick();
      }

      dialog.close();
      this.dispatchEvent(new CustomEvent("start"));
    });

    // Show start button when p5.js has finished loading
    const checkLoading = setInterval(() => {
      if (!document.getElementById("p5_loading")) {
        startButton.style.display = "block";
        clearInterval(checkLoading);
      }
    }, 100);
  }
}

customElements.define("loading-dialog", LoadingDialog);