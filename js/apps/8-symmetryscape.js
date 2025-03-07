import { addInteractionHandlers } from "../utils/events.js";
import { colorAlpha } from "../utils/color.js";
import { clearActiveButtonState } from "../utils/dom.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";

export const SymmetryMode = {
  VERTICAL: "VERTICAL",
  HORIZONTAL: "HORIZONTAL",
  QUADRANT: "QUADRANT",
  DIAGONAL: "DIAGONAL",
};

const SYMMETRY_MODES = [
  SymmetryMode.VERTICAL,
  SymmetryMode.HORIZONTAL,
  SymmetryMode.QUADRANT,
  SymmetryMode.DIAGONAL,
];

/**
 * Creates a fully encapsulated Symmetryscape sketch.
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => Promise<void>,
 *   setup: () => Promise<void>,
 *   reset: () => void,
 *   handleMove: (
 *     currentX: number,
 *     currentY: number,
 *     previousX: number,
 *     previousY: number,
 *     event?: Event
 *   ) => void,
 *   render: () => void,
 *   windowResized: () => void,
 *   changeBrush: (brushNumber: number, event?: Event) => void
 * }} An object containing sketch lifecycle and interaction methods:
 *   - preload: Loads background paper texture
 *   - setup: Initializes canvas, graphics layers, and initial state
 *   - reset: Cycles symmetry mode and color palette
 *   - handleMove: Updates brush strokes with symmetrical mirroring
 *   - render: Renders background, drawing layer and symmetry guides
 *   - windowResized: Handles canvas and layer resizing
 *   - changeBrush: Changes active brush type and color
 */
export function createSymmetryscape(p5) {
  const PALETTE = [
    "#000000",
    "#444444",
    "#888888",
    "#a1a1a1",
    "#c2c2c2",
    "#ffffff",
  ];

  const BACKGROUND_IMAGE = `${
    import.meta.env.BASE_URL
  }images/8-symmetryscape_paper.webp`;

  const state = {
    // Layers
    bg: null,
    drawLayer: null,
    symmetryAxisLayer: null,

    // Drawing configuration
    selectedBrush: 0,
    lastDrawingBrush: 0,

    // Symmetry tracking
    currentSymmetryMode: null,
    symmetryModeIndex: 0,

    // Viewport and dimension tracking
    width: 0,
    height: 0,
    vMax: 0,
    longEdge: 0,
    shortEdge: 0,
  };

  // Lifecycle methods
  function preload() {
    state.bg = p5.loadImage(BACKGROUND_IMAGE);
  }

  async function setup() {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    p5.pixelDensity(1);

    // Create and initialize graphics layers
    state.drawLayer = p5.createGraphics(p5.width, p5.height);
    state.drawLayer.colorMode(p5.RGB, 255, 255, 255, 1000);
    state.drawLayer.strokeCap(p5.PROJECT);

    state.symmetryAxisLayer = p5.createGraphics(p5.width, p5.height);
    state.vMax = calcViewportDimensions().vMax;

    setupToolbarActions();
    updateSwatchColors();

    // Initialize state and render initial view
    state.symmetryModeIndex = 0;
    state.currentSymmetryMode = SYMMETRY_MODES[state.symmetryModeIndex];
    resetState();
    render();
  }

  function reset() {
    clearActiveButtonState();

    // Cycle through symmetry modes
    state.symmetryModeIndex =
      (state.symmetryModeIndex + 1) % SYMMETRY_MODES.length;
    state.currentSymmetryMode = SYMMETRY_MODES[state.symmetryModeIndex];

    resetState();
  }

  function resetState() {
    state.drawLayer.clear();
    state.symmetryAxisLayer.clear();

    // Dynamic symmetry line arrangement, based on current symmetry mode
    state.symmetryAxisLayer.strokeWeight(1);
    state.symmetryAxisLayer.stroke(210);

    const symmetryLines = {
      [SymmetryMode.VERTICAL]: () => {
        // Vertical line only
        state.symmetryAxisLayer.line(p5.width / 2, 0, p5.width / 2, p5.height);
      },
      [SymmetryMode.HORIZONTAL]: () => {
        // Horizontal line only
        state.symmetryAxisLayer.line(0, p5.height / 2, p5.width, p5.height / 2);
      },
      [SymmetryMode.QUADRANT]: () => {
        // Both vertical and horizontal lines
        state.symmetryAxisLayer.line(p5.width / 2, 0, p5.width / 2, p5.height);
        state.symmetryAxisLayer.line(0, p5.height / 2, p5.width, p5.height / 2);
      },
      [SymmetryMode.DIAGONAL]: () => {
        // Diagonal X symmetry with fixed 45° angles through center
        const centerX = p5.width / 2;
        const centerY = p5.height / 2;
        const halfShortEdge = Math.min(centerX, centerY);

        // First diagonal (\) from top-left to bottom-right
        state.symmetryAxisLayer.line(
          centerX - halfShortEdge,
          centerY - halfShortEdge,
          centerX + halfShortEdge,
          centerY + halfShortEdge
        );

        // Second diagonal (/) from top-right to bottom-left
        state.symmetryAxisLayer.line(
          centerX + halfShortEdge,
          centerY - halfShortEdge,
          centerX - halfShortEdge,
          centerY + halfShortEdge
        );
      },
    };

    const drawSymmetryLines = symmetryLines[state.currentSymmetryMode];
    if (drawSymmetryLines) drawSymmetryLines();

    changeBrush(0);
    clearActiveButtonState();
    render();
  }

  function handleMove(currentX, currentY, previousX, previousY, _event) {
    const symmetryModes = {
      [SymmetryMode.VERTICAL]: () => {
        // Vertical symmetry (left and right sides)
        applyBrushStroke(currentX, currentY, previousX, previousY);
        applyBrushStroke(
          p5.width - currentX,
          currentY,
          p5.width - previousX,
          previousY
        );
      },
      [SymmetryMode.HORIZONTAL]: () => {
        // Horizontal symmetry (top and bottom)
        applyBrushStroke(currentX, currentY, previousX, previousY);
        applyBrushStroke(
          currentX,
          p5.height - currentY,
          previousX,
          p5.height - previousY
        );
      },
      [SymmetryMode.QUADRANT]: () => {
        // Both vertical and horizontal (quadrant symmetry)
        // Original point
        applyBrushStroke(currentX, currentY, previousX, previousY);

        // Reflect across vertical axis
        applyBrushStroke(
          p5.width - currentX,
          currentY,
          p5.width - previousX,
          previousY
        );

        // Reflect across horizontal axis
        applyBrushStroke(
          currentX,
          p5.height - currentY,
          previousX,
          p5.height - previousY
        );

        // Reflect across both axes
        applyBrushStroke(
          p5.width - currentX,
          p5.height - currentY,
          p5.width - previousX,
          p5.height - previousY
        );
      },
      [SymmetryMode.DIAGONAL]: () => {
        // Diagonal X symmetry
        const centerX = p5.width / 2;
        const centerY = p5.height / 2;

        // Calculate relative positions from center
        const relCurrentX = currentX - centerX;
        const relCurrentY = currentY - centerY;
        const relPrevX = previousX - centerX;
        const relPrevY = previousY - centerY;

        // Original point
        applyBrushStroke(currentX, currentY, previousX, previousY);

        // Reflect across \ diagonal (swap x and y coordinates)
        applyBrushStroke(
          centerX + relCurrentY,
          centerY + relCurrentX,
          centerX + relPrevY,
          centerY + relPrevX
        );

        // Reflect across / diagonal (negate and swap coordinates)
        applyBrushStroke(
          centerX - relCurrentY,
          centerY - relCurrentX,
          centerX - relPrevY,
          centerY - relPrevX
        );

        // Reflect across both diagonals (negate both coordinates)
        applyBrushStroke(
          centerX - relCurrentX,
          centerY - relCurrentY,
          centerX - relPrevX,
          centerY - relPrevY
        );
      },
    };

    const applySymmetry = symmetryModes[state.currentSymmetryMode];
    if (applySymmetry) applySymmetry();
    render();
  }

  function applyBrushStroke(currentX, currentY, previousX, previousY) {
    if (state.selectedBrush === 0) {
      // Eraser mode
      state.drawLayer.erase();
      state.drawLayer.noStroke();
      state.drawLayer.ellipse(
        currentX,
        currentY,
        state.vMax * 4,
        state.vMax * 4
      );
      state.drawLayer.noErase();

      return;
    }

    const colorIndex = Math.min(state.selectedBrush - 1, PALETTE.length - 1);
    const currentColor = PALETTE[colorIndex];

    const brushStyles = [
      () => {
        // Thin line with dynamic weight
        // Changes line thickness based on movement speed/direction
        state.drawLayer.strokeWeight(
          p5.constrain(
            p5.abs(currentY + currentX - (previousX + previousY)),
            3,
            5
          )
        );
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.8));
        state.drawLayer.line(previousX, previousY, currentX, currentY);
      },
      () => {
        // Similar to first style, but with a broader stroke
        state.drawLayer.strokeWeight(
          p5.constrain(
            p5.abs(currentY + currentX - (previousX + previousY)),
            14,
            15
          )
        );
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.6));
        state.drawLayer.line(previousX, previousY, currentX, currentY);
      },
      () => {
        // Scattered line with Gaussian distribution
        // Creates a scattered, almost spray-paint like effect
        state.drawLayer.strokeWeight(
          p5.constrain(
            p5.abs(currentY + currentX - (previousX + previousY)),
            8,
            10
          )
        );
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.5));

        // Draw multiple lines with random offsets
        for (let i = 0; i < 10; i++) {
          let randX = p5.randomGaussian(-6, 6);
          let randY = p5.randomGaussian(-6, 6);
          state.drawLayer.line(
            previousX + randX,
            previousY + randY,
            currentX + randX,
            currentY + randY
          );
        }
      },
      () => {
        // Dense point scatter
        // Creates a stippling or pointillist effect
        state.drawLayer.strokeWeight(4);
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.4));

        // Draw 60 random points around the current drawing point
        for (let i = 0; i < 60; i++) {
          state.drawLayer.point(
            currentX + p5.randomGaussian(-10, 10),
            currentY + p5.randomGaussian(-10, 10)
          );
        }
      },
    ];

    const currentBrushStyle =
      brushStyles[Math.min(state.selectedBrush - 1, brushStyles.length - 1)];
    if (currentBrushStyle) currentBrushStyle();
  }

  function render() {
    p5.clear();
    p5.image(state.bg, 0, 0, p5.width, p5.height);
    p5.image(state.drawLayer, 0, 0, p5.width, p5.height);
    p5.image(state.symmetryAxisLayer, 0, 0, p5.width, p5.height);
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    const { resizedLayers } = handleResize(p5, [
      state.bg,
      state.drawLayer,
      state.symmetryAxisLayer,
    ]);
    state.vMax = calcViewportDimensions().vMax;

    [state.bg, state.drawLayer, state.symmetryAxisLayer] = resizedLayers;
    state.drawLayer.strokeCap(p5.PROJECT);
    render();
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const brushButtons = toolbar.querySelectorAll("[data-brush]");
    brushButtons.forEach((button) => {
      addInteractionHandlers(button, (event) => {
        const button = event.currentTarget;
        const brushNumber = parseInt(button.getAttribute("data-brush"));
        changeBrush(brushNumber, event);
      });
    });

    const drawModeButton = toolbar.querySelector(
      '[data-element="draw-mode-button"]'
    );
    if (drawModeButton) {
      addInteractionHandlers(drawModeButton, (event) => {
        switchToDrawMode(event);
      });
    }
  }

  function updateActiveBrushUI() {
    clearActiveButtonState();

    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (toolbar) {
      const currentBrushButton = toolbar.querySelector(
        `[data-brush="${state.selectedBrush}"]`
      );

      if (currentBrushButton) {
        currentBrushButton.classList.add("active");
      }
    }
  }

  function switchToDrawMode(e) {
    if (e) {
      e.stopPropagation();
    }

    // We only want to make changes if we're coming from eraser mode
    if (state.selectedBrush !== 0) return;

    // Restore the last drawing brush or default to brush 1
    state.selectedBrush = state.lastDrawingBrush || 1;

    // Update the UI to reflect the current brush
    updateActiveBrushUI();
  }

  function updateSwatchColors() {
    const allBrushes = Array.from(document.querySelectorAll("[data-brush]"));
    const swatchButtons = allBrushes.slice(1); // remove the eraser (brush 0) from the selection

    swatchButtons.forEach((swatch, index) => {
      if (index < PALETTE.length) {
        swatch.style.backgroundColor = PALETTE[index];
        swatch.classList.remove("u-hide"); // Show button if it's within palette length
      } else {
        swatch.classList.add("u-hide"); // Hide button if it's beyond palette length
      }
    });
  }

  function changeBrush(brushIndex, event) {
    if (event) event.stopPropagation();

    state.selectedBrush = brushIndex;

    // If this is a drawing brush (not eraser), remember it
    if (brushIndex !== 0) {
      state.lastDrawingBrush = brushIndex;
    }

    // Update the UI to reflect the current brush
    updateActiveBrushUI();
  }

  return {
    preload,
    setup,
    reset,
    handleMove,
    render,
    windowResized,
    changeBrush,
  };
}
