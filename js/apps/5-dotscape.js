import { calcViewportDimensions, handleResize } from "../utils/viewport.js";
import { addInteractionHandlers } from "../utils/events.js";

/**
 * Creates a fully encapsulated Dotscape sketch.
 *
 * @param {p5} p5 - The p5 instance to use for sketch creation
 * @returns {{
 *   preload: () => Promise<void>,
 *   setup: () => Promise<void>,
 *   reset: () => void,
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
 *   ) => boolean
 * }} An object containing sketch lifecycle and interaction methods:
 *   - preload: Loads background paper texture
 *   - setup: Initializes canvas, graphics layers, and color settings
 *   - reset: Updates dimensions and starts new drawing stage
 *   - render: Renders all layers with dots and interaction effects
 *   - windowResized: Handles canvas resizing and grid recalculation
 *   - handlePointerStart: Initializes color selection from dots
 *   - handlePointerEnd: Finalizes line drawing and clears temp layer
 *   - handleMove: Updates line drawing and handles dot connections
 */
export function createDotscape(p5) {
  const BACKGROUND_IMAGE = `${
    import.meta.env.BASE_URL
  }images/5-dotscape_paper.webp`;
  const PRIMARY_COLORS = [360, 60, 240]; // RGB in HSB terms

  const state = {
    // Layers
    bg: null,
    lineLayer: null,
    permaLine: null,
    tintedBG: null,

    // Drawing state
    stage: 0,
    dots: [],
    totalDots: 0,
    connectedDotsCount: 0,
    isMousedown: false,

    // Position tracking
    currentDotX: 0,
    currentDotY: 0,
    previousDotX: 0,
    previousDotY: 0,
    lastClickedDotX: 0,
    lastClickedDotY: 0,

    // Color state
    currentHue: 360,
    currentSaturation: 100,
    currentBrightness: 100,
    lastDotColor: 360,

    // Animation state
    animationRadius: 40,
    animationOpacity: 20,

    // Viewport dimensions
    width: 0,
    height: 0,
    vMax: 0,
    circleRad: 0,

    // Data storage
    lineStore: [],
    pointStore: [],
  };

  class Dot {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.radius = r;
      this.hue = PRIMARY_COLORS[p5.int(p5.random(0, 3))];
      this.saturation = 0;
      this.brightness = p5.random(80, 255);
    }

    show() {
      p5.noStroke();
      p5.fill(this.hue, this.saturation, this.brightness * 0.9, 100);
      p5.ellipse(this.x, this.y, this.radius * 3);
      p5.fill(this.hue, this.saturation, this.brightness * 0.65, 100);
      p5.ellipse(this.x, this.y, this.radius * 2.5);
      p5.fill(this.hue, this.saturation, this.brightness * 0.4, 100);
      p5.ellipse(this.x, this.y, this.radius * 2);
    }

    getCol(x, y) {
      let d = p5.dist(x, y, this.x, this.y);
      if (
        d < this.radius * 4 &&
        (this.x != state.lastClickedDotX || this.y != state.lastClickedDotY)
      ) {
        state.currentHue = this.hue;
        state.lastDotColor = this.hue;
        this.saturation = 255;
      }
    }

    clicked(x, y) {
      let rMultiplier = 1.5;
      let d = p5.dist(x, y, this.x, this.y);
      if (state.connectedDotsCount === 0) {
        rMultiplier = 1.2; // increase radius for first grab
      }
      if (
        d < this.radius * 2.05 * rMultiplier &&
        (this.x != state.lastClickedDotX || this.y != state.lastClickedDotY)
      ) {
        // Update position tracking
        state.lastClickedDotX = this.x;
        state.lastClickedDotY = this.y;
        state.previousDotX = state.currentDotX;
        state.previousDotY = state.currentDotY;
        state.currentDotX = this.x;
        state.currentDotY = this.y;
        state.connectedDotsCount++;
        state.animationOpacity = 20;
        state.animationRadius = 60;

        // Calculate blended color for this dot
        if (state.currentHue != this.hue) {
          if (p5.abs(state.currentHue - this.hue) > 280) {
            this.hue = ((this.hue + state.currentHue) / 2 - 180) % 360;
          } else {
            this.hue = ((this.hue + state.currentHue) / 2) % 360;
          }
        }

        // Update the global color state and dot appearance
        state.currentHue = this.hue;
        this.saturation = state.currentSaturation;
        this.brightness = state.currentBrightness;

        // Set the lastDotColor to the blended color
        state.lastDotColor = this.hue;
        copyLine();
      }
    }
  }

  function preload() {
    state.bg = p5.loadImage(BACKGROUND_IMAGE);
  }

  async function setup() {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    state.lineLayer = p5.createGraphics(p5.width, p5.height);
    state.permaLine = p5.createGraphics(p5.width, p5.height);
    state.tintedBG = p5.createGraphics(p5.width, p5.height);

    p5.pixelDensity(1);

    p5.blendMode(p5.BLEND);
    state.lineLayer.blendMode(p5.BLEND);
    state.permaLine.blendMode(p5.BLEND);

    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    state.lineLayer.colorMode(p5.HSB, 360, 100, 100, 100);
    state.permaLine.colorMode(p5.HSB, 360, 100, 100, 100);

    windowResized();
    reset();
  }

  function reset() {
    const dimensions = calcViewportDimensions();
    state.width = dimensions.width;
    state.height = dimensions.height;
    state.vMax = dimensions.vMax;
    calcCircleRadius();

    state.lineStore = [];
    state.pointStore = [];
    state.lastDotColor = 360;
    state.currentHue = 360;

    nextDrawing();
    render();
  }

  function restart() {
    state.stage = 0;
    calcViewportDimensions();
    nextDrawing();
  }

  function nextDrawing(advanceStage = true) {
    state.connectedDotsCount = 0;
    state.totalDots = 0;
    state.animationRadius = 40;
    state.animationOpacity = 0;
    // Reset to defaults
    state.lastDotColor = 360;
    state.currentHue = 360;

    // Clear all drawing layers
    state.permaLine.clear();
    state.lineLayer.clear();
    state.tintedBG.clear();

    // Determine which grid to generate based on stage
    switch (true) {
      case state.stage < 3:
        stage0grid();
        break;
      case state.stage < 6:
        stage1grid();
        break;
      case state.stage < 8:
        stage2grid();
        break;
      case state.stage < 9:
        stage3grid();
        break;
      case state.stage < 11:
        stage4grid();
        break;
      case state.stage < 13:
        stage5grid();
        break;
    }

    state.tintedBG.image(state.bg, 0, 0, state.width, state.height);
    state.tintedBG.fill(0, 20 * state.stage);
    state.tintedBG.rect(0, 0, state.width, state.height);

    if (advanceStage) {
      state.stage++;
    }
    render();
  }

  function copyLine() {
    state.permaLine.colorMode(p5.HSB, 360, 100, 100, 100);
    state.permaLine.blendMode(p5.BLEND);

    state.permaLine.stroke(state.lastDotColor, 100, 100, 100);
    state.permaLine.strokeWeight(6);

    if (state.connectedDotsCount > 1) {
      const x1 = state.currentDotX;
      const y1 = state.currentDotY;
      const x2 = state.previousDotX;
      const y2 = state.previousDotY;
      state.permaLine.line(x1, y1, x2, y2);

      state.lineStore.push({
        line: { x1, y1, x2, y2 },
        points: state.pointStore,
        stage: state.stage,
      });
      state.pointStore = [];
    }
  }

  function calcCircleRadius() {
    state.circleRad =
      state.width > state.height ? state.height * 0.45 : state.width * 0.45;
  }

  function handlePointerStart(event) {
    if (event.target.closest(".btn")) return false;

    state.isMousedown = true;
    state.connectedDotsCount = 0;
    state.lastDotColor = state.currentHue; // Initialize with current color

    for (let i = 0; i < state.totalDots; i++) {
      state.dots[i].getCol(p5.winMouseX, p5.winMouseY);
    }

    return false;
  }

  function handlePointerEnd() {
    state.isMousedown = false;
    state.connectedDotsCount = 1;
    state.lineLayer.clear();
    render();
  }

  function handleMove(currentX, currentY, previousX, previousY, event) {
    if (!state.isMousedown) return;

    if (event.preventDefault) {
      event.preventDefault();
    }

    for (let i = 0; i < state.totalDots; i++) {
      state.dots[i].clicked(p5.winMouseX, p5.winMouseY);
    }

    // Use the last dot's color for the temporary line
    state.lineLayer.colorMode(p5.HSB, 360, 100, 100, 100);
    state.lineLayer.blendMode(p5.BLEND);
    state.lineLayer.stroke(state.lastDotColor, 100, 100, 100);
    state.lineLayer.strokeWeight(8);
    state.lineLayer.clear();

    if (state.connectedDotsCount > 0) {
      state.lineLayer.line(
        state.currentDotX,
        state.currentDotY,
        p5.winMouseX,
        p5.winMouseY
      );
    }

    const time = new Date().getTime();
    const pressure =
      event.touches &&
      event.touches[0] &&
      typeof event.touches[0]["force"] !== "undefined"
        ? event.touches[0]["force"]
        : 1.0;
    state.pointStore.push({ time, x: p5.mouseX, y: p5.mouseY, pressure });

    render();
    return false;
  }

  function windowResized() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    const { dimensions, resizedLayers } = handleResize(p5, [
      state.lineLayer,
      state.permaLine,
      state.tintedBG,
    ]);

    [state.lineLayer, state.permaLine, state.tintedBG] = resizedLayers;
    state.width = dimensions.width;
    state.height = dimensions.height;
    state.vMax = dimensions.vMax;

    calcCircleRadius();
    nextDrawing(false); // Don't advance stage when resizing
  }

  function render() {
    p5.noTint();
    p5.image(state.tintedBG, 0, 0, state.width, state.height);
    p5.image(state.lineLayer, 0, 0);
    p5.image(state.permaLine, 0, 0);

    p5.fill(255, state.animationOpacity--);

    if (state.animationRadius < 200) {
      p5.circle(state.currentDotX, state.currentDotY, state.animationRadius++);
    }

    for (let i = 0; i < state.totalDots; i++) {
      state.dots[i].show();
    }
  }

  function stage0grid() {
    const manualArray = [
      [1, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 4, 7],
      [1, 1, 2, 1, 3, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 2, 7, 3, 7, 4, 7],
      [
        1, 1, 3, 1, 2, 2, 4, 2, 1, 3, 3, 3, 2, 4, 4, 4, 1, 5, 3, 5, 2, 6, 4, 6,
        1, 7, 3, 7, 2, 8, 4, 8,
      ],
    ];

    state.dots = [];
    const w = state.width / 5;
    const h = state.height / 9;
    const r = state.vMax * 2;
    const currentArray = manualArray[state.stage];

    for (let i = 0; i < currentArray.length; i += 2) {
      state.dots[state.totalDots++] = new Dot(
        currentArray[i] * w,
        currentArray[i + 1] * h,
        r
      );
    }
  }

  function stage1grid() {
    state.dots = [];
    let dotQtyX, dotQtyY, r, spaceX, spaceY;

    switch (state.stage) {
      case 3:
        dotQtyX = 7;
        dotQtyY = 9;
        r = state.vMax * 1.2;
        spaceX = state.width / dotQtyX + 4;
        spaceY = state.height / dotQtyY + 4;

        for (let i = 0; i < dotQtyX; i++) {
          for (let j = 0; j < dotQtyY; j++) {
            state.dots[state.totalDots++] = new Dot(
              (i + 1) * spaceX,
              (j + 1) * spaceY,
              r
            );
          }
        }
        break;

      case 4:
      case 5:
        dotQtyX = state.stage === 4 ? 2 : 4;
        dotQtyY = state.stage === 4 ? 5 * 4 : 13 * 4;
        r = state.stage === 4 ? state.vMax : state.vMax * 0.5;
        spaceX = state.width / dotQtyX + 2;
        spaceY = state.height / dotQtyY + 2;

        for (let i = 0; i < dotQtyX; i++) {
          for (let j = 0; j < dotQtyY; j += 4) {
            state.dots[state.totalDots++] = new Dot(
              (i + 0.5) * spaceX - spaceX / 6,
              (j + 0.5) * spaceY,
              r
            );
            state.dots[state.totalDots++] = new Dot(
              (i + 0.5) * spaceX + spaceX / 6,
              (j + 0.5) * spaceY,
              r
            );
            state.dots[state.totalDots++] = new Dot(
              (i + 0.5) * spaceX - spaceX / 3,
              (j + 0.5) * spaceY + spaceY * 2,
              r
            );
            state.dots[state.totalDots++] = new Dot(
              (i + 0.5) * spaceX + (spaceX / 6) * 2,
              (j + 0.5) * spaceY + spaceY * 2,
              r
            );
          }
        }
        break;
    }
  }

  function stage2grid() {
    const r = state.vMax;
    const ringQty = 1;
    const dotQty = state.stage === 6 ? 7 : 10;

    for (let i = 0; i < ringQty; i++) {
      for (let j = 0; j < dotQty; j++) {
        const rotateVal = j * (360 / dotQty);
        const tran = (state.circleRad / ringQty) * (i + 1);
        const tempX = tran * p5.cos(p5.radians(rotateVal)) + state.width / 2;
        const tempY = tran * p5.sin(p5.radians(rotateVal)) + state.height / 2;
        state.dots[state.totalDots++] = new Dot(tempX, tempY, r);
      }
    }
  }

  function stage3grid() {
    const ringQty = 3;
    const dotQty = 7;
    let r = state.vMax * 0.75;

    for (let i = 0; i < ringQty; i++) {
      for (let j = 0; j < dotQty + i * 3; j++) {
        const rotateVal = j * (360 / (dotQty + i * 3));
        const tran = (state.circleRad / ringQty) * (i + 1);
        const tempX = tran * p5.cos(p5.radians(rotateVal)) + state.width / 2;
        const tempY = tran * p5.sin(p5.radians(rotateVal)) + state.height / 2;
        r = r - r / 100;
        state.dots[state.totalDots++] = new Dot(tempX, tempY, r);
      }
    }
  }

  function stage4grid() {
    const dotQty = state.stage === 9 ? 50 : 100;
    let r = state.stage === 9 ? state.vMax * 0.6 : state.vMax * 0.5;
    const gap = state.circleRad * (state.stage === 9 ? 0.9 : 0.7);
    const remainder = state.circleRad - gap;

    for (let i = 0; i < dotQty; i++) {
      const rotateVal = i * 137.5;
      const tran = (gap / dotQty) * (i + 1) + remainder;
      const tempX = tran * p5.cos(p5.radians(rotateVal)) + state.width / 2;
      const tempY = tran * p5.sin(p5.radians(rotateVal)) + state.height / 2;
      r = r + (i / 40000) * state.vMax;
      state.dots[state.totalDots++] = new Dot(tempX, tempY, r);
    }
  }

  function stage5grid() {
    if (state.stage === 12) {
      restart();
      return;
    }

    const x = 7 + (state.stage - 11) * 5;
    const y = 7 + (state.stage - 11) * 5;
    const noiseAmp = 8 + (state.stage - 11) * 10;
    const dotSize = 5 - (state.stage - 11);

    const spaceX = state.width / (x + 2);
    const spaceY = state.height / (y + 2);

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const noiseX = p5.int(
          (p5.random(-state.width, state.width) * noiseAmp) / 150
        );
        const noiseY = p5.int(
          (p5.random(-state.height, state.height) * noiseAmp) / 150
        );
        const r = p5.random(
          state.vMax * (dotSize / 10),
          state.vMax * (dotSize / 10) * 2
        );

        state.dots[state.totalDots++] = new Dot(
          noiseX + spaceX * 1.5 + spaceX * i,
          noiseY + spaceY * 1.5 + spaceY * j,
          r
        );
      }
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
