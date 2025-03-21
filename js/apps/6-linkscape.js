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

    // Graphics layers
    lineLayer: null,
    paintLayer: null,
    shadowLayer: null,
    texture: null,

    // Interaction state
    isDragging: false,
    selectedPoint: [0, 0], // [stringIndex, pointIndex]

    // Shadow trail states
    stringHistory: [],
    shadowsActive: true,
    shadowOpacity: 0.2,

    // Palette selection
    currentPaletteIndex: 0,
    paletteCount: 9,

    // Viewport dimensions
    canvasWidth: 0,
    canvasHeight: 0,
    vMin: 0,
    vMax: 0,

    lastShadowCaptureTime: 0,
    shadowCaptureInterval: 67,
    needsFullRedraw: true,
    lastMoveHandleTime: 0,
    moveThrottleInterval: 17,

    showDebugInfo: true,
    frameRateHistory: [],
    frameRateHistoryMaxLength: 60,
    totalFrames: 0,
    fullRedrawFrames: 0,
    partialRedrawFrames: 0,
    lastStatsResetTime: Date.now(),
    statsResetInterval: 5000, // Reset stats every 5 seconds
  };

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

    // Calculate redraw percentages
    const totalFramesSinceReset =
      state.fullRedrawFrames + state.partialRedrawFrames;
    const fullRedrawPercentage =
      totalFramesSinceReset > 0
        ? Math.round((state.fullRedrawFrames / totalFramesSinceReset) * 100)
        : 0;

    const partialRedrawPercentage =
      totalFramesSinceReset > 0
        ? Math.round((state.partialRedrawFrames / totalFramesSinceReset) * 100)
        : 0;

    // Reset stats periodically to get recent percentages
    const currentTime = Date.now();
    if (currentTime - state.lastStatsResetTime > state.statsResetInterval) {
      state.fullRedrawFrames = 0;
      state.partialRedrawFrames = 0;
      state.lastStatsResetTime = currentTime;
    }

    // Position info in the top-right corner
    const margin = 10;
    const debugWidth = 200;
    const debugHeight = 100;
    const xPos = state.canvasWidth - debugWidth - margin;
    const yPos = margin;

    // Display debug info
    p5.push();
    p5.noStroke();

    // Create background for text
    p5.fill(0, 150);
    p5.rect(xPos, yPos, debugWidth, debugHeight);

    // Display text
    p5.fill(255);
    p5.textSize(14);
    p5.textAlign(p5.LEFT, p5.TOP);

    p5.text(`FPS: ${currentFrameRate.toFixed(1)}`, xPos + 10, yPos + 10);
    p5.text(`Avg: ${avgFrameRate.toFixed(1)}`, xPos + 10, yPos + 30);
    p5.text(`Full: ${fullRedrawPercentage}%`, xPos + 10, yPos + 50);
    p5.text(`Partial: ${partialRedrawPercentage}%`, xPos + 10, yPos + 70);

    p5.pop();
  }

  function preload() {
    state.texture = p5.loadImage(
      `${import.meta.env.BASE_URL}images/6-linkscape_texture.webp`
    );
  }

  async function setup() {
    setupToolbarActions();

    // Initialize dimensions
    const dimensions = calcViewportDimensions();
    state.canvasWidth = dimensions.width;
    state.canvasHeight = dimensions.height;
    state.vMin = dimensions.vMin;
    state.vMax = dimensions.vMax;

    const canvas = p5.createCanvas(state.canvasWidth, state.canvasHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    state.lineLayer = p5.createGraphics(state.canvasWidth, state.canvasHeight);
    state.paintLayer = p5.createGraphics(state.canvasWidth, state.canvasHeight);
    state.shadowLayer = p5.createGraphics(
      state.canvasWidth,
      state.canvasHeight
    );

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
        addString();
      });
    }
  }

  function reset(isInitialSetup = false) {
    state.paintLayer.clear();
    state.shadowLayer.clear();
    state.stringPointsX = [];
    state.stringPointsY = [];
    state.stringHistory = [];

    // For user-triggered reset, increment first so we render with new palette
    if (!isInitialSetup) {
      state.currentPaletteIndex =
        (state.currentPaletteIndex + 1) % COLOR_PALETTES.length;
    }

    initialiseLine(0);
    state.isDragging = true;
    render();

    const button = document.querySelector('[data-element="add-string-button"]');
    if (button) button.removeAttribute("disabled");
  }

  function initialiseLine(stringIndex) {
    state.stringPointsX[stringIndex] = [];
    state.stringPointsY[stringIndex] = [];
    state.stringHistory[stringIndex] = [];

    for (let i = 0; i < state.segmentCount; i++) {
      state.stringPointsY[stringIndex][i] = p5.map(
        i,
        0,
        state.segmentCount,
        -state.canvasHeight,
        state.canvasHeight / 6
      );
      state.stringPointsX[stringIndex][i] = p5.map(
        i,
        0,
        state.segmentCount,
        0,
        (state.canvasWidth / 4) * (1 + stringIndex)
      );

      state.stringHistory[stringIndex][i] = [];
    }
  }

  function addString() {
    if (state.stringPointsX.length < 3) {
      initialiseLine(state.stringPointsX.length);
      render();
    }

    if (state.stringPointsX.length >= 3) {
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
      for (
        let stringIdx = 0;
        stringIdx < state.stringPointsX.length;
        stringIdx++
      ) {
        const SELECTION_RADIUS = 45;
        const lastPointIndex = state.segmentCount - 1;

        // Check if the user clicked on the first point
        if (
          p5.dist(
            eventX,
            eventY,
            state.stringPointsX[stringIdx][0],
            state.stringPointsY[stringIdx][0]
          ) < SELECTION_RADIUS
        ) {
          state.selectedPoint = [stringIdx, 0];
          state.isDragging = true;
          state.needsFullRedraw = true; // Force full redraw when starting drag
          break;
        }
        // Check if the user clicked on the last point
        else if (
          p5.dist(
            eventX,
            eventY,
            state.stringPointsX[stringIdx][lastPointIndex],
            state.stringPointsY[stringIdx][lastPointIndex]
          ) < SELECTION_RADIUS
        ) {
          state.selectedPoint = [stringIdx, lastPointIndex];
          state.isDragging = true;
          state.needsFullRedraw = true; // Force full redraw when starting drag
          break;
        }
        // Check if the user clicked on any point in between
        else {
          for (
            let pointIdx = 0;
            pointIdx < state.stringPointsX[stringIdx].length;
            pointIdx++
          ) {
            if (
              p5.dist(
                eventX,
                eventY,
                state.stringPointsX[stringIdx][pointIdx],
                state.stringPointsY[stringIdx][pointIdx]
              ) < SELECTION_RADIUS
            ) {
              state.selectedPoint = [stringIdx, pointIdx];

              // Adjust the selection point to be either near the start or end
              // to make dragging more intuitive
              if (pointIdx < 30) {
                state.selectedPoint[1] = 1;
              } else if (
                pointIdx >
                state.stringPointsX[stringIdx].length - 30
              ) {
                state.selectedPoint[1] = state.segmentCount - 1;
              } else {
                state.selectedPoint[1] = pointIdx;
              }

              state.isDragging = true;
              state.needsFullRedraw = true; // Force full redraw when starting drag
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
      const currentTime = Date.now();

      // Get dragged point info
      const [stringIdx, pointIdx] = state.selectedPoint;

      // Direct update of the selected point for immediate visual feedback
      state.stringPointsX[stringIdx][pointIdx] = currentX;
      state.stringPointsY[stringIdx][pointIdx] = currentY;

      // Connect the nearest segment to the dragged point to avoid disconnection
      if (pointIdx === 0 && state.stringPointsX[stringIdx].length > 1) {
        // If dragging first point, update the second point to maintain connection
        const dx = currentX - state.stringPointsX[stringIdx][1];
        const dy = currentY - state.stringPointsY[stringIdx][1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > state.segmentLength * 1.5) {
          // If too far, move the connecting point closer
          const angle = Math.atan2(dy, dx);
          state.stringPointsX[stringIdx][1] =
            currentX - Math.cos(angle) * state.segmentLength;
          state.stringPointsY[stringIdx][1] =
            currentY - Math.sin(angle) * state.segmentLength;
        }
      } else if (
        pointIdx === state.stringPointsX[stringIdx].length - 1 &&
        pointIdx > 0
      ) {
        // If dragging last point, update the second-to-last point
        const dx = currentX - state.stringPointsX[stringIdx][pointIdx - 1];
        const dy = currentY - state.stringPointsY[stringIdx][pointIdx - 1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > state.segmentLength * 1.5) {
          // If too far, move the connecting point closer
          const angle = Math.atan2(dy, dx);
          state.stringPointsX[stringIdx][pointIdx - 1] =
            currentX - Math.cos(angle) * state.segmentLength;
          state.stringPointsY[stringIdx][pointIdx - 1] =
            currentY - Math.sin(angle) * state.segmentLength;
        }
      }

      // Throttle the expensive physics calculations
      if (currentTime - state.lastMoveHandleTime < state.moveThrottleInterval) {
        // Just render the current frame with the updated point position
        // but skip the expensive physics calculations
        render();
        return false;
      }

      state.lastMoveHandleTime = currentTime;

      // Do full update including physics and shadow capture
      updateStringSegments(state.selectedPoint, currentX, currentY);

      if (state.shadowsActive) {
        captureCurrentPositions();
      }

      render();
    }

    return false;
  }

  function captureCurrentPositions() {
    const currentTime = Date.now();

    // Only capture shadows at the specified interval
    if (
      currentTime - state.lastShadowCaptureTime <
      state.shadowCaptureInterval
    ) {
      return;
    }

    // Update the last capture time
    state.lastShadowCaptureTime = currentTime;

    // Capture the entire current string shape for persistent shadow trails
    for (
      let stringIdx = 0;
      stringIdx < state.stringPointsX.length;
      stringIdx++
    ) {
      if (!state.stringHistory[stringIdx]) {
        state.stringHistory[stringIdx] = [];
      }

      // Create a new shadow entry for the current string position
      const stringShadow = {
        points: [],
        color:
          COLOR_PALETTES[state.currentPaletteIndex][
            stringIdx % COLOR_PALETTES[state.currentPaletteIndex].length
          ],
      };

      // Store all current segment positions
      for (
        let pointIdx = 0;
        pointIdx < state.stringPointsX[stringIdx].length;
        pointIdx++
      ) {
        stringShadow.points.push({
          x: state.stringPointsX[stringIdx][pointIdx],
          y: state.stringPointsY[stringIdx][pointIdx],
        });
      }

      // Add this shadow to the collection
      if (stringShadow.points.length > 0) {
        state.stringHistory[stringIdx].push(stringShadow);
      }
      state.needsFullRedraw = true;
    }
  }

  function handlePointerEnd() {
    state.isDragging = false;
    state.selectedPoint = [0, 0];
    state.needsFullRedraw = true;
  }

  function updateStringSegments(selectedPoint, mouseX, mouseY) {
    const [stringIdx, pointIdx] = selectedPoint;

    // Update the dragged point directly
    dragSegment(selectedPoint, mouseX, mouseY);

    // Update following segments (ripple forward)
    for (let i = pointIdx; i < state.stringPointsX[stringIdx].length - 1; i++) {
      dragSegment(
        [stringIdx, i + 1],
        state.stringPointsX[stringIdx][i],
        state.stringPointsY[stringIdx][i]
      );
    }

    // Update preceding segments (ripple backward)
    for (let i = pointIdx; i > 0; i--) {
      dragSegment(
        [stringIdx, i - 1],
        state.stringPointsX[stringIdx][i],
        state.stringPointsY[stringIdx][i]
      );
    }
  }

  function dragSegment(pointCoords, targetX, targetY) {
    const [stringIdx, pointIdx] = pointCoords;

    // Calculate the direction vector from our segment to the target
    const deltaX = targetX - state.stringPointsX[stringIdx][pointIdx];
    const deltaY = targetY - state.stringPointsY[stringIdx][pointIdx];

    // Get the angle of the direction vector
    const angle = Math.atan2(deltaY, deltaX);

    // Position this segment at the correct distance from the target point
    state.stringPointsX[stringIdx][pointIdx] =
      targetX - Math.cos(angle) * state.segmentLength;
    state.stringPointsY[stringIdx][pointIdx] =
      targetY - Math.sin(angle) * state.segmentLength;
  }

  function render() {
    // Increment total frame counter
    state.totalFrames++;

    // Always clear the line layer for current string positions
    state.lineLayer.clear();

    // Track which type of render this is
    if (state.needsFullRedraw) {
      state.fullRedrawFrames++;

      // Only clear the paint and shadow layers if we're doing a full redraw
      state.paintLayer.clear();
      state.shadowLayer.clear();

      // Draw the shadow trails (only when doing a full redraw)
      if (state.shadowsActive) {
        drawShadowTrails();
      }
    } else {
      state.partialRedrawFrames++;
    }

    // Always draw current strings on the line layer
    for (
      let stringIdx = 0;
      stringIdx < state.stringPointsX.length;
      stringIdx++
    ) {
      const currentPalette = COLOR_PALETTES[state.currentPaletteIndex];
      const baseColor = currentPalette[stringIdx % currentPalette.length];
      const mainColor = colorAlpha(p5, baseColor, 0.9);
      const shadowColor = colorAlpha(p5, baseColor, 0.3);

      // Ensure the very end points of the string are exactly at the dot centers
      const firstPointIdx = 0;
      const lastPointIdx = state.stringPointsX[stringIdx].length - 1;

      // Store original endpoint positions for drawing the dots
      const firstPointX = state.stringPointsX[stringIdx][firstPointIdx];
      const firstPointY = state.stringPointsY[stringIdx][firstPointIdx];
      const lastPointX = state.stringPointsX[stringIdx][lastPointIdx];
      const lastPointY = state.stringPointsY[stringIdx][lastPointIdx];

      // Draw main string
      state.lineLayer.strokeWeight(0.6 * state.vMax);
      state.lineLayer.stroke(mainColor);
      state.lineLayer.noFill();
      state.lineLayer.beginShape();

      // Draw the string with special handling of endpoints
      for (
        let pointIdx = 0;
        pointIdx < state.stringPointsX[stringIdx].length;
        pointIdx++
      ) {
        state.lineLayer.curveVertex(
          state.stringPointsX[stringIdx][pointIdx],
          state.stringPointsY[stringIdx][pointIdx]
        );
      }
      state.lineLayer.endShape();

      // Draw endpoints at the exact positions of the first and last points
      state.lineLayer.strokeWeight(1.2 * state.vMax);
      state.lineLayer.point(firstPointX, firstPointY);
      state.lineLayer.point(lastPointX, lastPointY);

      // Draw shadow effect on paint layer ONLY during full redraw
      if (state.needsFullRedraw) {
        state.paintLayer.strokeWeight(0.1 * state.vMax);
        state.paintLayer.stroke(shadowColor);
        state.paintLayer.noFill();
        state.paintLayer.beginShape();
        for (
          let pointIdx = 0;
          pointIdx < state.stringPointsX[stringIdx].length;
          pointIdx++
        ) {
          state.paintLayer.curveVertex(
            state.stringPointsX[stringIdx][pointIdx],
            state.stringPointsY[stringIdx][pointIdx]
          );
        }
        state.paintLayer.endShape();
      }
    }

    // Reset the full redraw flag AFTER we've done all the drawing
    if (state.needsFullRedraw) {
      state.needsFullRedraw = false;
    }

    // Render final composition
    p5.background(45);
    p5.image(state.shadowLayer, 0, 0, state.canvasWidth, state.canvasHeight);
    p5.image(state.paintLayer, 0, 0, state.canvasWidth, state.canvasHeight);
    p5.image(state.lineLayer, 0, 0, state.canvasWidth, state.canvasHeight);

    // Display debug info if enabled
    if (state.showDebugInfo) {
      displayDebugInfo();
    }
  }

  function drawShadowTrails() {
    // Draw all accumulated shadow trails
    for (let i = 0; i < state.stringHistory.length; i++) {
      if (!state.stringHistory[i]) continue;

      // Draw each shadow position for this line
      for (let s = 0; s < state.stringHistory[i].length; s++) {
        const shadow = state.stringHistory[i][s];
        if (!shadow || !shadow.points || shadow.points.length === 0) continue;

        // TODO: Calculate opacity based on how many shadows we have (more shadows = more transparent)
        // This helps to prevent the screen from becoming too cluttered
        // const totalShadows = state.stringHistory[i].length;

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
  };
}
