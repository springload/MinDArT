import { addInteractionHandlers } from "../utils/events.js";
import { colorAlpha } from "../utils/color.js";
import { clearActiveButtonState } from "../utils/dom.js";
import { isClickOnButton } from "../utils/events.js";
import { calcViewportDimensions, handleResize } from "../utils/viewport.js";

/**
 * Creates a fully encapsulated Rotationscape sketch.
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => Promise<void>,
 *   setup: () => Promise<void>,
 *   draw: () => void,
 *   reset: () => void,
 *   makeDrawing: (
 *     currentX: number,
 *     currentY: number,
 *     previousX: number,
 *     previousY: number
 *   ) => void,
 *   render: () => void,
 *   windowResized: () => void,
 *   handlePointerStart: (event: PointerEvent) => boolean,
 *   handlePointerEnd: () => boolean,
 *   handleMove: (
 *     currentX: number,
 *     currentY: number,
 *     previousX: number,
 *     previousY: number,
 *     event: PointerEvent
 *   ) => boolean,
 *   reCenter: (event?: Event) => void,
 *   changeBrush: (brushNumber: number, event?: Event) => void
 * }} An object containing sketch lifecycle and interaction methods:
 *   - preload: Loads background paper texture
 *   - setup: Initializes canvas, graphics layer, and brush settings
 *   - draw: Handles center point animation updates
 *   - reset: Cycles rotation mode and color palette
 *   - makeDrawing: Creates rotated brush strokes around center point
 *   - render: Renders background and drawing layer
 *   - windowResized: Handles canvas and layer resizing
 *   - handlePointerStart: Initializes drawing or sets new center point
 *   - handlePointerEnd: Handles completion of center point setting
 *   - handleMove: Updates brush strokes with rotational symmetry
 *   - reCenter: Activates center point placement mode
 *   - changeBrush: Changes active brush type and stroke settings
 */
export function createRotationscape(p5) {
  const ROTATION_MODES = [6, 7, 8, 10, 12, 20, 50];
  const PALETTES = [
    ["#D97398", "#A65398", "#263F73", "#5679A6"],
    ["#F2F2F2", "#F2913D", "#223240", "#F24B0F"],
    ["#6D808C", "#FFFFFF", "#D9AA8F", "#F2CAB3"],
    ["#3C5E73", "#F2BBBB", "#FFFFFF", "#F24444"],
    ["#F27ECA", "#9726A6", "#8F49F2", "#6C2EF2"],
    ["#BF4B8B", "#3981BF", "#1F628C", "#D92929"],
    ["#F2B705", "#F27EA9", "#05AFF2", "#F29F05", "#F2541B"],
    ["#A60321", "#D9043D", "#F29F05", "#D8BA7A"],
    ["#F24452", "#5CE3F2", "#F2E205", "#F2CB05", "#F29D35"],
    ["#2d3157", "#34c1bb", "#badccc", "#ffda4d"],
    ["#CCCCCC", "#F2F2F2", "#B3B3B3", "#E6E6E6"],
    ["#F2F2F2", "#A6A6A6", "#0D0D0D", "#202020"],
  ];
  const BACKGROUND_IMAGE = `${
    import.meta.env.BASE_URL
  }images/7-rotationscape_paper.webp`;

  const state = {
    // Core drawing state
    bg: null,
    drawLayer: null,
    selectedBrush: 1,
    lastDrawingBrush: 0,

    // Animation and effects
    faderStart: 600,
    isFaderIncreasing: false,
    centerPointOpacity: 0,
    centerWasJustSet: false,

    // Viewport dimensions
    longEdge: 0,
    shortEdge: 0,
    circleRad: 0,
    vMax: 0,

    // Center point tracking
    centerX: 0,
    centerY: 0,
    isCenteringMode: false,

    // Pattern configuration
    selectedPalette: 0,
    rotationModeIndex: -1,
  };

  // Lifecycle Methods
  function preload() {
    state.bg = p5.loadImage(BACKGROUND_IMAGE);
  }

  async function setup() {
    setupToolbarActions();
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    p5.pixelDensity(1);

    // Create and initialize graphics layer
    state.drawLayer = p5.createGraphics(p5.width, p5.height);
    state.drawLayer.colorMode(p5.RGB, 255, 255, 255, 1000);
    state.drawLayer.strokeCap(p5.PROJECT);

    state.vMax = calcViewportDimensions().vMax;

    state.rotationModeIndex = -1;
    reset();
  }

  function draw() {
    if (state.centerPointOpacity > 5) {
      // Only draw if opacity is meaningful
      render();
      state.centerPointOpacity -= 5;
      p5.fill(255, state.centerPointOpacity);
      p5.noStroke();
      p5.ellipse(
        state.centerX,
        state.centerY,
        (255 - state.centerPointOpacity) / 4,
        (255 - state.centerPointOpacity) / 4
      );
    } else if (state.centerPointOpacity > 0) {
      // When we get below threshold, just set to 0 without drawing
      state.centerPointOpacity = 0;
      render(); // Final render without the circle
    }
  }

  function reset() {
    // Cycle through rotationModeIndexs and palettes
    state.rotationModeIndex =
      (state.rotationModeIndex + 1) % ROTATION_MODES.length;
    state.selectedPalette = (state.selectedPalette + 1) % PALETTES.length;

    setSwatchColors();

    // Calculate dimensions
    const { vMax } = calcViewportDimensions();
    state.vMax = vMax;
    calculateCanvasDimensions();

    // Reset drawing state
    state.drawLayer.clear();
    changeBrush(0);
    clearActiveButtonState();
    render();
  }

  function calculateCanvasDimensions() {
    if (p5.width > p5.height) {
      state.longEdge = p5.width;
      state.shortEdge = p5.height;
      state.circleRad = state.shortEdge * 0.45;
    } else {
      state.longEdge = p5.height;
      state.shortEdge = p5.width;
      state.circleRad = state.shortEdge * 0.45;
    }
    state.centerX = p5.width / 2;
    state.centerY = p5.height / 2;
  }

  function makeDrawing(currentX, currentY, previousX, previousY) {
    const numberOfRotations = ROTATION_MODES[state.rotationModeIndex];

    if (state.selectedBrush > 0) {
      for (let i = 0; i < numberOfRotations; i++) {
        state.drawLayer.push();
        state.drawLayer.translate(state.centerX, state.centerY);
        state.drawLayer.rotate((p5.TWO_PI / numberOfRotations) * i);
        state.drawLayer.translate(-state.centerX, -state.centerY);
        applyBrush(currentX, currentY, previousX, previousY);
        state.drawLayer.pop();
      }
    } else {
      applyBrush(currentX, currentY, previousX, previousY);
    }
  }

  function applyBrush(currentX, currentY, previousX, previousY) {
    switch (state.selectedBrush) {
      case 0:
        handleEraser(currentX, currentY);
        break;

      case 1:
        handleSimpleLineBrush(currentX, currentY, previousX, previousY);
        break;

      case 2:
        handleFaderBrush(currentX, currentY, previousX, previousY);
        break;

      case 3:
        handleScatterBrush(currentX, currentY, previousX, previousY);
        break;

      case 4:
        handleDotBrush(currentX, currentY);
        break;

      case 5:
        handleThickLineBrush(currentX, currentY, previousX, previousY);
        break;

      default:
        console.warn("Invalid brush selected:", state.selectedBrush);
        break;
    }
  }

  function handleEraser(currentX, currentY) {
    state.drawLayer.erase();
    state.drawLayer.noStroke();
    state.drawLayer.ellipse(currentX, currentY, state.vMax * 4, state.vMax * 4);
    state.drawLayer.noErase();
  }

  function handleSimpleLineBrush(currentX, currentY, previousX, previousY) {
    state.drawLayer.strokeWeight(
      p5.constrain(p5.abs(currentY + currentX - (previousX + previousY)), 3, 4)
    );
    state.drawLayer.line(currentX, currentY, previousX, previousY);
  }

  function handleFaderBrush(currentX, currentY, previousX, previousY) {
    if (state.faderStart <= 0) state.isFaderIncreasing = false;
    if (state.faderStart >= 1000) state.isFaderIncreasing = true;

    state.faderStart += state.isFaderIncreasing === false ? 20 : -20;

    state.drawLayer.stroke(
      colorAlpha(
        p5,
        PALETTES[state.selectedPalette][1],
        0.25 + state.faderStart / 2000
      )
    );
    state.drawLayer.line(currentX, currentY, previousX, previousY);
  }

  function handleScatterBrush(currentX, currentY, previousX, previousY) {
    for (let i = 0; i < 10; i++) {
      const randX = p5.randomGaussian(-5, 5);
      const randY = p5.randomGaussian(-5, 5);
      state.drawLayer.line(
        currentX + randX,
        currentY + randY,
        previousX + randX,
        previousY + randY
      );
    }
  }

  function handleDotBrush(currentX, currentY) {
    for (let i = 0; i < 4; i++) {
      state.drawLayer.point(
        currentX + p5.randomGaussian(-4, 4),
        currentY + p5.randomGaussian(-4, 4)
      );
    }
  }

  function handleThickLineBrush(currentX, currentY, previousX, previousY) {
    state.drawLayer.strokeWeight(
      p5.constrain(
        p5.abs(currentY + currentX - (previousX + previousY)),
        30,
        40
      )
    );
    state.drawLayer.line(currentX, currentY, previousX, previousY);
  }

  function reCenter(e) {
    if (e) e.stopPropagation();
    state.isCenteringMode = true;
  }

  function setNewCenterPoint() {
    state.isCenteringMode = false;
    state.centerX = p5.mouseX;
    state.centerY = p5.mouseY;
    state.centerPointOpacity = 255;
    clearActiveButtonState();
    render();
  }

  function render() {
    p5.image(state.bg, 0, 0, p5.width, p5.height);
    p5.image(state.drawLayer, 0, 0, p5.width, p5.height);
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    const { dimensions, resizedLayers } = handleResize(p5, [
      state.bg,
      state.drawLayer,
    ]);

    [state.bg, state.drawLayer] = resizedLayers;
    state.vMax = dimensions.vMax;

    calculateCanvasDimensions();
    state.drawLayer.strokeCap(p5.SQUARE);
    render();
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const brushButtons = toolbar.querySelectorAll("[data-brush]");
    brushButtons.forEach((button) => {
      addInteractionHandlers(button, (event) => {
        const brushNumber = parseInt(button.getAttribute("data-brush"));
        changeBrush(brushNumber, event);
      });
    });

    const newCenterButton = toolbar.querySelector(
      '[data-element="new-center-button"]'
    );
    if (newCenterButton) {
      addInteractionHandlers(newCenterButton, (event) => {
        reCenter(event);
      });
    }
  }

  function setSwatchColors() {
    const swatchButtons = document.querySelectorAll('[data-element="swatch"]');
    swatchButtons.forEach((swatch, index) => {
      swatch.style.backgroundColor = PALETTES[state.selectedPalette][index];
    });
  }

  function changeBrush(brushSel, e) {
    if (e) e.stopPropagation();

    state.selectedBrush = brushSel;
    configureBrushStyle();
  }

  function configureBrushStyle() {
    const currentPalette = PALETTES[state.selectedPalette];

    switch (state.selectedBrush) {
      case 0:
        // Empty case - no stroke settings for eraser
        break;

      case 1:
        state.drawLayer.stroke(currentPalette[0]);
        break;

      case 2:
        state.drawLayer.strokeWeight(12);
        break;

      case 3:
        state.drawLayer.strokeWeight(2);
        state.drawLayer.stroke(colorAlpha(p5, currentPalette[2], 0.6));
        break;

      case 4:
        state.drawLayer.strokeWeight(8);
        state.drawLayer.stroke(colorAlpha(p5, currentPalette[3], 0.55));
        break;

      case 5:
        state.drawLayer.stroke(colorAlpha(p5, currentPalette[4], 0.5));
        break;

      default:
        console.warn("Invalid brush selected:", state.selectedBrush);
        break;
    }
  }

  // Event handlers
  function handlePointerStart(e) {
    if (e && isClickOnButton(e)) return false;

    state.faderStart = 600;

    if (state.isCenteringMode) {
      setNewCenterPoint();
      state.centerWasJustSet = true;
      return false;
    }

    return false;
  }

  function handlePointerEnd() {
    if (state.centerWasJustSet) {
      state.centerWasJustSet = false;
      return false;
    }
  }

  function handleMove(currentX, currentY, previousX, previousY, event) {
    if (event && isClickOnButton(event)) return false;

    if (state.isCenteringMode || state.centerWasJustSet) {
      return false;
    }

    makeDrawing(currentX, currentY, previousX, previousY);
    render();

    return false;
  }

  return {
    preload,
    setup,
    draw,
    reset,
    makeDrawing,
    render,
    windowResized,
    handlePointerStart,
    handlePointerEnd,
    handleMove,
    reCenter,
    changeBrush,
  };
}
