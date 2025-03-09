import p5 from "p5";

import "../components/loadingDialog.js";
import "../components/appControls.js";
import "../components/drawingToolbar.js";

import { isClickOnButton } from "../utils/events.js";
import { createTouchscape } from "../apps/1-touchscape.js";
import { createLinescape } from "../apps/2-linescape.js";
import { createCirclescape } from "../apps/3-circlescape.js";
import { createColourscape } from "../apps/4-colourscape.js";
import { createDotscape } from "../apps/5-dotscape.js";
import { createLinkscape } from "../apps/6-linkscape.js";
import { createRotationscape } from "../apps/7-rotationscape.js";
import { createSymmetryscape } from "../apps/8-symmetryscape.js";
import { loadSoundtrack, playSoundtrack, loadClick } from "../utils/audio.js";

// Initialize audio system when the SPA first loads
loadClick().catch(console.error);

// Factory for creating the appropriate drawing app based on app name
function createDrawingApp(p5, appName) {
  const creators = {
    touchscape: createTouchscape,
    linescape: createLinescape,
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

let p5Instance = null;

function getCurrentAppName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("app");
}

function initializeP5() {
  if (p5Instance) {
    p5Instance.remove();
  }

  p5Instance = new p5((p5) => {
    let drawingApp;
    let soundtrackLoaded = false;
    let prevTouchX = null;
    let prevTouchY = null;
    let isAppStarted = false;

    p5.preload = () => {
      const appName = getCurrentAppName();
      if (!appName) return;

      // Load soundtrack and app assets in parallel
      Promise.all([
        loadSoundtrack(appName).then(() => {
          soundtrackLoaded = true;
        }),
        (async () => {
          drawingApp = createDrawingApp(p5, appName);
          await drawingApp.preload();
        })(),
      ]).catch(console.error);
    };

    p5.setup = async () => {
      const appName = getCurrentAppName();
      if (!appName || !drawingApp) return;

      await drawingApp.setup();

      const loadingDialog = document.querySelector("loading-dialog");
      const appControls = document.querySelector("app-controls");

      if (!loadingDialog || !appControls) {
        throw new Error("Loading dialog or app controls were not found");
      }

      drawingApp.render();

      // Remove any existing app-start listeners to prevent duplicates
      const existingListener = loadingDialog._appStartListener;
      if (existingListener) {
        loadingDialog.removeEventListener("app-start", existingListener);
      }

      // Create and store new listener
      loadingDialog._appStartListener = async () => {
        isAppStarted = true;
        if (soundtrackLoaded) {
          try {
            await playSoundtrack();
          } catch (error) {
            console.warn("Failed to play soundtrack:", error);
          }
        }
      };

      loadingDialog.addEventListener(
        "app-start",
        loadingDialog._appStartListener
      );

      appControls.addEventListener("app-reset", () => {
        drawingApp.reset();
      });

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
      if (!isAppStarted) return false;
      return drawingApp.handlePointerStart?.(event) ?? false;
    };

    p5.mouseReleased = (event) => {
      if (!isAppStarted) return false;
      return drawingApp.handlePointerEnd?.(event) ?? false;
    };

    p5.mouseDragged = (event) => {
      if (!isAppStarted) return false;
      handlePointerMove(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY, event);
    };

    // Touch event handlers
    p5.touchStarted = (event) => {
      if (!isAppStarted) return false;
      prevTouchX = null;
      prevTouchY = null;
      return drawingApp.handlePointerStart?.(event) ?? false;
    };

    p5.touchEnded = (event) => {
      if (!isAppStarted) return false;
      return drawingApp.handlePointerEnd?.(event) ?? false;
    };

    p5.touchMoved = (event) => {
      if (!isAppStarted) return false;
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

    function handlePointerMove(
      currentX,
      currentY,
      previousX,
      previousY,
      event
    ) {
      if (!isAppStarted) return false;
      // Let the drawing app handle the interaction if it's not on a button
      if (!isClickOnButton(event)) {
        if (drawingApp.handleMove) {
          drawingApp.handleMove(
            currentX,
            currentY,
            previousX,
            previousY,
            event
          );
        }
      }
    }

    p5.windowResized = () => {
      if (!isAppStarted) return false;
      drawingApp.windowResized();
    };
  }, document.querySelector('[data-element="canvas-container"]'));
}

window.initializeP5 = initializeP5;

if (getCurrentAppName()) {
  initializeP5();
}
