import { calcViewportDimensions, handleResize } from "../shared/resize.js";
import { addInteractionHandlers } from "../functions.js";

export function createDotscape(p5) {
  const BACKGROUND_IMAGE = "assets/paper.jpg";
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
    dotsCount: 0,
    throughDotCount: 0,
    isMousedown: false,

    // Position tracking
    tempwinMouseX: 0,
    tempwinMouseY: 0,
    tempwinMouseX2: 0,
    tempwinMouseY2: 0,
    verifyX: 0,
    verifyY: 0,

    // Color state
    colHue: 360,
    colSat: 100,
    colBri: 100,

    // Animation state
    hitRad: 40,
    tempOpacity: 20,

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
      this.r = r;
      this.h = PRIMARY_COLORS[p5.int(p5.random(0, 3))];
      this.s = 0;
      this.b = p5.random(80, 255);
    }

    show() {
      p5.noStroke();
      p5.fill(this.h, this.s, this.b * 0.9, 100);
      p5.ellipse(this.x, this.y, this.r * 3);
      p5.fill(this.h, this.s, this.b * 0.65, 100);
      p5.ellipse(this.x, this.y, this.r * 2.5);
      p5.fill(this.h, this.s, this.b * 0.4, 100);
      p5.ellipse(this.x, this.y, this.r * 2);
    }

    getCol(x, y) {
      let d = p5.dist(x, y, this.x, this.y);
      if (
        d < this.r * 4 &&
        (this.x != state.verifyX || this.y != state.verifyY)
      ) {
        state.colHue = this.h;
        this.s = 255;
      }
    }

    clicked(x, y) {
      let rMultiplier = 1.5;
      let d = p5.dist(x, y, this.x, this.y);
      if (state.throughDotCount === 0) {
        rMultiplier = 1.2; // increase radius for first grab
      }
      if (
        d < this.r * 2.05 * rMultiplier &&
        (this.x != state.verifyX || this.y != state.verifyY)
      ) {
        state.verifyX = this.x;
        state.verifyY = this.y;
        state.tempwinMouseX2 = state.tempwinMouseX;
        state.tempwinMouseY2 = state.tempwinMouseY;
        state.tempwinMouseX = this.x;
        state.tempwinMouseY = this.y;
        state.throughDotCount++;
        state.tempOpacity = 20;
        state.hitRad = 60;

        if (state.colHue != this.h) {
          if (p5.abs(state.colHue - this.h) > 280) {
            this.h = ((this.h + state.colHue) / 2 - 180) % 360;
          } else {
            this.h = ((this.h + state.colHue) / 2) % 360;
          }
        }
        state.colHue = this.h;
        this.s = state.colSat;
        this.b = state.colBri;
        copyLine();
      }
    }
  }

  function preload() {
    state.bg = p5.loadImage(BACKGROUND_IMAGE);
  }

  async function setup() {
    setupToolbarActions();

    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.querySelector('[data-element="canvas-container"]'));

    state.lineLayer = p5.createGraphics(p5.width, p5.height);
    state.permaLine = p5.createGraphics(p5.width, p5.height);
    state.tintedBG = p5.createGraphics(p5.width, p5.height);

    p5.pixelDensity(1);
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    state.lineLayer.colorMode(p5.HSB, 360, 100, 100, 100);
    state.permaLine.colorMode(p5.HSB, 360, 100, 100, 100);
  }

  function setupToolbarActions() {
    const toolbar = document.querySelector('[data-element="toolbar"]');
    if (!toolbar) return;

    const restartButton = toolbar.querySelector(
      '[data-element="restart-button"]'
    );
    if (restartButton) {
      addInteractionHandlers(restartButton, (event) => {
        restart();
      });
    }
  }

  function start() {
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

    nextDrawing();
    render();
  }

  function restart() {
    state.stage = 0;
    calcViewportDimensions();
    nextDrawing();
  }

  function nextDrawing(advanceStage = true) {
    state.throughDotCount = 0;
    state.dotsCount = 0;
    state.hitRad = 40;
    state.tempOpacity = 0;

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
    state.permaLine.stroke(state.colHue, state.colSat, state.colBri, 80);
    state.permaLine.strokeWeight(6);
    if (state.throughDotCount > 1) {
      const x1 = state.tempwinMouseX;
      const y1 = state.tempwinMouseY;
      const x2 = state.tempwinMouseX2;
      const y2 = state.tempwinMouseY2;
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
    state.throughDotCount = 0;

    for (let i = 0; i < state.dotsCount; i++) {
      state.dots[i].getCol(p5.winMouseX, p5.winMouseY);
    }

    return false;
  }

  function handlePointerEnd() {
    state.isMousedown = false;
    state.throughDotCount = 1;
    state.lineLayer.clear();
    render();
  }

  function handleMove(currentX, currentY, previousX, previousY, event) {
    if (!state.isMousedown) return;

    if (event.preventDefault) {
      event.preventDefault();
    }

    for (let i = 0; i < state.dotsCount; i++) {
      state.dots[i].clicked(p5.winMouseX, p5.winMouseY);
    }

    state.lineLayer.stroke(state.colHue, state.colSat, state.colBri, 80);
    state.lineLayer.strokeWeight(8);
    state.lineLayer.clear();
    state.lineLayer.line(
      state.tempwinMouseX,
      state.tempwinMouseY,
      p5.winMouseX,
      p5.winMouseY
    );

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
    p5.image(state.tintedBG, 0, 0, state.width, state.height);
    p5.image(state.lineLayer, 0, 0);
    p5.image(state.permaLine, 0, 0);
    p5.fill(255, state.tempOpacity--);

    if (state.hitRad < 200) {
      p5.circle(state.tempwinMouseX, state.tempwinMouseY, state.hitRad++);
    }

    for (let i = 0; i < state.dotsCount; i++) {
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
      state.dots[state.dotsCount++] = new Dot(
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
            state.dots[state.dotsCount++] = new Dot(
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
            state.dots[state.dotsCount++] = new Dot(
              (i + 0.5) * spaceX - spaceX / 6,
              (j + 0.5) * spaceY,
              r
            );
            state.dots[state.dotsCount++] = new Dot(
              (i + 0.5) * spaceX + spaceX / 6,
              (j + 0.5) * spaceY,
              r
            );
            state.dots[state.dotsCount++] = new Dot(
              (i + 0.5) * spaceX - spaceX / 3,
              (j + 0.5) * spaceY + spaceY * 2,
              r
            );
            state.dots[state.dotsCount++] = new Dot(
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
        state.dots[state.dotsCount++] = new Dot(tempX, tempY, r);
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
        state.dots[state.dotsCount++] = new Dot(tempX, tempY, r);
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
      state.dots[state.dotsCount++] = new Dot(tempX, tempY, r);
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

        state.dots[state.dotsCount++] = new Dot(
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
    start,
    reset,
    render,
    windowResized,
    handlePointerStart,
    handlePointerEnd,
    handleMove,
    restart,
  };
}
