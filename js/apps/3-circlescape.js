import { addInteractionHandlers } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";
import { clearActiveButtonState } from "../utils/dom.js";

export function createCirclescape(p5) {
  const MAX_VECTOR_COUNT = 100;
  const COLOR_PALETTES = [
    ["#345573", "#223240", "#F2913D", "#F24B0F"],
    ["#345573", "#F2913D", "#223240", "#F24B0F"],
    ["#172426", "#455559", "#D9C3B0", "#F2DFCE"],
    ["#F2BBBB", "#3C5E73", "#FFFFFF", "#F24444"],
    ["#6C2EF2", "#9726A6", "#8F49F2", "#F27ECA"],
    ["#BF4B8B", "#3981BF", "#1F628C", "#D92929"],
    ["#F24452", "#5CE3F2", "#F2E205", "#F2CB05"],
    ["#2d3157", "#34c1bb", "#badccc", "#ffda4d"],
    ["#CCCCCC", "#F2F2F2", "#B3B3B3", "#E6E6E6"],
    ["#F2F2F2", "#A6A6A6", "#737373", "#0D0D0D"],
  ];

  const state = {
    // Drawing layers
    drawLayer: null,

    // Drawing state
    selectedPalette: 0,
    colorIndex: 0,
    drawingMode: "big", // "big", "small", or "erase"
    drawMultiplier: 2,
    eraserMode: false,

    // Vector tracking
    vectorStore: [],
    axis: null,
    dragTracker: 0,
    poleArray: [],

    // Drawing mechanics
    position: { x: 100, y: 100 },
    dragLength: 3,
    angle: 0,

    // Dynamics
    smoothDistances: new Array(21).fill(0),
    velocity: 0,

    // Viewport dimensions
    vMax: 0,
    width: 0,
    height: 0,
    vW: 0,
    vH: 0,
  };

  function preload() {
    // Nothing to preload
  }

  async function setup() {
    setupToolbarActions();
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    p5.pixelDensity(1);
    state.drawLayer = p5.createGraphics(p5.width, p5.height);

    updateDimensions();
    resetVectorStore();
    initializeStartVectors();
    reset();
  }

  function reset() {
    clearActiveButtonState();

    // Cycle palette and reset drawing state
    state.selectedPalette = (state.selectedPalette + 1) % COLOR_PALETTES.length;
    state.colorIndex = 0;
    state.drawingMode = "big";
    state.drawMultiplier = 2;
    state.eraserMode = false;

    // Reset canvas
    state.drawLayer.clear();
    p5.blendMode(p5.BLEND);
    p5.background(COLOR_PALETTES[state.selectedPalette][0]);

    render();
  }

  function resetVectorStore() {
    state.vectorStore = Array(MAX_VECTOR_COUNT)
      .fill(null)
      .map(() => p5.createVector(0, 0));
  }

  function initializeStartVectors() {
    const v1 = p5.createVector(
      state.width / 2 + p5.random(-state.width / 4, state.width / 4),
      state.height / 2 + p5.random(-state.height / 4, state.height / 4)
    );

    const v2 = p5.createVector(
      state.width / 2 + p5.random(-state.width / 4, state.width / 4),
      state.height / 2 + p5.random(-state.height / 10, state.height / 10)
    );

    const distance = Math.floor(v1.dist(v2) / 2);

    state.poleArray = Array(distance)
      .fill(null)
      .map((_, i) => {
        let v = p5.createVector();
        return v.lerp(v1, v2, i / distance);
      });
  }

  function handlePointerStart(event) {
    state.dragTracker = 0;
    state.axis = p5.createVector(p5.mouseX, p5.mouseY);
    state.colorIndex = (state.colorIndex + 1) % 4;

    // Initialize vectors
    state.vectorStore = state.vectorStore.map(() =>
      p5.createVector(p5.mouseX, p5.mouseY)
    );

    return false;
  }

  function handleMove(currentX, currentY, previousX, previousY, event) {
    updateDynamics(currentX, currentY, previousX, previousY);

    if (!state.eraserMode) {
      drawBrushStroke(currentX, currentY, previousX, previousY);
    } else {
      eraseStroke(currentX, currentY, previousX, previousY);
    }

    render();
    return false;
  }

  function handlePointerEnd(event) {
    // Reset vectors
    state.vectorStore = state.vectorStore.map(() => null);
    return false;
  }

  function updateDynamics(currentX, currentY, previousX, previousY) {
    // Update smooth distance tracking
    const distance = p5.dist(currentX, currentY, previousX, previousY);
    state.smoothDistances.shift();
    state.smoothDistances.push(distance);
    state.velocity =
      state.smoothDistances.reduce((a, b) => a + b) /
      state.smoothDistances.length;

    // Update position and angle
    const dx = currentX - state.position.x;
    const dy = currentY - state.position.y;
    state.angle = p5.atan2(dy, dx);

    state.position.x = currentX - p5.cos(state.angle) * state.dragLength;
    state.position.y = currentY - p5.sin(state.angle) * state.dragLength;
  }

  function drawBrushStroke(x, y, px, py) {
    const palette = COLOR_PALETTES[state.selectedPalette];
    p5.strokeCap(p5.SQUARE);
    p5.blendMode(p5.DIFFERENCE);

    const brushConfig = {
      qtyOfLines: 24 * state.drawMultiplier,
      brushWidth: 20 + state.velocity * 2 * state.drawMultiplier,
      opacity: 10,
      noiseScale: 0.001,
    };

    const strokeW = p5.ceil(brushConfig.brushWidth / brushConfig.qtyOfLines);
    state.drawLayer.strokeWeight(strokeW);

    // Create brush width points
    const halfWidth = brushConfig.brushWidth / 2;
    const leftPoint = p5.createVector(
      x + halfWidth * p5.cos(state.angle - p5.PI / 2),
      y + halfWidth * p5.sin(state.angle - p5.PI / 2)
    );
    const rightPoint = p5.createVector(
      x + halfWidth * p5.cos(state.angle + p5.PI / 2),
      y + halfWidth * p5.sin(state.angle + p5.PI / 2)
    );

    // Draw lines
    for (let i = 0; i < brushConfig.qtyOfLines; i++) {
      const t = i / (brushConfig.qtyOfLines - 1 || 1);
      const currentPoint = p5.createVector(
        p5.lerp(leftPoint.x, rightPoint.x, t),
        p5.lerp(leftPoint.y, rightPoint.y, t)
      );

      if (state.vectorStore[i]) {
        state.drawLayer.stroke(palette[state.colorIndex]);
        state.drawLayer.line(
          state.vectorStore[i].x,
          state.vectorStore[i].y,
          currentPoint.x,
          currentPoint.y
        );
      }

      state.vectorStore[i] = currentPoint;
    }
  }

  function eraseStroke(currentX, currentY, previousX, previousY) {
    state.drawLayer.erase();
    state.drawLayer.noStroke();
    state.drawLayer.ellipse(currentX, currentY, state.vMax * 4, state.vMax * 4);
    state.drawLayer.noErase();
  }

  function render() {
    p5.clear();
    p5.background(COLOR_PALETTES[state.selectedPalette][0]);
    p5.image(state.drawLayer, 0, 0, p5.width, p5.height);
  }

  function updateDimensions() {
    const dimensions = calcViewportDimensions();
    state.width = dimensions.width;
    state.height = dimensions.height;
    state.vMax = dimensions.vMax;
    state.vW = state.width / 100;
    state.vH = state.height / 100;
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    const { resizedLayers } = handleResize(p5, [state.drawLayer]);

    [state.drawLayer] = resizedLayers;
    updateDimensions();

    p5.background(COLOR_PALETTES[state.selectedPalette][0]);
    render();
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const eraseButton = toolbar.querySelector('[data-element="erase-button"]');
    const drawSmallButton = toolbar.querySelector(
      '[data-element="draw-small-button"]'
    );
    const drawBigButton = toolbar.querySelector(
      '[data-element="draw-big-button"]'
    );

    if (!eraseButton | !drawSmallButton | !drawBigButton) {
      console.error("toolbar button not found");
    }

    addInteractionHandlers(eraseButton, (event) => {
      state.eraserMode = true;
      state.drawLayer.strokeCap(p5.ROUND);
      state.drawLayer.blendMode(p5.BLEND);
    });

    addInteractionHandlers(drawSmallButton, (event) => {
      state.eraserMode = false;
      state.drawMultiplier = 0.5;
      state.drawLayer.strokeCap(p5.SQUARE);
      state.drawLayer.blendMode(p5.DIFFERENCE);
      state.vectorStore = state.vectorStore.map(() => null);
    });

    addInteractionHandlers(drawBigButton, (event) => {
      state.eraserMode = false;
      state.drawMultiplier = 2;
      state.drawLayer.strokeCap(p5.SQUARE);
      state.drawLayer.blendMode(p5.DIFFERENCE);
      state.vectorStore = state.vectorStore.map(() => null);
    });
  }

  return {
    preload,
    setup,
    reset,
    render,
    handlePointerStart,
    handlePointerEnd,
    handleMove,
    windowResized,
  };
}
