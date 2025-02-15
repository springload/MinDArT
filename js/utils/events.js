/**
 * Adds both click and touch handlers to an element for cross-device interaction.
 * Prevents double-firing of events on touch devices.
 *
 * @param {HTMLElement} element - The DOM element to add handlers to
 * @param {(event: Event) => void} handler - Event handler function to be called
 */
export function addInteractionHandlers(element, handler) {
  element.addEventListener("click", handler);
  element.addEventListener("touchend", (e) => {
    e.preventDefault(); // Prevent mouse event from firing
    handler(e);
  });
}

/**
 * Sets up canvas event listeners for touch and mouse interactions.
 * Attaches handlers for move, down, up, leave, and cancel events for both touch and mouse.
 *
 * @throws {Error} If canvas-container element is not found in the DOM
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
 * Checks if a click/touch event occurred on an interface element.
 * Used to prevent canvas drawing when interacting with UI elements.
 *
 * @param {Event|undefined} event - The DOM event to check
 * @returns {boolean} True if click was on a button or interface element, false otherwise
 */
export function isClickOnButton(event) {
  const isInvalidEvent = Boolean(
    !event || !event.target || typeof event.target.closest !== "function"
  );
  if (isInvalidEvent) {
    return false;
  }
  return (
    event.target.closest(".btn") !== null ||
    event.target.closest(".interface") !== null
  );
}
