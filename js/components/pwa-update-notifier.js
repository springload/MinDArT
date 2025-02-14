class PWAUpdateNotifier extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <dialog class="update-dialog" data-element="update-dialog">
        <div class="update-dialog__inner">
          <button class="update-dialog__dismiss" data-element="close-button" aria-label="close">
            <svg viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" d="m2 2 14 14m-14 0 14-14" />
            </svg>
          </button>
          <span class="update-dialog__message">New version available!</span>
          <button class="btn btn--theme" data-element="update-button">Update</button>
        </div>
      </dialog>
    `;
  }

  setupEventListeners() {
    this.dialog = this.querySelector('[data-element="update-dialog"]');
    this.updateButton = this.querySelector('[data-element="update-button"]');
    this.closeButton = this.querySelector('[data-element="close-button"]');

    if (!this.dialog || !this.updateButton || !this.closeButton) {
      throw new Error("PWA Update Notifier: Required elements not found");
    }

    const handleUpdate = () => {
      window.location.reload();
    };

    const handleClose = () => {
      this.dialog.close();
    };

    this.updateButton.addEventListener("click", handleUpdate);
    this.closeButton.addEventListener("click", handleClose);

    window.addEventListener("sw-update-ready", () => {
      this.showUpdateDialog();
    });
  }

  showUpdateDialog() {
    if (!this.dialog) return;
    this.dialog.showModal();
  }
}

customElements.define("pwa-update-notifier", PWAUpdateNotifier);
