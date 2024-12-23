import { isClickOnButton } from "./functions.js";
import { createCirclescape } from "./MinDArT-3-Circlescape/circlescape.js";
import { createColourscape } from "./MinDArT-4-Colourscape/colourscape.js";
import { createDotscape } from "./MinDArT-5-Dotscape/dotscape.js";
import { createLinkscape } from "./MinDArT-6-Linkscape/linkscape.js";
import { createRotationscape } from "./MinDArT-7-Rotationscape/rotationscape.js";
import { createSymmetryscape } from "./MinDArT-8-Symmetryscape/symmetryscape.js";

// Factory for creating the appropriate drawing app based on app name
function createDrawingApp(p5, appName) {
  const creators = {
    circlescape: createCirclescape,
    colourscape: createColourscape,
    dotscape: createDotscape,
    linkscape: createLinkscape,
    rotationscape: createRotationscape,
    symmetryscape: createSymmetryscape,
  };

  const creator = creators[appName];
  if (!creator) {
    throw new Error(`No drawing app found for ${appName}`);
  }

  return creator(p5);
}

// Initialize p5 with the appropriate drawing app
new p5((p5) => {
  const appName = document.body.dataset.appName;
  let drawingApp;
  let prevTouchX = null;
  let prevTouchY = null;

  p5.preload = () => {
    drawingApp = createDrawingApp(p5, appName);
    drawingApp.preload();
  };

  p5.setup = () => {
    drawingApp.setup();

    // add event listeners for events from interface buttons
    const loadingDialog = document.querySelector("loading-dialog");
    const appControls = document.querySelector("app-controls");
    if (!loadingDialog || !appControls) {
      throw new Error("Loading dialog or app controls were not found");
    }
    // Listen for 'Touch button to start' event
    loadingDialog.addEventListener("app-start", () => {
      drawingApp.start();
    });

    // Listen for reset event from 'New' button
    appControls.addEventListener("app-reset", () => {
      drawingApp.reset();
    });
    // Listen for event from 'Save' button and save an image of the drawing
    appControls.addEventListener("app-save", () => {
      p5.save(
        `${appName}${p5.month()}${p5.day()}${p5.hour()}${p5.second()}.jpg`
      );
    });
  };

  p5.draw = () => {
    return drawingApp?.draw ? drawingApp.draw() : false;
  };

  // Mouse event handlers
  p5.mousePressed = (event) => {
    return drawingApp.handlePointerStart?.(event) ?? false;
  };

  p5.mouseReleased = (event) => {
    return drawingApp.handlePointerEnd?.(event) ?? false;
  };

  p5.mouseDragged = (event) => {
    handlePointerMove(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY, event);
  };

  // Touch event handlers
  p5.touchStarted = (event) => {
    prevTouchX = null;
    prevTouchY = null;
    return drawingApp.handlePointerStart?.(event) ?? false;
  };

  p5.touchEnded = (event) => {
    return drawingApp.handlePointerEnd?.(event) ?? false;
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

      handlePointerMove(currentX, currentY, previousX, previousY, event);
    }

    return false;
  };

  function handlePointerMove(currentX, currentY, previousX, previousY, event) {
    // Let the drawing app handle the interaction if it's not on a button
    if (!isClickOnButton(event)) {
      if (drawingApp.handleMove) {
        drawingApp.handleMove(currentX, currentY, previousX, previousY, event);
      }
    }
  }

  p5.windowResized = () => {
    drawingApp.windowResized();
  };
}, document.querySelector('[data-element="canvas-container"]'));
