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
 * }} An object containing sketch lifecycle and interaction methods
 */
export function createLinkscape(p5) {
  const COLOR_PALETTES = [
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
    // String segments
    stringPointsX: [],
    stringPointsY: [],
    segmentCount: 250,
    segmentLength: 4,
    cutSegment: 0,

    // Graphics layers
    stringLayer: null,
    paintLayer: null,
    texture: null,

    // Interaction state
    isDragging: true,
    selectedPoint: [0, 0], // [stringIndex, pointIndex]
    isInitialDrawing: true,

    // Palette selection
    currentPaletteIndex: 0,

    // Viewport dimensions
    vMin: 0,
    vMax: 0,

    showDebugInfo: false,
    frameRateHistory: [],
    frameRateHistoryMaxLength: 60,
  };

  async function preload() {
    try {
      state.texture = await p5.loadImage(
        `${import.meta.env.BASE_URL}images/6-linkscape_texture.webp`
      );
    } catch (error) {
      console.error("Error loading assets:", error);
    }
  }

  async function setup() {
    setupToolbarActions();

    // Initialize dimensions
    const dimensions = calcViewportDimensions();
    state.vMin = dimensions.vMin;
    state.vMax = dimensions.vMax;

    const canvas = p5.createCanvas(dimensions.width, dimensions.height);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    // Create graphics layers with the same dimensions
    state.stringLayer = p5.createGraphics(dimensions.width, dimensions.height);
    state.paintLayer = p5.createGraphics(dimensions.width, dimensions.height);

    // Set up layer styles
    state.stringLayer.stroke(55, 55, 65);
    state.paintLayer.stroke(55, 55, 65);
    state.stringLayer.strokeWeight(1 * state.vMax);
    state.paintLayer.strokeWeight(1 * state.vMax);

    start();
  }

  function start() {
    // Reset string weights based on viewport size
    state.stringLayer.strokeWeight(1 * state.vMax);
    state.paintLayer.strokeWeight(1 * state.vMax);

    // Call reset to initialize the sketch
    reset(true);
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const addStringButton = toolbar.querySelector(
      '[data-element="add-string-button"]'
    );
    if (addStringButton) {
      addInteractionHandlers(addStringButton, () => {
        addString();
      });
    }

    const resetButton = toolbar.querySelector('[data-element="reset-button"]');
    if (resetButton) {
      addInteractionHandlers(resetButton, () => {
        reset();
      });
    }
  }

  function reset(isInitialSetup = false) {
    state.paintLayer.clear();

    state.stringPointsX = [];
    state.stringPointsY = [];

    // Increment palette index for color change
    state.currentPaletteIndex++;
    if (state.currentPaletteIndex >= COLOR_PALETTES.length) {
      state.currentPaletteIndex = 0;
    }

    initialiseString(0);
    state.isDragging = true;
    state.isInitialDrawing = true;

    render();

    const button = document.querySelector('[data-element="add-string-button"]');
    if (button) button.removeAttribute("disabled");
  }

  function initialiseString(stringIndex) {
    state.stringPointsX[stringIndex] = [];
    state.stringPointsY[stringIndex] = [];

    // Generate initial positions for the string
    for (let i = 0; i < state.segmentCount; i++) {
      state.stringPointsY[stringIndex][i] = p5.map(
        i,
        0,
        state.segmentCount,
        -p5.height,
        p5.height / 6
      );
      state.stringPointsX[stringIndex][i] = p5.map(
        i,
        0,
        state.segmentCount,
        0,
        (p5.width / 4) * (1 + stringIndex)
      );
    }

    state.isInitialDrawing = true;
  }

  function addString() {
    const stringIndex = state.stringPointsX.length;

    initialiseString(stringIndex);

    // Disable 'add' button if we have 3 strings already
    if (state.stringPointsX.length >= 3) {
      const button = document.querySelector(
        '[data-element="add-string-button"]'
      );
      if (button) button.setAttribute("disabled", true);
    }

    render();
  }

  function handlePointerStart(event) {
    if (isClickOnButton(event)) return false;

    // Get pointer coordinates
    const eventX = event.type.startsWith("touch")
      ? event.touches[0].clientX - event.target.getBoundingClientRect().left
      : p5.mouseX;
    const eventY = event.type.startsWith("touch")
      ? event.touches[0].clientY - event.target.getBoundingClientRect().top
      : p5.mouseY;

    if (!state.isDragging) {
      // Look through all strings
      for (let i = 0; i < state.stringPointsX.length; i++) {
        // Check endpoints first (start and end of string)
        if (
          p5.dist(
            eventX,
            eventY,
            state.stringPointsX[i][0],
            state.stringPointsY[i][0]
          ) < 45
        ) {
          state.selectedPoint = [i, 0];
          state.isDragging = true;
          break;
        } else if (
          p5.dist(
            eventX,
            eventY,
            state.stringPointsX[i][state.segmentCount - 1],
            state.stringPointsY[i][state.segmentCount - 1]
          ) < 45
        ) {
          state.selectedPoint = [i, state.segmentCount - 1];
          state.isDragging = true;
          break;
        } else {
          // Check all points in the string
          for (let j = 0; j < state.stringPointsX[i].length; j++) {
            if (
              p5.dist(
                eventX,
                eventY,
                state.stringPointsX[i][j],
                state.stringPointsY[i][j]
              ) < 45
            ) {
              state.selectedPoint = [i, j];

              if (j < 30) {
                state.selectedPoint[1] = 1;
              } else if (j > state.stringPointsX[i].length - 30) {
                state.selectedPoint[1] = state.segmentCount - 1;
              } else {
                state.selectedPoint[1] = j;
              }

              state.isDragging = true;
              break;
            }
          }
        }
        if (state.isDragging) break;
      }
    }

    return false;
  }

  function handlePointerEnd() {
    state.isDragging = false;
  }

  function handleMove(currentX, currentY, previousX, previousY, event) {
    if (event) {
      event.preventDefault();
    }

    if (state.isDragging) {
      dragCalc(state.selectedPoint, currentX, currentY);
    }

    render();
    return false;
  }

  function dragCalc(sel, mouseX, mouseY) {
    dragSegment(sel, mouseX, mouseY);

    const stringIndex = sel[0];
    const pointIndex = sel[1];

    // Update segments forward from the selected point
    for (
      let j = pointIndex;
      j < state.stringPointsX[stringIndex].length - 1;
      j++
    ) {
      const t = [stringIndex, j + 1];
      dragSegment(
        t,
        state.stringPointsX[stringIndex][j],
        state.stringPointsY[stringIndex][j]
      );
    }

    // Update segments backward from the selected point
    for (let j = pointIndex; j > 0; j--) {
      const t = [stringIndex, j - 1];
      dragSegment(
        t,
        state.stringPointsX[stringIndex][j],
        state.stringPointsY[stringIndex][j]
      );
    }
  }

  function dragSegment(sel, xin, yin) {
    const stringIndex = sel[0];
    const pointIndex = sel[1];

    // Calculate direction and angle to target position
    const dx = xin - state.stringPointsX[stringIndex][pointIndex];
    const dy = yin - state.stringPointsY[stringIndex][pointIndex];
    const angle = Math.atan2(dy, dx);

    // Position segment at the right distance from target
    state.stringPointsX[stringIndex][pointIndex] =
      xin - Math.cos(angle) * state.segmentLength;
    state.stringPointsY[stringIndex][pointIndex] =
      yin - Math.sin(angle) * state.segmentLength;
  }

  function render() {
    state.stringLayer.clear();
    // Draw each string
    for (let i = 0; i < state.stringPointsX.length; i++) {
      // Get colors from current palette
      const baseColor =
        COLOR_PALETTES[state.currentPaletteIndex][
          i % COLOR_PALETTES[state.currentPaletteIndex].length
        ];
      const mainColor = colorAlpha(p5, baseColor, 0.9);
      const shadowColor = colorAlpha(p5, baseColor, 0.3);

      // Draw main string
      state.stringLayer.strokeWeight(0.6 * state.vMax);
      state.stringLayer.stroke(mainColor);
      state.stringLayer.noFill();
      state.stringLayer.beginShape();

      // Add extra control point at the beginning to force the curve to start exactly at first point
      state.stringLayer.curveVertex(
        state.stringPointsX[i][0],
        state.stringPointsY[i][0]
      );

      // Add all points to the curve
      for (
        let j = 0;
        j < state.stringPointsX[i].length - 1 - state.cutSegment;
        j++
      ) {
        state.stringLayer.curveVertex(
          state.stringPointsX[i][j],
          state.stringPointsY[i][j]
        );
      }

      // Add extra control point at the end to force the curve to end exactly at last point
      const lastVisibleIndex = Math.min(
        state.stringPointsX[i].length - 1 - state.cutSegment,
        state.stringPointsX[i].length - 1
      );
      state.stringLayer.curveVertex(
        state.stringPointsX[i][lastVisibleIndex],
        state.stringPointsY[i][lastVisibleIndex]
      );

      state.stringLayer.endShape();

      // Draw endpoints as larger points
      state.stringLayer.strokeWeight(1.2 * state.vMax);
      state.stringLayer.stroke(mainColor);
      state.stringLayer.point(
        state.stringPointsX[i][0],
        state.stringPointsY[i][0]
      );
      state.stringLayer.point(
        state.stringPointsX[i][lastVisibleIndex],
        state.stringPointsY[i][lastVisibleIndex]
      );

      // Draw shadow effect
      state.paintLayer.strokeWeight(0.1 * state.vMax);
      state.paintLayer.stroke(shadowColor);
      state.paintLayer.noFill();
      state.paintLayer.beginShape();

      for (
        let j = 0;
        j < state.stringPointsX[i].length - 1 - state.cutSegment;
        j++
      ) {
        state.paintLayer.curveVertex(
          state.stringPointsX[i][j],
          state.stringPointsY[i][j]
        );
      }

      state.paintLayer.endShape();
    }

    p5.background(45);

    p5.image(state.paintLayer, 0, 0, p5.width, p5.height);
    p5.image(state.stringLayer, 0, 0, p5.width, p5.height);

    displayDebugInfo();
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    const { dimensions, resizedLayers } = handleResize(p5, [
      state.stringLayer,
      state.paintLayer,
    ]);

    [state.stringLayer, state.paintLayer] = resizedLayers;

    state.vMin = dimensions.vMin;
    state.vMax = dimensions.vMax;

    // Update stroke weight based on new dimensions
    state.stringLayer.strokeWeight(1 * state.vMax);
    state.paintLayer.strokeWeight(1 * state.vMax);

    render();
  }

  // On-screen FPS debugging can be enabled by setting state.showDebugInfo to true
  function displayDebugInfo() {
    if (!state.showDebugInfo) return;

    // Calculate current framerate
    const currentFrameRate = p5.frameRate();

    // Add to history
    state.frameRateHistory.push(currentFrameRate);
    if (state.frameRateHistory.length > state.frameRateHistoryMaxLength) {
      state.frameRateHistory.shift();
    }

    // Calculate average framerate
    const avgFrameRate =
      state.frameRateHistory.reduce((sum, rate) => sum + rate, 0) /
      state.frameRateHistory.length;

    // Display debug info
    p5.push();
    p5.noStroke();
    p5.fill(255);
    p5.textSize(16);
    p5.textAlign(p5.LEFT, p5.TOP);

    // Create background for text
    p5.fill(0, 150);
    p5.rect(10, 10, 180, 60);

    // Display text
    p5.fill(255);
    p5.text(`Current FPS: ${currentFrameRate.toFixed(1)}`, 20, 20);
    p5.text(`Avg FPS: ${avgFrameRate.toFixed(1)}`, 20, 45);
    p5.pop();
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
  };
}
