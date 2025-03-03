import { addInteractionHandlers } from "../utils/events.js";
import { colorAlpha } from "../utils/color.js";
import { isClickOnButton } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";

/**
 * Creates a fully encapsulated Linkscape sketch.
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => Promise<void>,
 *   setup: () => Promise<void>,
 *   reset: (isInitialSetup?: boolean) => void,
 *   render: () => void,
 *   windowResized: () => void,
 *   handlePointerStart: (event: PointerEvent) => boolean,
 *   handlePointerEnd: () => void,
 *   handleMove: (
 *     currentX: number,
 *     currentY: number,
 *     previousX: number,
 *     previousY: number,
 *     event: PointerEvent
 *   ) => boolean,
 *   addLine: () => void,
 * }} An object containing sketch lifecycle and interaction methods:
 *   - preload: Loads texture images
 *   - setup: Initializes canvas, graphics layers, and string segments
 *   - reset: Resets string positions and changes color palette
 *   - render: Renders strings with shadow effects
 *   - windowResized: Handles canvas and layer resizing
 *   - handlePointerStart: Initializes string dragging
 *   - handlePointerEnd: Ends string dragging interaction
 *   - handleMove: Updates string segment positions during drag
 *   - addLine: Adds a new string to the simulation
 */
export function createLinkscape(p5) {
  const PALETTES = [
    ["#D97398", "#A65398", "#5679A6"],
    ["#F2913D", "#F24B0F", "#5679A6"],
    ["#a4fba6", "#4ae54a", "#0f9200"],
    ["#F2F2F2", "#A6A6A6", "#737373"],
    ["#597d94", "#FFFFFF", "#D9AA8F"],
    ["#F2DFCE", "#FFFFFF", "#D9C3B0"],
    ["#F24444", "#F2BBBB", "#FFFFFF"],
    ["#BF4B8B", "#3981BF", "#D92929"],
    ["#F24452", "#5CE3F2", "#F2E205"],
    ["#CCCCCC", "#F2F2F2", "#B3B3B3"],
  ];

  const state = {
    // Line segments
    x: [],
    y: [],
    segNum: 250,
    segLength: 4,

    // Layers
    lineLayer: null,
    paintLayer: null,
    shadowLayer: null,
    texture: null,

    // Interaction state
    isDragging: false,
    selected: [0, 0],

    // Shadow trail states
    shadowPositions: [],
    shadowsActive: true,
    shadowOpacity: 0.2,

    // Level tracking
    levelVersion: 0,
    levelMax: 9,

    // Viewport dimensions
    width: 0,
    height: 0,
    vMin: 0,
    vMax: 0,
  };

  function preload() {
    state.texture = p5.loadImage(
      `${import.meta.env.BASE_URL}images/6-linkscape_texture.webp`
    );
  }

  async function setup() {
    setupToolbarActions();

    // Initialize dimensions
    const dimensions = calcViewportDimensions();
    Object.assign(state, dimensions);

    const canvas = p5.createCanvas(state.width, state.height);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    state.lineLayer = p5.createGraphics(state.width, state.height);
    state.paintLayer = p5.createGraphics(state.width, state.height);
    state.shadowLayer = p5.createGraphics(state.width, state.height);

    state.lineLayer.strokeWeight(1 * state.vMax);
    state.paintLayer.strokeWeight(1 * state.vMax);
    state.shadowLayer.strokeWeight(0.5 * state.vMax);

    reset(true); // Pass flag indicating this is initial setup
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const addStringButton = toolbar.querySelector(
      '[data-element="add-string-button"]'
    );
    if (addStringButton) {
      addInteractionHandlers(addStringButton, (event) => {
        addLine();
      });
    }
  }

  function reset(isInitialSetup = false) {
    state.paintLayer.clear();
    state.shadowLayer.clear();
    state.x = [];
    state.y = [];
    state.shadowPositions = [];

    // For user-triggered reset, increment first so we render with new palette
    if (!isInitialSetup) {
      state.levelVersion = (state.levelVersion + 1) % PALETTES.length;
    }

    initialiseLine(0);
    state.isDragging = true;
    render();

    const button = document.querySelector('[data-element="add-string-button"]');
    if (button) button.removeAttribute("disabled");
  }

  function initialiseLine(l) {
    state.x[l] = [];
    state.y[l] = [];
    state.shadowPositions[l] = [];

    for (let i = 0; i < state.segNum; i++) {
      state.y[l][i] = p5.map(
        i,
        0,
        state.segNum,
        -state.height,
        state.height / 6
      );
      state.x[l][i] = p5.map(
        i,
        0,
        state.segNum,
        0,
        (state.width / 4) * (1 + l)
      );

      state.shadowPositions[l][i] = [];
    }
  }

  function addLine() {
    if (state.x.length < 3) {
      initialiseLine(state.x.length);
      render();
    }

    if (state.x.length >= 3) {
      const button = document.querySelector(
        '[data-element="add-string-button"]'
      );
      if (button) button.setAttribute("disabled", true);
    }
  }

  function handlePointerStart(event) {
    if (isClickOnButton(event)) return false;

    const eventX = event.type.startsWith("touch")
      ? event.touches[0].clientX - event.target.getBoundingClientRect().left
      : p5.winMouseX;
    const eventY = event.type.startsWith("touch")
      ? event.touches[0].clientY - event.target.getBoundingClientRect().top
      : p5.winMouseY;

    if (!state.isDragging) {
      for (let i = 0; i < state.x.length; i++) {
        if (p5.dist(eventX, eventY, state.x[i][0], state.y[i][0]) < 45) {
          state.selected = [i, 0];
          state.isDragging = true;
          break;
        } else if (
          p5.dist(
            eventX,
            eventY,
            state.x[i][state.segNum - 1],
            state.y[i][state.segNum - 1]
          ) < 45
        ) {
          state.selected = [i, state.segNum - 1];
          state.isDragging = true;
          break;
        } else {
          for (let j = 0; j < state.x[i].length; j++) {
            if (p5.dist(eventX, eventY, state.x[i][j], state.y[i][j]) < 45) {
              state.selected = [i, j];
              if (j < 30) {
                state.selected[1] = 1;
              } else if (j > state.x[i].length - 30) {
                state.selected[1] = state.segNum - 1;
              } else {
                state.selected[1] = j;
              }
              state.isDragging = true;
              break;
            }
          }
          if (state.isDragging) break;
        }
      }
    }
    return false;
  }

  function handleMove(currentX, currentY, previousX, previousY, event) {
    if (event) {
      event.preventDefault();
    }

    if (state.isDragging) {
      if (state.shadowsActive) {
        captureCurrentPositions();
      }

      dragCalc(state.selected, currentX, currentY);
    }

    render();
    return false;
  }

  function captureCurrentPositions() {
    // Capture the entire current line shape for persistent shadow trails
    for (let i = 0; i < state.x.length; i++) {
      if (!state.shadowPositions[i]) {
        state.shadowPositions[i] = [];
      }

      // Create a new shadow entry for the current line position
      const lineShadow = {
        points: [],
        color:
          PALETTES[state.levelVersion][i % PALETTES[state.levelVersion].length],
      };

      // Store all current segment positions
      for (let j = 0; j < state.x[i].length; j++) {
        lineShadow.points.push({
          x: state.x[i][j],
          y: state.y[i][j],
        });
      }

      // Add this shadow to the collection
      if (lineShadow.points.length > 0) {
        state.shadowPositions[i].push(lineShadow);
      }
    }
  }

  function handlePointerEnd() {
    state.isDragging = false;
    state.selected = [0, 0];
  }

  function dragCalc(sel, mouseX, mouseY) {
    dragSegment(sel, mouseX, mouseY);

    let [i, j] = sel;
    // Update following segments
    for (let k = j; k < state.x[i].length - 1; k++) {
      dragSegment([i, k + 1], state.x[i][k], state.y[i][k]);
    }
    // Update preceding segments
    for (let k = j; k > 0; k--) {
      dragSegment([i, k - 1], state.x[i][k], state.y[i][k]);
    }
  }

  function dragSegment(sel, xin, yin) {
    const [i, j] = sel;
    const dx = xin - state.x[i][j];
    const dy = yin - state.y[i][j];
    const angle = p5.atan2(dy, dx);

    state.x[i][j] = xin - p5.cos(angle) * state.segLength;
    state.y[i][j] = yin - p5.sin(angle) * state.segLength;
  }

  function render() {
    state.lineLayer.clear();
    state.paintLayer.clear();
    state.shadowLayer.clear();

    // Draw the shadow trails first (from previous positions)
    if (state.shadowsActive) {
      drawShadowTrails();
    }

    for (let i = 0; i < state.x.length; i++) {
      const baseColor =
        PALETTES[state.levelVersion][i % PALETTES[state.levelVersion].length];
      const mainColor = colorAlpha(p5, baseColor, 0.9);
      const shadowColor = colorAlpha(p5, baseColor, 0.3);

      // Draw main string
      state.lineLayer.strokeWeight(0.6 * state.vMax);
      state.lineLayer.stroke(mainColor);
      state.lineLayer.noFill();
      state.lineLayer.beginShape();
      for (let j = 0; j < state.x[i].length; j++) {
        state.lineLayer.curveVertex(state.x[i][j], state.y[i][j]);
      }
      state.lineLayer.endShape();

      // Draw endpoints
      state.lineLayer.strokeWeight(1.2 * state.vMax);
      state.lineLayer.point(state.x[i][0], state.y[i][0]);
      state.lineLayer.point(
        state.x[i][state.x[i].length - 1],
        state.y[i][state.x[i].length - 1]
      );

      // Draw shadow effect
      state.paintLayer.strokeWeight(0.1 * state.vMax);
      state.paintLayer.stroke(shadowColor);
      state.paintLayer.noFill();
      state.paintLayer.beginShape();
      for (let j = 0; j < state.x[i].length; j++) {
        state.paintLayer.curveVertex(state.x[i][j], state.y[i][j]);
      }
      state.paintLayer.endShape();
    }

    // Render final composition
    p5.background(45);
    p5.image(state.shadowLayer, 0, 0, state.width, state.height);
    p5.image(state.paintLayer, 0, 0, state.width, state.height);
    p5.image(state.lineLayer, 0, 0, state.width, state.height);
  }

  function drawShadowTrails() {
    // Draw all accumulated shadow trails
    for (let i = 0; i < state.shadowPositions.length; i++) {
      if (!state.shadowPositions[i]) continue;

      // Draw each shadow position for this line
      for (let s = 0; s < state.shadowPositions[i].length; s++) {
        const shadow = state.shadowPositions[i][s];
        if (!shadow || !shadow.points || shadow.points.length === 0) continue;

        // Calculate opacity based on how many shadows we have (more shadows = more transparent)
        // This helps to prevent the screen from becoming too cluttered
        const totalShadows = state.shadowPositions[i].length;
        const shadowColor = colorAlpha(p5, shadow.color, state.shadowOpacity);

        state.shadowLayer.stroke(shadowColor);
        state.shadowLayer.strokeWeight(0.2 * state.vMax);
        state.shadowLayer.noFill();

        // Draw the shadow as a smooth curve
        state.shadowLayer.beginShape();
        for (let j = 0; j < shadow.points.length; j++) {
          state.shadowLayer.curveVertex(shadow.points[j].x, shadow.points[j].y);
        }
        state.shadowLayer.endShape();
      }
    }
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    const { dimensions, resizedLayers } = handleResize(p5, [
      state.lineLayer,
      state.paintLayer,
      state.shadowLayer,
    ]);
    [state.lineLayer, state.paintLayer, state.shadowLayer] = resizedLayers;
    Object.assign(state, dimensions);
    state.lineLayer.strokeWeight(2.2 * state.vMax);

    // Redraw all shadows on the resized shadow layer
    if (state.shadowsActive) {
      drawShadowTrails();
    }
  }

  return {
    preload,
    setup,
    reset,
    render,
    windowResized,
    handlePointerStart,
    handlePointerEnd,
    handleMove,
    addLine,
  };
}
