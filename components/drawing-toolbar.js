import { playClick } from "../shared/audio.js";

// DrawingToolbar extends HTMLElement to create a custom HTML element
// This allows us to create <drawing-toolbar> tags that the browser recognizes
class DrawingToolbar extends HTMLElement {
  // Specify which attributes should trigger attributeChangedCallback when modified
  // Only 'app-name' is observed since config is handled through internal methods
  static get observedAttributes() {
    return ["app-name"];
  }

  // Constructor is called when an instance of the element is created
  // Must call super() first to initialize the HTMLElement base class
  constructor() {
    super();
  }

  // Called when the element is added to the DOM
  // This is where we do initial setup, rendering, and event binding
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  // Get the toolbar configuration based on the app-name attribute
  // This defines the structure and behavior of the toolbar for each app
  getToolbarConfig() {
    const configs = {
      touchscape: {
        items: [
          {
            type: "button",
            text: "Erase",
            onClick: "rake(0)",
            class: "btn--white",
          },
          {
            type: "button",
            icon: "brush",
            brushLines: 3,
            onClick: "rake(1)",
            class: "btn--white",
          },
          {
            type: "button",
            icon: "brush",
            brushLines: 6,
            onClick: "rake(2)",
            class: "btn--white",
          },
          {
            type: "button",
            icon: "brush",
            brushLines: 10,
            onClick: "rake(3)",
            class: "btn--white",
          },
        ],
      },
      linescape: {
        items: [
          {
            type: "swatch-group",
            wrapperClass: "btn-group--split",
            swatches: [
              {
                dataElement: "swatch",
                dataSwatch: "0",
                onClick: "switchSwatch(this)",
                class: "btn--leftsplit active",
              },
              {
                dataElement: "swatch",
                dataSwatch: "1",
                onClick: "switchSwatch(this)",
                class: "btn--rightsplit",
              },
            ],
          },
        ],
      },
      circlescape: {
        items: [
          {
            type: "button",
            text: "Erase",
            dataElement: "erase-button",
            class: "btn--white",
          },
          {
            type: "button",
            text: "Draw small",
            dataElement: "draw-small-button",
            class: "btn--white btn--leftsplit",
          },
          {
            type: "button",
            text: "Draw big",
            dataElement: "draw-big-button",
            class: "btn--white btn--rightsplit",
          },
        ],
      },
      colourscape: {
        items: [
          {
            type: "button",
            text: "Erase Draw",
            dataElement: "erase-draw-button",
            class: "btn--white",
          },
          {
            type: "button",
            text: "Erase Paint",
            dataElement: "erase-paint-button",
            class: "btn--white",
          },
          {
            type: "paint-group",
            buttons: [
              {
                dataElement: "paint-warm-button",
                class: "btn--leftsplit btn--warm-stripes",
              },
              {
                dataElement: "paint-cool-button",
                class: "btn--rightsplit btn--cool-stripes",
              },
            ],
          },
          {
            type: "button",
            dataElement: "draw-button",
            text: "Draw",
            class: "btn--white",
          },
        ],
      },
      dotscape: {
        items: [
          {
            type: "button",
            text: "Restart",
            dataElement: "restart-button",
            class: "btn--white",
          },
        ],
      },
      linkscape: {
        items: [
          {
            type: "button",
            text: "Add a string",
            dataElement: "add-string-button",
            icon: "plus",
            class: "btn--white",
          },
          {
            type: "button",
            text: "Add a pin",
            dataElement: "add-pin-button",
            icon: "pin",
            class: "btn--white",
          },
        ],
      },
      rotationscape: {
        items: [
          {
            type: "swatch-group",
            swatches: [
              {
                dataElement: "swatch",
                class: "btn--square",
                dataBrush: "1",
              },
              {
                dataElement: "swatch",
                class: "btn--square",
                dataBrush: "2",
              },
              {
                dataElement: "swatch",
                class: "btn--square",
                dataBrush: "3",
              },
              {
                dataElement: "swatch",
                class: "btn--square",
                dataBrush: "4",
              },
            ],
            wrapperClass: "btn-group--split",
            prefix: [
              {
                type: "button",
                text: "Erase",
                dataBrush: "0",
                class: "btn--leftsplit",
              },
            ],
            suffix: [
              {
                type: "button",
                text: "Pick new centre",
                dataElement: "new-center-button",
                class: "btn--rightsplit",
              },
            ],
          },
        ],
      },
      // TODO: handle draw mode being clicked when already in draw mode
      symmetryscape: {
        items: [
          {
            type: "button",
            text: "Erase",
            dataBrush: "0",
            class: "btn--white",
          },
          {
            type: "swatch-group",
            wrapperClass: "btn-group--split",
            prefix: [
              {
                type: "button",
                text: "Draw",
                dataElement: "draw-mode-button",
                class: "btn--white",
              },
            ],
            swatches: [
              { dataBrush: "1" },
              { dataBrush: "2" },
              { dataBrush: "3" },
              { dataBrush: "4" },
              { dataBrush: "5" },
              { dataBrush: "6" },
            ],
          },
        ],
      },
    };

    return configs[this.getAttribute("app-name")] || { items: [] };
  }

  // Returns SVG markup based on icon type and parameters
  renderIcon(icon, lines = 0) {
    if (icon === "brush") {
      const spacing = 70 / (lines + 1);
      const paths = Array.from(
        { length: lines },
        (_, i) => `M32.8 ${spacing + spacing * i}h54.4`
      ).join("");

      return `<svg class="brush" viewBox="0 0 120 70"><path d="${paths}" /></svg>`;
    }
    if (icon === "plus") {
      return `<svg class="icon" viewBox="0 0 48 48">
        <path stroke-width="6" d="M6 24 h36M24 6 v36"/>
      </svg>`;
    }
    if (icon === "pin") {
      return `<svg class="icon" viewBox="0 0 48 52" stroke-width="6">
        <path d="M24 31v13" />
        <circle cx="24" cy="14.5" r="10" />
        <path stroke-width="3" d="M20 14.5c0-2 2-4 4-4"/>
      </svg>`;
    }
    return "";
  }

  // Handles attributes, classes, icons, and text content
  renderButton(item) {
    const attrs = [];
    if (item.id) attrs.push(`id="${item.id}"`);
    if (item.onClick) attrs.push(`onclick="${item.onClick}"`);
    if (item.dataElement) attrs.push(`data-element="${item.dataElement}"`);
    if (item.dataBrush) attrs.push(`data-brush="${item.dataBrush}"`);
    if (item.dataSwatch) attrs.push(`data-swatch="${item.dataSwatch}"`);

    const icon = item.icon ? this.renderIcon(item.icon, item.brushLines) : "";
    const text = item.text ? item.text : "";

    return `
      <button class="btn ${item.class || ""}" ${attrs.join(" ")}>
        ${icon}${text}
      </button>
    `;
  }

  renderSwatchGroup(group) {
    const prefix =
      group.prefix?.map((item) => this.renderButton(item)).join("") || "";
    const suffix =
      group.suffix?.map((item) => this.renderButton(item)).join("") || "";
    const swatches = group.swatches
      .map((swatch) => this.renderButton(swatch))
      .join("");

    return `
      <div class="${group.wrapperClass || ""}">
        ${prefix}
        ${swatches}
        ${suffix}
      </div>
    `;
  }

  render() {
    const config = this.getToolbarConfig();

    const toolbar = `
      <div class="toolbar" data-element="toolbar">
        ${config.items
          .map((item) => {
            switch (item.type) {
              case "swatch-group":
                return this.renderSwatchGroup(item);
              case "paint-group":
                return this.renderSwatchGroup({
                  wrapperClass: "btn-group--split",
                  swatches: item.buttons,
                });
              default:
                return this.renderButton(item);
            }
          })
          .join("")}
      </div>
    `;

    this.innerHTML = toolbar;
  }

  setupEventListeners() {
    const buttons = this.querySelectorAll(".btn");

    const handleButtonInteraction = (button, e) => {
      e.stopPropagation(); // don't pass the event on to the canvas
      playClick();

      // Special case for symmetryscape draw mode button
      if (
        this.getAttribute("app-name") === "symmetryscape" &&
        button.dataset.element === "draw-mode-button"
      ) {
        // this button should be styled as active
        return;
      }

      // Update active state
      if (!["dotscape", "linkscape"].includes(this.getAttribute("app-name"))) {
        const current = this.querySelector(".active");
        if (current) {
          current.classList.remove("active");
        }
        button.classList.add("active");
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", (e) =>
        handleButtonInteraction(button, e)
      );
      button.addEventListener("touchend", (e) => {
        e.preventDefault(); // Prevent mouse event from firing
        handleButtonInteraction(button, e);
      });
    });
  }
}

customElements.define("drawing-toolbar", DrawingToolbar);
