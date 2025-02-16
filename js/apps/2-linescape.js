import { addInteractionHandlers } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";
import { clearActiveButtonState } from "../utils/dom.js";
import { hexToRgb } from "../utils/color.js";

/**
 * Creates a fully encapsulated Linescape sketch
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => void,
 *   setup: () => Promise<void>,
 *   reset: () => void,
 *   render: () => void,
 *   handleMove: (currentX: number, currentY: number, previousX: number, previousY: number) => void,
 *   windowResized: () => void
 * }} An object containing sketch lifecycle and interaction methods:
 *   - preload: No-op function as sketch has no assets to preload
 *   - setup: Initializes canvas, grid system, and UI handlers
 *   - reset: Adjusts grid density and changes color palette
 *   - render: Renders the current state of the line grid
 *   - handleMove: Updates grid points based on pointer movement
 *   - windowResized: Handles canvas resizing and point grid transformation
 */
export function createLinescape(p5) {
  const COLOURS = [
    ["#F2B705", "#701036"],
    ["#0D0D0D", "#0D0D0D"],
    ["#F2B077", "#023E73"],
    ["#D94929", "#590902"],
    ["#F2B705", "#02735E"],
    ["#F2B705", "#011F26"],
    ["#F2B705", "#A6600A"],
    ["#F2B705", "#1450A4"],
    ["#F2B705", "#363432"],
  ];

  const state = {
    // Drawing configuration
    colorPairIndex: 0,
    currentRgbColor: null,
    currentSwatch: 0,
    brushSizeBaseline: 60,

    // Grid state
    xCount: 0,
    yCount: 0,
    counter: 0,
    store: [],
    pointGrid: [],
    lineColors: [],

    // Viewport dimensions
    vMax: 0,
    vW: 0,
    vH: 0,

    // Motion tracking
    smoothDist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    velocity: 0,
  };

  function preload() {
    // No assets to preload
  }

  async function setup() {
    // Create canvas
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    p5.pixelDensity(1);
    updateSwatchColors();
    setupToolbarActions();

    // Initialize dimensions
    const dimensions = calcViewportDimensions();
    state.vMax = dimensions.vMax;
    state.vW = p5.width / 100;
    state.vH = p5.height / 100;

    setupDefaults();
    setupArrays();
  }

  function setupDefaults() {
    p5.strokeWeight(2);
    state.yCount = 35;
    state.xCount = 35;
    state.counter = 0;
    p5.stroke(255, 50);
    state.brushSizeBaseline = 100;
  }

  function setupArrays() {
    state.pointGrid = [];
    state.lineColors = [];

    // Initialize color array
    for (let j = 0; j < state.yCount; j++) {
      state.currentRgbColor = hexToRgb(
        p5,
        COLOURS[state.colorPairIndex][1],
        0.5
      );
      state.lineColors[j] = [
        state.currentRgbColor.levels[0],
        state.currentRgbColor.levels[1],
        state.currentRgbColor.levels[2],
      ];
    }

    // Initialize position array
    for (let i = 0; i < state.xCount; i++) {
      state.pointGrid[i] = [];
      for (let j = 0; j < state.yCount; j++) {
        let _x = (p5.width / state.xCount) * i;
        _x = p5.map(_x, 0, p5.width, state.vW * -20, p5.width + state.vW * 20);
        let _y = (p5.height / state.yCount) * j;
        _y = p5.map(p5.pow(_y, 2), 0, p5.pow(p5.height, 2), 0, p5.height);
        _y = p5.map(
          _y,
          0,
          p5.height,
          state.vH * -20,
          p5.height + state.vH * 20
        );
        state.pointGrid[i][j] = p5.createVector(_x, _y);
      }
    }
    render();
  }

  function render() {
    p5.background(255);
    for (let y = 0; y < state.yCount; y++) {
      p5.strokeWeight((1 / state.yCount) * y * 4.5);
      p5.stroke(
        state.lineColors[y][0],
        state.lineColors[y][1],
        state.lineColors[y][2],
        90
      );
      p5.fill(
        state.lineColors[y][0],
        state.lineColors[y][1],
        state.lineColors[y][2],
        100
      );
      p5.beginShape();

      for (let x = 0; x < state.xCount; x++) {
        p5.curveVertex(state.pointGrid[x][y].x, state.pointGrid[x][y].y);
      }

      p5.endShape();
    }
  }

  function handleMove(currentX, currentY, previousX, previousY) {
    state.store = [];
    // Calculate all points within distance and sort
    for (let x = 0; x < state.xCount; x++) {
      for (let y = 0; y < state.yCount; y++) {
        let d = p5.dist(
          currentX,
          currentY,
          state.pointGrid[x][y].x,
          state.pointGrid[x][y].y
        );
        if (d < state.brushSizeBaseline) {
          state.store.push([d, x, y]);
        }
      }
    }

    state.store.sort((a, b) => b[0] - a[0]);

    for (let i = 0; i < state.store.length; i++) {
      let _d = state.store[i][0];
      let _x = state.store[i][1];
      let _y = state.store[i][2];
      let temp = p5.createVector(currentX, currentY);
      _d = _d / (state.vMax * 0.2);
      // In instance mode, we need to access Vector through the instance
      const pVector = p5.Vector || (p5.constructor && p5.constructor.Vector);
      state.pointGrid[_x][_y] = pVector.lerp(
        state.pointGrid[_x][_y],
        temp,
        1 / _d
      );
    }

    // Apply color if points were affected
    if (state.store.length > 0) {
      state.currentRgbColor = hexToRgb(
        p5,
        COLOURS[state.colorPairIndex][state.currentSwatch]
      );
      state.lineColors[state.store[state.store.length - 1][2]] = [
        state.currentRgbColor.levels[0],
        state.currentRgbColor.levels[1],
        state.currentRgbColor.levels[2],
      ];
    }

    render();
  }

  function reset() {
    clearActiveButtonState();
    state.yCount = p5.int(state.yCount * 1.3);
    state.xCount = p5.int(state.xCount * 0.95);
    state.brushSizeBaseline *= 0.95;
    state.counter++;

    if (state.counter > 7) {
      setupDefaults();
    }

    state.colorPairIndex = (state.colorPairIndex + 1) % COLOURS.length;
    updateSwatchColors();
    setupArrays();
    p5.background(255, 255);
    p5.blendMode(p5.BLEND);
    render();
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    const { dimensions, orientationChanged } = handleResize(p5);
    state.vMax = dimensions.vMax;
    state.vW = p5.width / 100;
    state.vH = p5.height / 100;

    if (orientationChanged) {
      // Transform points for new orientation
      for (let i = 0; i < state.pointGrid.length; i++) {
        for (let j = 0; j < state.pointGrid[i].length; j++) {
          const x = state.pointGrid[i][j].x;
          const y = state.pointGrid[i][j].y;
          state.pointGrid[i][j].x = (x / p5.width) * p5.height;
          state.pointGrid[i][j].y = (y / p5.height) * p5.width;
        }
      }
    }

    render();
  }

  function setupToolbarActions() {
    const elements = document.querySelectorAll('[data-element="swatch"]');
    elements.forEach((el) => {
      addInteractionHandlers(el, () => {
        state.currentSwatch = parseInt(el.getAttribute("data-swatch"));
      });
    });
  }

  function updateSwatchColors() {
    const elements = document.querySelectorAll('[data-element="swatch"]');
    elements.forEach((el) => {
      el.style.backgroundColor =
        COLOURS[state.colorPairIndex][parseInt(el.getAttribute("data-swatch"))];
    });
  }

  return {
    preload,
    setup,
    reset,
    render,
    handleMove,
    windowResized,
  };
}
