import {
  colorAlpha,
  clearActiveButtonState,
  hasActiveClass,
  addInteractionHandlers,
} from "../functions.js";
import { calcViewportDimensions, handleResize } from "../shared/resize.js";

/**
 * Creates a fully encapsulated Symmetryscape sketch
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {Object} An object with sketch lifecycle methods
 */
export function createSymmetryscape(p5) {
  const PALETTES = [
    ["#000000", "#444444", "#888888", "#a1a1a1", "#c2c2c2", "#ffffff"],
    ["#F2F2F2", "#F2913D", "#223240", "#F24B0F"],
    ["#6D808C", "#FFFFFF", "#D9AA8F", "#F2CAB3"],
    ["#3C5E73", "#F2BBBB", "#FFFFFF", "#F24444"],
  ];
  const SYMMETRY_MODES = 4;
  const BACKGROUND_IMAGE = "assets/paper.jpg";

  const state = {
    // Layers
    bg: null,
    drawLayer: null,
    symmetryAxisLayer: null,

    // Drawing configuration
    selectedPalette: 0,
    selectedBrush: 0,
    lastDrawingBrush: 0,

    // Symmetry tracking
    counter: -1,

    // Viewport and dimension tracking
    width: 0,
    height: 0,
    vMax: 0,
    longEdge: 0,
    shortEdge: 0,
    circleRad: 0,
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
    setSwatchColors();

    // Initialize state and render initial view
    state.counter = 0;
    state.selectedPalette = 0;
    initializeState();
    render();
  }

  function reset() {
    clearActiveButtonState();

    // Cycle through palettes and symmetry modes
    state.counter = (state.counter + 1) % SYMMETRY_MODES;
    state.selectedPalette = (state.selectedPalette + 1) % PALETTES.length;

    initializeState();
    setSwatchColors();
  }

  function initializeState() {
    state.drawLayer.clear();
    state.symmetryAxisLayer.clear();

    // Dynamic symmetry line arrangement, based on counter
    state.symmetryAxisLayer.strokeWeight(1);
    state.symmetryAxisLayer.stroke(210);

    const symmetryLines = [
      () => {
        state.symmetryAxisLayer.line(p5.width / 2, 0, p5.width / 2, p5.height);
        state.symmetryAxisLayer.line(0, p5.height / 2, p5.width, p5.height / 2);
      },
      () => {
        state.symmetryAxisLayer.line(0, p5.height / 2, p5.width, p5.height / 2);
      },
      () => {
        state.symmetryAxisLayer.line(0, 0, p5.width, p5.height);
        state.symmetryAxisLayer.line(p5.width, 0, 0, p5.height);
      },
    ];

    // Draw symmetry lines if a mode exists
    const currentSymmetryMode = symmetryLines[state.counter];
    if (currentSymmetryMode) currentSymmetryMode();

    // Reset brush
    changeBrush(1);
    render();
  }

  function handleMove(currentX, currentY, previousX, previousY, _event) {
    const symmetryModes = [
      () => {
        brushIt(currentX, currentY, previousX, previousY);
        brushIt(p5.width - currentX, currentY, p5.width - previousX, previousY);
      },
      () => {
        brushIt(currentX, currentY, previousX, previousY);
        brushIt(
          currentX,
          p5.height - currentY,
          previousX,
          p5.height - previousY
        );
      },
      () => {
        [
          [currentX, currentY],
          [p5.width - currentX, currentY],
          [currentX, p5.height - currentY],
          [p5.width - currentX, p5.height - currentY],
        ].forEach(([x, y]) => {
          brushIt(
            x,
            y,
            x === currentX ? previousX : p5.width - previousX,
            y === currentY
              ? previousY
              : y > currentY
              ? p5.height - previousY
              : previousY
          );
        });
      },
      () => {
        state.drawLayer.push();
        [0, 0.5, 1, 1.5].forEach((angle) => {
          state.drawLayer.translate(p5.width / 2, p5.height / 2);
          state.drawLayer.rotate(p5.PI * angle);
          state.drawLayer.translate(-p5.width / 2, -p5.height / 2);
          brushIt(currentX, currentY, previousX, previousY);
        });
        state.drawLayer.pop();
      },
    ];

    const currentSymmetryMode = symmetryModes[state.counter];
    if (currentSymmetryMode) currentSymmetryMode();
    render();
  }

  function brushIt(_x, _y, pX, pY) {
    if (state.selectedBrush === 0) {
      // Eraser mode
      state.drawLayer.erase();
      state.drawLayer.noStroke();
      state.drawLayer.ellipse(_x, _y, state.vMax * 4, state.vMax * 4);
      state.drawLayer.noErase();

      return;
    }

    const colorIndex = Math.min(
      state.selectedBrush - 1,
      PALETTES[state.selectedPalette].length - 1
    );
    const currentColor = PALETTES[state.selectedPalette][colorIndex];

    const brushStyles = [
      () => {
        // Thin line with dynamic weight
        // Changes line thickness based on movement speed/direction
        state.drawLayer.strokeWeight(
          p5.constrain(p5.abs(_y + _x - (pX + pY)), 3, 5)
        );
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.8));
        state.drawLayer.line(pX, pY, _x, _y);
      },
      () => {
        // Similar to first style, but with a broader stroke
        state.drawLayer.strokeWeight(
          p5.constrain(p5.abs(_y + _x - (pX + pY)), 14, 15)
        );
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.6));
        state.drawLayer.line(pX, pY, _x, _y);
      },
      () => {
        // Scattered line with Gaussian distribution
        // Creates a scattered, almost spray-paint like effect
        state.drawLayer.strokeWeight(
          p5.constrain(p5.abs(_y + _x - (pX + pY)), 8, 10)
        );
        state.drawLayer.stroke(colorAlpha(p5, currentColor, 0.5));

        // Draw multiple lines with random offsets
        for (let i = 0; i < 10; i++) {
          let randX = p5.randomGaussian(-6, 6);
          let randY = p5.randomGaussian(-6, 6);
          state.drawLayer.line(pX + randX, pY + randY, _x + randX, _y + randY);
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
            _x + p5.randomGaussian(-10, 10),
            _y + p5.randomGaussian(-10, 10)
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
        const brushNumber = parseInt(button.dataset.brush);
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

  function switchToDrawMode(e) {
    if (e) {
      e.stopPropagation();
    }
    clearActiveButtonState();

    const toolbar = document.querySelector('[data-element="toolbar"]');
    const drawButton = toolbar.querySelector(
      '[data-element="draw-mode-button"]'
    );

    if (state.selectedBrush === 0) {
      state.selectedBrush = state.lastDrawingBrush || 1; // Default to brush 1 if no last brush

      // Set active state on the restored brush button
      const brushButton = toolbar?.querySelector(
        `[data-brush="${state.selectedBrush}"]`
      );

      if (brushButton) {
        brushButton.classList.add("active");
      }
      if (hasActiveClass(drawButton)) {
        drawButton?.classList.remove("active");
      }
    }
  }

  function setSwatchColors() {
    const { selectedPalette } = state;
    const allBrushes = Array.from(document.querySelectorAll("[data-brush]"));
    const swatchButtons = allBrushes.slice(1); // remove the eraser (brush 0) from the selection
    const currentPaletteLength = PALETTES[selectedPalette].length;

    swatchButtons.forEach((swatch, index) => {
      if (index < currentPaletteLength) {
        swatch.style.backgroundColor = PALETTES[selectedPalette][index];
        swatch.classList.remove("u-hide"); // Show button if it's within palette length
      } else {
        swatch.classList.add("u-hide"); // Hide button if it's beyond palette length
      }
    });
  }

  function changeBrush(brushSel, event) {
    if (event) event.stopPropagation();

    state.selectedBrush = brushSel;
    if (state.selectedBrush !== 0) {
      state.lastDrawingBrush = state.selectedBrush;
    }

    clearActiveButtonState();

    const toolbar = document.querySelector('[data-element="toolbar"]');
    const selectedButton = toolbar?.querySelector(`[data-brush="${brushSel}"]`);
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
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
