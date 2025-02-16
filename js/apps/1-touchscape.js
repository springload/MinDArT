import { addInteractionHandlers } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";

/**
 * Creates an encapsulated Touchscape sketch that provides drawing functionality.
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => void,
 *   setup: () => Promise<void>,
 *   reset: () => void,
 *   render: () => void,
 *   handlePointerStart: () => boolean,
 *   handlePointerEnd: () => boolean,
 *   handleMove: (currentX: number, currentY: number) => boolean,
 *   windowResized: () => void
 * }} An object containing sketch lifecycle and interaction methods:
 *   - preload: Loads required image assets
 *   - setup: Initializes canvas, graphics layers, and UI handlers
 *   - reset: Clears canvas and adds new random pebbles
 *   - render: Renders all graphics layers with appropriate blend modes
 *   - handlePointerStart: Handles start of drawing interaction
 *   - handlePointerEnd: Handles end of drawing interaction
 *   - handleMove: Updates drawing position and renders strokes
 *   - windowResized: Handles canvas and layer resizing
 */
export function createTouchscape(p5) {
  const PEBBLE_COUNT = 7;

  const state = {
    // Interaction state
    isMousedown: false,
    eraseActive: 0,
    currentBrush: 0,

    // Drawing position
    x: 100,
    y: 100,
    angle: 0.0,
    dragLength: 30,

    // Brush properties
    qtyOfLines: 40,
    brushWidth: 200,
    strokeWidth: 200 / 40, // brushWidth / qtyOfLines
    opacity: 200,
    vectors: [], // Stores line positions

    // Viewport
    vMax: 0,

    // Assets
    pebbles: [],
    background: null,

    // Graphics layers
    foreground: null,
    pebbleLayer: null,

    // Pebble decoration state
    pebbleScalars: [],
    pebbleIds: [],
    pebbleX: [],
    pebbleY: [],
  };

  function preload() {
    // Updated asset paths
    state.background = p5.loadImage(
      `${import.meta.env.BASE_URL}images/1-touchscape_sand_01.webp`
    );

    // Load pebble assets with updated paths
    state.pebbles = new Array(PEBBLE_COUNT + 1);
    for (let i = 1; i <= PEBBLE_COUNT; i++) {
      state.pebbles[i] = p5.loadImage(
        `${import.meta.env.BASE_URL}images/1-touchscape_pebble${i}.webp`
      );
    }
  }

  async function setup() {
    setupToolbarActions();
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    initializeLayers();
    setupGraphics();

    // Initialize state
    updateBrushProperties();
    const dimensions = calcViewportDimensions();
    state.vMax = dimensions.vMax;

    changeBrush(0); // Start with eraser selected
    reset();
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) {
      console.error("No toolbar found");
      return;
    }

    const brushButtons = toolbar.querySelectorAll("[data-brush]");

    brushButtons.forEach((button) => {
      addInteractionHandlers(button, (event) => {
        const brushNumber = parseInt(button.getAttribute("data-brush"));
        changeBrush(brushNumber);
      });
    });
  }

  function initializeLayers() {
    state.foreground = p5.createGraphics(p5.width, p5.height);
    state.pebbleLayer = p5.createGraphics(p5.width, p5.height);

    // Set initial foreground properties
    state.foreground.strokeWeight(state.strokeWidth);
    state.foreground.noFill();
    state.foreground.stroke(20, 100);
  }

  function setupGraphics() {
    p5.colorMode(p5.HSB, 360, 100, 100, 1.0);
    p5.pixelDensity(1);
  }

  function updateBrushProperties(
    lines = state.qtyOfLines,
    width = state.brushWidth,
    opacity = state.opacity
  ) {
    state.qtyOfLines = lines;
    state.brushWidth = width;
    state.opacity = opacity;
    state.vectors = Array(lines)
      .fill()
      .map(() => []);
    state.strokeWidth = Math.ceil(width / lines);
    state.foreground.strokeWeight(state.strokeWidth);
  }

  function changeBrush(version) {
    state.currentBrush = version;

    switch (version) {
      case 0: // Eraser
        state.eraseActive = 1;
        updateBrushProperties(1, 200, 1);
        state.foreground.fill(127, 80);
        break;
      case 1: // Fine brush
        state.eraseActive = 0;
        updateBrushProperties(5, 60, 100);
        break;
      case 2: // Medium brush
        state.eraseActive = 0;
        updateBrushProperties(15, 100, 100);
        break;
      case 3: // Thick brush
        state.eraseActive = 0;
        updateBrushProperties(60, 150, 100);
        break;
    }
  }

  function makeArray() {
    const a = p5.createVector(state.x, state.y);
    const b = p5.createVector(0, state.brushWidth / 2);
    b.rotate(state.angle);
    const pVector = p5.Vector || (p5.constructor && p5.constructor.Vector);
    const c = pVector.add(a, b);
    a.sub(b);

    for (let i = 0; i < state.qtyOfLines; i++) {
      const d = pVector.lerp(
        a,
        c,
        i / (state.qtyOfLines + 1) + p5.random(0, (1 / state.qtyOfLines) * 0.2)
      );
      state.vectors[i].push(d);
    }
  }

  function render() {
    if (state.vectors[0].length > 1) {
      for (let i = 0; i < state.vectors.length; i++) {
        // Set line weight - thinner for first, last, and every third line
        state.foreground.strokeWeight(
          i === 0 || i === state.vectors.length - 1 || i % 3 === 2
            ? state.strokeWidth / 2
            : state.strokeWidth
        );

        // Set stroke color based on position
        if (i % 3 === 0) {
          state.foreground.stroke(40);
        } else if (i % 3 === 1) {
          state.foreground.stroke(200);
        } else {
          state.foreground.stroke(0);
        }

        const linePoints = state.vectors[i];
        if (state.eraseActive) {
          // For eraser, draw a large semi-transparent circle
          state.foreground.noStroke();
          state.foreground.fill(127, 80);
          state.foreground.ellipse(
            state.x,
            state.y,
            state.vMax * 4,
            state.vMax * 4
          );
        } else {
          // For drawing brushes, draw the line segments
          const current = linePoints[linePoints.length - 1];
          const previous = linePoints[linePoints.length - 2];
          if (current && previous) {
            state.foreground.line(current.x, current.y, previous.x, previous.y);
          }
        }
      }
    }

    // Render layers with blend modes
    p5.blendMode(p5.BLEND);
    p5.image(state.background, 0, 0, p5.width, p5.height);
    p5.blendMode(p5.OVERLAY);
    p5.image(state.foreground, 0, 0, p5.width, p5.height);
    p5.blendMode(p5.BLEND);
    p5.noTint();
    p5.image(state.pebbleLayer, 0, 0, p5.width, p5.height);
  }

  function handlePointerStart() {
    state.isMousedown = true;
    return false;
  }

  function handlePointerEnd() {
    state.isMousedown = false;
    state.vectors = Array(state.qtyOfLines)
      .fill()
      .map(() => []);
    return false;
  }

  function handleMove(currentX, currentY) {
    if (!state.isMousedown) return false;

    const dx = currentX - state.x;
    const dy = currentY - state.y;

    state.angle = p5.atan2(dy, dx);
    state.x = currentX - p5.cos(state.angle) * state.dragLength;
    state.y = currentY - p5.sin(state.angle) * state.dragLength;

    makeArray();
    render();
    return false;
  }

  function reset() {
    p5.blendMode(p5.REPLACE);
    p5.image(state.background, 0, 0, p5.width, p5.height);
    state.foreground.clear();
    state.pebbleLayer.clear();
    updateBrushProperties();

    // Add random pebbles
    const pebbleCount = p5.int(p5.random(0.7, 3));
    for (let k = 0; k < pebbleCount; k++) {
      state.pebbleScalars[k] = p5.int(p5.random(120, 180));
      state.pebbleIds[k] = p5.int(p5.random(1, PEBBLE_COUNT));
      state.pebbleX[k] = p5.int(
        p5.random(0, p5.width - state.pebbleScalars[k])
      );
      state.pebbleY[k] = p5.int(
        p5.random(0, p5.height - state.pebbleScalars[k])
      );

      state.pebbleLayer.image(
        state.pebbles[state.pebbleIds[k]],
        state.pebbleX[k],
        state.pebbleY[k],
        state.pebbleScalars[k],
        state.pebbleScalars[k]
      );
    }

    render();
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    const { dimensions, resizedLayers } = handleResize(p5, [
      state.foreground,
      state.pebbleLayer,
    ]);
    [state.foreground, state.pebbleLayer] = resizedLayers;
    state.vMax = dimensions.vMax;

    render();
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
