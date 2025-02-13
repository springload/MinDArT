import { addInteractionHandlers } from "../utils/events.js";
import { colorAlpha } from "../utils/color.js";
import { isClickOnButton } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";

/**
 * Creates an encapsulated Linkscape sketch
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {Object} An object with sketch lifecycle methods
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
    distGravity: 50,

    // Layers
    lineLayer: null,
    paintLayer: null,
    texture: null,
    pin: null,

    // Interaction state
    isDragging: false,
    isAddingPin: false,
    selected: [0, 0],

    // Constraint parameters
    vt: [], // Vector points for pin positions
    vtCount: [], // Count of points affected by each pin
    vtStored: [], // Store which segments are affected by pins
    dotsActive: true,

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
    state.pin = p5.loadImage(
      `${import.meta.env.BASE_URL}images/6-linkscape_pin.webp`
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

    state.lineLayer.strokeWeight(1 * state.vMax);
    state.paintLayer.strokeWeight(1 * state.vMax);
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

    const addPinButton = toolbar.querySelector(
      '[data-element="add-pin-button"]'
    );
    if (addPinButton) {
      addInteractionHandlers(addPinButton, (event) => {
        addPin();
      });
    }
  }

  function reset(isInitialSetup = false) {
    state.paintLayer.clear();
    state.x = [];
    state.y = [];
    state.vt = [];
    state.vtCount = [];

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

  function addPin() {
    state.isAddingPin = true;
    document.querySelector("canvas").classList.add("adding-pin");
  }

  function handlePointerStart(event) {
    if (isClickOnButton(event)) return false;

    const eventX = event.type.startsWith("touch")
      ? event.touches[0].clientX - event.target.getBoundingClientRect().left
      : p5.winMouseX;
    const eventY = event.type.startsWith("touch")
      ? event.touches[0].clientY - event.target.getBoundingClientRect().top
      : p5.winMouseY;

    if (state.isAddingPin) {
      state.vt.push(p5.createVector(eventX, eventY));
      state.vtCount.push(0);
      state.vtStored.push([]);
      state.isAddingPin = false;
      document.querySelector("canvas").classList.remove("adding-pin");
      render();
      return false;
    }

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

    state.vtStored = [];

    if (state.dotsActive) {
      for (let i = 0; i < state.vt.length; i++) {
        state.vtCount[i] = 0;
        state.vtStored[i] = [];
      }
    }

    if (state.isDragging) {
      dragCalc(state.selected, currentX, currentY);
    }

    render();
    return false;
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

    if (state.dotsActive) {
      for (let k = 0; k < state.vt.length; k++) {
        let v1 = p5.createVector(state.x[i][j], state.y[i][j]);
        let gate = true;

        for (let elt of state.vtStored[k]) {
          if (p5.abs(elt - j) < 20 && p5.abs(elt - j) > 6) {
            gate = false;
            break;
          }
        }

        if (gate) {
          let d = v1.dist(state.vt[k]);
          if (d < state.distGravity) {
            state.vtStored[k].push(j);
            state.x[i][j] = state.vt[k].x;
            state.y[i][j] = state.vt[k].y;
            state.vtCount[k]++;
          }
        }
      }
    }
  }

  function render() {
    state.lineLayer.clear();
    state.paintLayer.clear();

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
    p5.image(state.paintLayer, 0, 0, state.width, state.height);
    p5.image(state.lineLayer, 0, 0, state.width, state.height);

    // Draw pins if active
    if (state.dotsActive) {
      const pinSize = state.vMax * 8;
      for (let i = 0; i < state.vt.length; i++) {
        p5.image(
          state.pin,
          state.vt[i].x - pinSize / 2,
          state.vt[i].y - pinSize / 1.8,
          pinSize,
          pinSize
        );
      }
    }
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    const { dimensions, resizedLayers } = handleResize(p5, [
      state.lineLayer,
      state.paintLayer,
    ]);
    [state.lineLayer, state.paintLayer] = resizedLayers;
    Object.assign(state, dimensions);
    state.lineLayer.strokeWeight(2.2 * state.vMax);
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
    addPin,
  };
}
