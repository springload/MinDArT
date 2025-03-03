import { addInteractionHandlers } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";
import { clearActiveButtonState } from "../utils/dom.js";
import { hexToRgb } from "../utils/color.js";

/**
 * Creates a fully encapsulated Colourscape sketch
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => Promise<void>,
 *   setup: () => Promise<void>,
 *   reset: () => void,
 *   render: () => void,
 *   handlePointerStart: () => boolean,
 *   handleMove: (
 *     currentX: number,
 *     currentY: number,
 *     previousX: number,
 *     previousY: number
 *   ) => void,
 *   windowResized: () => void
 * }} An object containing sketch lifecycle and interaction methods
 */
export function createColourscape(p5) {
  // Note: 5 colors per palette were specified in the original code but `light3` was never used, so I have left it unused
  const colorPalettes = [
    {
      light1: "#F2A97E",
      light2: "#F28D77",
      light3: "#BF7E7E",
      dark1: "#7E708C",
      dark2: "#49538C",
    },
    {
      light1: "#F2A74B",
      light2: "#F2995E",
      light3: "#D95F43",
      dark1: "#734663",
      dark2: "#2A1A40",
    },
    {
      light1: "#F21905",
      light2: "#A60303",
      light3: "#027373",
      dark1: "#025159",
      dark2: "#025159",
    },
    {
      light1: "#CFCFCF",
      light2: "#88898C",
      light3: "#565759",
      dark1: "#0D0D0D",
      dark2: "#00010D",
    },
    {
      light1: "#91AA9D",
      light2: "#D1DBBD",
      light3: "#91AA9D",
      dark1: "#3E606F",
      dark2: "#193441",
    },
  ];

  const PENCIL_COLOR = [150, 150, 150, 0.9];
  const ERASER_COLOR = [255, 255, 255, 0.5];

  const state = {
    // Assets
    bg: null,
    brush: [],

    // Layers
    paintLayer: null,
    traceLayer: null,

    // Drawing state
    isPaintMode: true,
    brushTemp: 0,
    isEraserActive: false,
    eraserVersion: "draw", // "draw" or "paint"
    isDarkPalette: false,
    paletteIndex: 0,
    currentColor: null,

    // Brush mechanics
    angle1: 0,
    segLength: 0,
    scalar: 30,
    tempwinMouseX: 0,
    tempwinMouseY: 0,
    tempX: 100,
    tempY: 100,
    dx: 0,
    dy: 0,

    // Time tracking
    milliCounter: 0,
    milliTrack: 0,
  };

  const ROTATE_DRIFT = 0.6;
  const SCATTER_AMOUNT = 2;
  const MILLI_COMP = 5;

  function preload() {
    state.bg = p5.loadImage(
      `${import.meta.env.BASE_URL}images/4-colourscape_paper.webp`
    );
    state.brush = Array.from({ length: 15 }, (_, i) =>
      p5.loadImage(
        `${import.meta.env.BASE_URL}images/4-colourscape_Cloud${i}.webp`
      )
    );
  }

  async function setup() {
    setupToolbarActions();

    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    // Create and initialize layers
    state.paintLayer = p5.createGraphics(p5.width, p5.height);
    state.traceLayer = p5.createGraphics(p5.width, p5.height);

    p5.pixelDensity(1);
    setLayerProperties();

    // Initialize state and render initial view
    state.paletteIndex = 0;
    calcViewportDimensions();
    drawErase();
    state.segLength = p5.windowWidth / 40;
    setProperties(0, 0);

    // Set initial CSS custom properties for the toolbar
    updateToolbarColors(state.paletteIndex);

    backdrop();
    render();
  }

  /**
   * Updates the CSS custom properties on the toolbar element based on the current palette
   * @param {number} paletteIndex - The index of the current color palette
   */
  function updateToolbarColors(paletteIndex) {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const palette = colorPalettes[paletteIndex];

    // Update CSS custom properties with current palette colors
    toolbar.style.setProperty("--color-light-1", palette.light1);
    toolbar.style.setProperty("--color-light-2", palette.light2);
    toolbar.style.setProperty("--color-light-3", palette.light3);
    toolbar.style.setProperty("--color-dark-1", palette.dark1);
    toolbar.style.setProperty("--color-dark-2", palette.dark2);
  }

  function setLayerProperties() {
    p5.imageMode(p5.CENTER);
    p5.blendMode(p5.BLEND);
    state.traceLayer.blendMode(p5.BLEND);

    p5.colorMode(p5.RGB, 255, 255, 255, 1);
    state.paintLayer.colorMode(p5.RGB, 255, 255, 255, 1);
    state.traceLayer.colorMode(p5.RGB, 255, 255, 255, 1);

    state.traceLayer.strokeWeight(8);
    state.traceLayer.stroke(...PENCIL_COLOR);
  }

  function reset() {
    state.paletteIndex = (state.paletteIndex + 1) % colorPalettes.length;

    // Update the toolbar colors with the new palette
    updateToolbarColors(state.paletteIndex);

    calcViewportDimensions();
    drawErase();
    clearActiveButtonState();

    backdrop();
    state.segLength = p5.windowWidth / 40;
    setProperties(0, 0);
    state.paintLayer.clear();
    state.traceLayer.clear();
    render();
  }

  function segment(rakeX, rakeY, a, rake, scalar) {
    const [r, g, b] = state.currentColor.levels;
    state.paintLayer.tint(r, g, b, 127);
    state.paintLayer.push();
    state.paintLayer.imageMode(p5.CENTER);
    state.paintLayer.translate(
      rakeX +
        p5.randomGaussian(
          -SCATTER_AMOUNT * (0.1 * scalar),
          SCATTER_AMOUNT * (0.1 * scalar)
        ),
      rakeY +
        p5.randomGaussian(
          -SCATTER_AMOUNT * (0.1 * scalar),
          SCATTER_AMOUNT * (0.1 * scalar)
        )
    );
    state.paintLayer.scale(scalar);
    state.paintLayer.rotate(a);
    state.paintLayer.image(rake, 0, 0, 200, 200);
    state.paintLayer.imageMode(p5.CORNER);
    state.paintLayer.pop();
  }

  function makeDrawing(_x, _y, pX, pY) {
    state.milliCounter = p5.millis();
    if (state.isPaintMode) {
      if (state.milliCounter > state.milliTrack + MILLI_COMP) {
        const currentPalette = colorPalettes[state.paletteIndex];

        let selectedColorKey;

        if (!state.isDarkPalette) {
          const lightColorKeys = ["light1", "light2"]; // excluding `light3` which was not used in the original code
          selectedColorKey =
            lightColorKeys[Math.floor(p5.random(0, lightColorKeys.length))];
        } else {
          const darkColorKeys = ["dark1", "dark2"];
          selectedColorKey =
            darkColorKeys[Math.floor(p5.random(0, darkColorKeys.length))];
        }

        // Convert hex to RGB and store in state
        state.currentColor = hexToRgb(p5, currentPalette[selectedColorKey]);

        state.dx = _x - state.tempX;
        state.dy = _y - state.tempY;
        state.angle1 =
          p5.atan2(state.dy, state.dx) + p5.random(-ROTATE_DRIFT, ROTATE_DRIFT);
        state.tempX = _x - (p5.cos(state.angle1) * state.segLength) / 2;
        state.tempY = _y - (p5.sin(state.angle1) * state.segLength) / 2;
        state.scalar = p5.constrain(
          70 * (p5.random(3, Math.abs(_x - pX)) / p5.windowWidth),
          0.2,
          1.2
        );

        segment(
          state.tempX,
          state.tempY,
          state.angle1,
          state.brush[state.brushTemp],
          state.scalar
        );

        state.milliTrack = state.milliCounter;
      }
    } else {
      state.traceLayer.blendMode(p5.BLEND);
      state.traceLayer.strokeWeight(8);
      state.traceLayer.stroke(...PENCIL_COLOR);
      state.traceLayer.line(_x, _y, pX, pY);
    }
  }

  function drawErase() {
    state.isEraserActive = true;
    state.eraserVersion = "draw";
  }

  function eraseDrawing() {
    if (state.eraserVersion === "paint") {
      state.paintLayer.noStroke();
      state.paintLayer.strokeWeight(45);
      state.paintLayer.stroke(...ERASER_COLOR);
      state.paintLayer.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    } else {
      state.traceLayer.push();
      state.traceLayer.blendMode(p5.OVERLAY);
      state.traceLayer.strokeWeight(45);
      state.traceLayer.stroke(...ERASER_COLOR);
      state.traceLayer.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      state.traceLayer.pop();
    }
  }

  function setProperties(_x, _y) {
    state.tempwinMouseX = p5.windowWidth / 2 - _x;
    state.tempwinMouseY = p5.windowHeight / 2 - _y;
    state.brushTemp = Math.floor(p5.random(0, state.brush.length - 1));
  }

  function render() {
    p5.blendMode(p5.BLEND);
    backdrop();

    p5.blendMode(p5.DARKEST);
    p5.image(state.paintLayer, p5.width / 2, p5.height / 2);

    p5.blendMode(p5.MULTIPLY);
    p5.image(state.traceLayer, p5.width / 2, p5.height / 2);
  }

  function backdrop() {
    p5.background(255);
    p5.noTint();
    p5.image(
      state.bg,
      p5.windowWidth / 2,
      p5.windowHeight / 2,
      p5.windowWidth,
      p5.windowHeight
    );
  }

  // Event Handlers
  function handlePointerStart() {
    setProperties(p5.winMouseX, p5.winMouseY);
    return false;
  }

  function handleMove(currentX, currentY, previousX, previousY) {
    if (!state.isEraserActive) {
      makeDrawing(currentX, currentY, previousX, previousY);
    } else {
      eraseDrawing();
    }
    render();
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    const { resizedLayers } = handleResize(p5, [
      state.paintLayer,
      state.traceLayer,
    ]);
    [state.paintLayer, state.traceLayer] = resizedLayers;
    setLayerProperties();
    render();
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const paintLightButton = toolbar.querySelector(
      '[data-element="paint-light-button"]'
    );
    const paintDarkButton = toolbar.querySelector(
      '[data-element="paint-dark-button"]'
    );
    const drawButton = toolbar.querySelector('[data-element="draw-button"]');
    const erasePaintButton = toolbar.querySelector(
      '[data-element="erase-paint-button"]'
    );
    const eraseDrawButton = toolbar.querySelector(
      '[data-element="erase-draw-button"]'
    );

    if (
      !paintLightButton |
      !paintDarkButton |
      !drawButton |
      !erasePaintButton |
      !eraseDrawButton
    ) {
      console.error("toolbar button not found");
      return;
    }

    addInteractionHandlers(paintLightButton, (event) => {
      state.isEraserActive = false;
      state.isDarkPalette = false;
      state.isPaintMode = true;
    });

    addInteractionHandlers(paintDarkButton, (event) => {
      state.isEraserActive = false;
      state.isDarkPalette = true;
      state.isPaintMode = true;
    });

    addInteractionHandlers(drawButton, (event) => {
      state.isPaintMode = false;
      state.isEraserActive = false;
      state.traceLayer.strokeWeight(8);
      state.traceLayer.stroke(...PENCIL_COLOR);
    });

    addInteractionHandlers(erasePaintButton, (event) => {
      state.isEraserActive = true;
      state.eraserVersion = "paint";
    });

    addInteractionHandlers(eraseDrawButton, (event) => {
      state.isEraserActive = true;
      state.eraserVersion = "draw";
    });
  }

  return {
    preload,
    setup,
    reset,
    render,
    handlePointerStart,
    handleMove,
    windowResized,
  };
}
