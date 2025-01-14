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
 * @param {Event} event - The event to check
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
