import {
  addInteractionHandlers,
  clearActiveButtonState,
  hexToRgb,
} from "../functions.js";
import { calcViewportDimensions, handleResize } from "../shared/resize.js";

export function createColourscape(p5) {
  const colourSwatch = [
    ["#F2A97E", "#F28D77", "#BF7E7E", "#7E708C", "#49538C"],
    ["#F2A74B", "#F2995E", "#D95F43", "#734663", "#2A1A40"],
    ["#F21905", "#A60303", "#027373", "#025159", "#025159"],
    ["#CFCFCF", "#88898C", "#565759", "#0D0D0D", "#00010D"],
    ["#91AA9D", "#D1DBBD", "#91AA9D", "#3E606F", "#193441"],
  ];

  const state = {
    // Assets
    bg: null,
    brush: [],

    // Layers
    paintLayer: null,
    traceLayer: null,

    // Drawing state
    bool: true,
    brushTemp: 0,
    eraseState: 0,
    eraserVersion: 0,
    colourBool: false,
    colourLevel: 0,

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
    state.bg = p5.loadImage("assets/paper.jpg");
    state.brush = Array.from({ length: 15 }, (_, i) =>
      p5.loadImage(`assets/4-colourscape_Cloud${i}.png`)
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
    state.colourLevel = 0;
    calcViewportDimensions();
    drawErase();
    state.segLength = p5.windowWidth / 40;
    setProperties(0, 0);

    backdrop();
    render();
  }

  function setLayerProperties() {
    p5.imageMode(p5.CENTER);
    p5.blendMode(p5.BLEND);
    state.traceLayer.blendMode(p5.LIGHTEST);
    p5.colorMode(p5.RGB, 255, 255, 255, 1);
    state.paintLayer.colorMode(p5.RGB, 255, 255, 255, 255);
    state.traceLayer.colorMode(p5.HSB, 360, 100, 100, 1);
    state.traceLayer.strokeWeight(8);
    state.traceLayer.stroke(255, 0, 255, 0.8);
  }

  function reset() {
    state.colourLevel = (state.colourLevel + 1) % 5;
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
    // Use the color selected in makeDrawing instead of hardcoded magenta
    state.paintLayer.tint(state.currentColour);
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
    if (state.bool) {
      if (state.milliCounter > state.milliTrack + MILLI_COMP) {
        // Select color based on warm/cool selection
        state.selectedNum = !state.colourBool
          ? Math.floor(p5.random(0, 2)) // Warm colors (first 2)
          : Math.floor(p5.random(3, 5)); // Cool colors (last 2)

        // Convert hex to RGB and store in state
        state.currentColour = hexToRgb(
          p5,
          colourSwatch[state.colourLevel][state.selectedNum]
        );

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
      state.traceLayer.line(_x, _y, pX, pY);
    }
  }

  function drawErase() {
    state.eraseState = 1;
    state.eraserVersion = false;
  }

  function eraseDrawing() {
    if (state.eraserVersion) {
      state.paintLayer.noStroke();
      state.paintLayer.strokeWeight(45);
      state.paintLayer.stroke(255, 255, 255, 125);
      state.paintLayer.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    } else {
      state.traceLayer.blendMode(p5.BLEND);
      state.traceLayer.strokeWeight(45);
      state.traceLayer.stroke(255, 0, 0, 0.4);
      state.traceLayer.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      state.traceLayer.blendMode(p5.LIGHTEST);
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
    p5.blendMode(p5.LIGHTEST);
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
    if (state.eraseState === 0) {
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

    const paintWarmButton = toolbar.querySelector(
      '[data-element="paint-warm-button"]'
    );
    const paintCoolButton = toolbar.querySelector(
      '[data-element="paint-cool-button"]'
    );
    const drawButton = toolbar.querySelector('[data-element="draw-button"]');
    const erasePaintButton = toolbar.querySelector(
      '[data-element="erase-paint-button"]'
    );
    const eraseDrawButton = toolbar.querySelector(
      '[data-element="erase-draw-button"]'
    );

    if (
      !paintWarmButton |
      !paintCoolButton |
      !drawButton |
      !erasePaintButton |
      !eraseDrawButton
    ) {
      console.error("toolbar button not found");
      return;
    }

    addInteractionHandlers(paintWarmButton, (event) => {
      state.eraseState = 0;
      state.eraserVersion = 0;
      state.colourBool = false;
      state.bool = true;
    });

    addInteractionHandlers(paintCoolButton, (event) => {
      state.eraseState = 0;
      state.eraserVersion = 0;
      state.colourBool = true;
      state.bool = true;
    });

    addInteractionHandlers(drawButton, (event) => {
      state.bool = false;
      state.eraseState = 0;
      state.eraserVersion = 0;
      state.traceLayer.strokeWeight(8);
      state.traceLayer.stroke(255, 0, 255, 0.8);
    });

    addInteractionHandlers(erasePaintButton, (event) => {
      state.eraseState = 1;
      state.eraserVersion = true;
    });

    addInteractionHandlers(eraseDrawButton, (event) => {
      state.eraseState = 1;
      state.eraserVersion = false;
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
