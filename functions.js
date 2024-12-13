/**
 * Enables/disables app links based on the current week number since program start.
 * Used to progressively unlock content over time
 */
function showOnlyCurrentLinks() {
  // set programme start date (mm/dd/yyyy)
  const startDate = new Date("02/19/2024");
  const dayInMilliseconds = 86400000;

  const today = new Date();
  const elapsedDays = Math.floor((today - startDate) / dayInMilliseconds);
  const currentWeekNumber = Math.ceil(elapsedDays / 7);

  const homeGrid = document.querySelector('[data-element="home-grid"]');
  if (!homeGrid) {
    console.warn(
      'Parent element with attribute data-element="home-grid" not found'
    );
  }
  const drawingAppLinks = homeGrid.querySelectorAll("[data-week]");

  // Enable/disable links based on their week number
  // Links for future weeks are made unclickable using the 'inert' attribute
  drawingAppLinks.forEach((link) => {
    link.dataset.week <= currentWeekNumber
      ? link.removeAttribute("inert")
      : link.setAttribute("inert", true);
  });
}

// Interface utility functions for managing button states and interactions

// Remove 'active' class from all buttons
function clearActiveButtonState() {
  const activeButtons = document.querySelectorAll(".btn.active");
  activeButtons.forEach((button) => button.classList.remove("active"));
}

function hasActiveClass(el) {
  return Boolean(el && el.classList.contains("active"));
}

/**
 * Sets up the loading screen with start button functionality
 * @param {Function} onStart - Callback function to execute when start button is clicked
 */
function setupLoadingScreen(onStart) {
  const loadingDialog = document.querySelector("loading-dialog");

  if (!loadingDialog) {
    throw new Error("Loading dialog not found");
  }

  loadingDialog.addEventListener("start", onStart);
}

/**
 * Initializes common app controls (main menu, reset, save)
 * @param {Function} resetCallback - Function to call when reset button is clicked
 * @returns {Object} Object containing references to control elements
 */
function initializeAppControls(resetCallback) {
  const { appName } = document.body.dataset;
  const appControls = document.querySelector('[data-element="app-controls"]');
  if (!appControls) {
    console.warn(
      'No element with [data-element="app-controls"] found. App controls not initialized.'
    );
    return;
  }

  // Add click sounds to navigation links
  const links = appControls.querySelectorAll("a");
  links.forEach(addClickSound);

  // Configure buttons with their handlers
  const buttonConfigs = [
    {
      name: "reset-button",
      handler:
        resetCallback || (() => console.warn("No reset callback provided")),
    },
    {
      name: "save-button",
      handler: () => {
        save(`${appName}${month()}${day()}${hour()}${second()}.jpg`);
      },
    },
  ];

  // Initialize each button with its handler and click sound
  const [resetButton, saveButton] = buttonConfigs.reduce(
    (acc, { name, handler }) => {
      const element = appControls.querySelector(`[data-element="${name}"]`);
      if (!element) {
        console.warn(
          `${name} not found - missing element with data-element="${name}"`
        );
        return acc;
      }
      addClickSound(element);
      element.addEventListener("click", handler);
      return [...acc, element];
    },
    []
  );

  return {
    resetButton,
    saveButton,
    container: document.querySelector('[data-element="app-controls"]'),
  };
}

/**
 * Initializes toolbar buttons with click sounds and active state management
 */
function initializeToolbarButtons() {
  const toolbar = document.querySelector('[data-element="toolbar"]');
  if (toolbar) {
    const btns = Array.from(toolbar.querySelectorAll(".btn"));

    btns.forEach((btn) => {
      addClickSound(btn);

      // Some apps only need click sounds, not active state management
      if (
        ["dotscape", "linkscape"].some(
          (appName) => document.body.dataset.appName === appName
        )
      ) {
        return;
      }

      btn.addEventListener("click", (e) => {
        // Prevent event from reaching the canvas
        e.stopPropagation();

        const clicked = e.currentTarget;

        // Special case for symmetryscape draw mode button, it shouldn't receive the active state
        if (
          document.body.dataset.appName === "symmetryscape" &&
          clicked.dataset.element === "draw-mode-button"
        ) {
          return;
        }

        // Update active state
        const current = document.querySelector(".active");
        if (current) {
          current.classList.remove("active");
        }
        clicked.classList.add("active");
      });
    });
  }
}

// Color utility functions

// Convert hex color to RGB color object
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return color(r, g, b);
}

// Apply alpha channel to a color
function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color("rgba(" + [red(c), green(c), blue(c), alpha].join(",") + ")");
}

/**
 * Sets up canvas event listeners for touch and mouse interactions
 */
function setupCanvasEventListeners() {
  const canvasContainer = document.querySelector(
    '[data-element="canvas-container"]'
  );
  const canvas = canvasContainer.querySelector("canvas");
  canvas.addEventListener("touchmove", moved, { passive: false }); // passive: false prevents scroll on touch
  canvas.addEventListener("mousemove", moved);
  canvas.addEventListener("touchstart", touchdown);
  canvas.addEventListener("mousedown", touchdown);
  canvas.addEventListener("touchend", touchstop);
  canvas.addEventListener("touchleave", touchstop);
  canvas.addEventListener("mouseup", touchstop);
  canvas.addEventListener("mouseup", touchstop);
}

/**
 * Checks if a click/touch event occurred on a button (so we can prevent propogation of that click to the canvas)
 * @param {Event} e - The event to check
 * @returns {boolean} True if click was on a button/interface element
 */
function isClickOnButton(e) {
  return (
    e.target.closest(".btn") !== null || e.target.closest(".interface") !== null
  );
}
