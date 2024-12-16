import { isClickOnButton } from "./functions.js";
import { createSymmetryscape } from "./MinDArT-8-Symmetryscape/symmetryscape.js";

new p5((p5) => {
  const appName = "symmetryscape";
  let symmetryscape;
  let prevTouchX = null;
  let prevTouchY = null;

  p5.preload = () => {
    symmetryscape = createSymmetryscape(p5);
    symmetryscape.preload();
  };

  p5.setup = () => {
    symmetryscape.setup();

    const loadingDialog = document.querySelector("loading-dialog");
    // Listen for 'Touch button to start' event
    loadingDialog.addEventListener("app-start", () => {
      symmetryscape.start();
    });
    const appControls = document.querySelector("app-controls");

    // Listen for reset event from 'New' button
    appControls.addEventListener("app-reset", () => {
      symmetryscape.restart();
    });

    // Listen for event from 'Save' button and save an image of the drawing
    appControls.addEventListener("app-save", () => {
      p5.save(
        `${appName}${p5.month()}${p5.day()}${p5.hour()}${p5.second()}.jpg`
      );
    });
  };

  p5.mouseDragged = (event) => {
    handleDrawing(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY, event);
  };

  p5.touchMoved = (event) => {
    if (p5.touches.length > 0) {
      const touch = p5.touches[0];

      // Use stored previous coordinates if available, otherwise use current position
      const currentX = touch.x;
      const currentY = touch.y;
      const previousX = prevTouchX !== null ? prevTouchX : currentX;
      const previousY = prevTouchY !== null ? prevTouchY : currentY;

      // Update previous touch position for next iteration
      prevTouchX = currentX;
      prevTouchY = currentY;

      handleDrawing(currentX, currentY, previousX, previousY, event);
    }

    // Prevent default touch behavior
    return false;
  };

  // Reset tracking when touch starts
  p5.touchStarted = () => {
    prevTouchX = null;
    prevTouchY = null;
  };

  function handleDrawing(currentX, currentY, previousX, previousY, event) {
    // Check if interaction is over a button
    if (isClickOnButton(event)) {
      // don't draw anything
      return;
    }

    symmetryscape.makeDrawing(currentX, currentY, previousX, previousY);

    // Ensure rendering happens
    symmetryscape.render();
  }

  p5.windowResized = () => {
    symmetryscape.windowResized();
  };
}, document.querySelector('[data-element="canvas-container"]'));
