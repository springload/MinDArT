/**
 * Enables/disables app links based on the current week number since program start.
 * Used to progressively unlock content over time
 */
export function showOnlyCurrentLinks() {
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
  // Links for future weeks are made unclickable using the 'disabled' attribute
  drawingAppLinks.forEach((link) => {
    link.dataset.week <= currentWeekNumber
      ? link.removeAttribute("disabled")
      : link.setAttribute("disabled", true);
  });
}

// Interface utility functions for managing button states and interactions

// Remove 'active' class from all buttons
export function clearActiveButtonState() {
  const activeButtons = document.querySelectorAll(".btn.active");
  activeButtons.forEach((button) => button.classList.remove("active"));
}

export function hasActiveClass(el) {
  return Boolean(el && el.classList.contains("active"));
}

/**
 * Adds both click and touch handlers to an element
 * @param {HTMLElement} element - The element to add handlers to
 * @param {Function} handler - The event handler function
 */
export function addInteractionHandlers(element, handler) {
  element.addEventListener("click", handler);
  element.addEventListener("touchend", (e) => {
    e.preventDefault(); // Prevent mouse event from firing
    handler(e);
  });
}

// Color utility functions

// Convert hex color to RGB color object
export function hexToRgb(p5, hex) {
  hex = hex.replace("#", "");

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return p5.color(r, g, b);
}

// Apply alpha channel to a color
export function colorAlpha(p5, aColor, alpha) {
  const c = p5.color(aColor);
  return p5.color(p5.red(c), p5.green(c), p5.blue(c), alpha * 255);
}

/**
 * Sets up canvas event listeners for touch and mouse interactions
 */
export function setupCanvasEventListeners() {
  const canvasContainer = document.querySelector(
    '[data-element="canvas-container"]'
  );
  const canvas = canvasContainer.querySelector("canvas");
  canvas.addEventListener("touchmove", handleMove, { passive: false });
  canvas.addEventListener("mousemove", handleMove);
  canvas.addEventListener("touchstart", touchdown);
  canvas.addEventListener("mousedown", touchdown);
  canvas.addEventListener("touchend", touchstop);
  canvas.addEventListener("touchleave", touchstop);
  canvas.addEventListener("touchcancel", touchstop);
  canvas.addEventListener("mouseup", touchstop);
  canvas.addEventListener("mouseleave", touchstop);
}

/**
 * Checks if a click/touch event occurred on a button (so we can prevent propogation of that click to the canvas)
 * @param {Event} e - The event to check
 * @returns {boolean} True if click was on a button/interface element
 */
export function isClickOnButton(event) {
  // is event is a valid DOM event with target property?
  if (!event || !event.target || typeof event.target.closest !== "function") {
    return false;
  }
  return (
    event.target.closest(".btn") !== null ||
    event.target.closest(".interface") !== null
  );
}
