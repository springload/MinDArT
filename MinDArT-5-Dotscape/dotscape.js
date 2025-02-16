// stages are used to track each set of dots
let stage = 1;

// dot tracking
let dots = [],
  throughDotCount = 0,
  dotSize,
  dotQty,
  ringQty;

// mouse/geometry tracking
let isMousedown,
  tempwinMouseX,
  tempwinMouseY,
  tempwinMouseX2,
  tempwinMouseY2,
  verifyX = 0,
  verifyY = 0,
  vMax,
  circleRad,
  rad = 50.0; // animatedRadius

// colour tracking
let hueDrift,
  brightDrift,
  satDrift,
  primaryArray = [360, 60, 240], // RGB in HSB terms
  colHue = 360,
  colSat = 100,
  colBri = 100,
  tintedBG,
  appCol;

// intro tracking
let xintro = [],
  yintro = [],
  direction = 0,
  introHue = 0,
  demoStage = 0,
  finger_x = 0,
  finger_xEased = 0,
  expansion = 0.1,
  hitRad = 40,
  tempOpacity = 20,
  intro_X = 0, // used for colour dots
  cycle_count = 0;

// intro and UI tracking
let introText = ["Touch and Listen", "Look", "Draw"],
  slide = 4,
  delayTime = 15000,
  introComplete = 0;

//DATA
let lineStore;
let pointStore;

function preload() {
  bg = loadImage("assets/paper.jpg");
}

async function setup() {
  await initAudio("5_Dot");
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls(nextDrawing);
  initializeToolbarButtons();
  // create canvas and all layers
  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );
  lineLayer = createGraphics(width, height);
  permaLine = createGraphics(width, height);
  tintedBG = createGraphics(width, height);

  // initialise all colour informaiton
  pixelDensity(1); // Ignores retina displays
  colorMode(HSB, 360, 100, 100, 100);
  appCol = color(205, 12, 64, 0.1);
  lineLayer.colorMode(HSB, 360, 100, 100, 100);
  permaLine.colorMode(HSB, 360, 100, 100, 100);
}

function start() {
  playSoundtrack();
  sizeWindow();
  reset();
}

function reset() {
  // initialised dimensions and start intro
  ({ width, height, vMax } = calcViewportDimensions());
  calcCircleRadius();
  intro_X = width * 0.3 - 100;

  setupCanvasEventListeners();

  //DATA
  lineStore = [];
  pointStore = [];

  render();
}

function calcCircleRadius() {
  if (width > height) {
    circleRad = height * 0.45;
  } else {
    circleRad = width * 0.45;
  }
}

function windowResized() {
  sizeWindow();
}

function sizeWindow() {
  resizeCanvas(windowWidth, windowHeight);

  const { dimensions, resizedLayers } = handleResize([
    lineLayer,
    permaLine,
    tintedBG,
  ]);
  [lineLayer, permaLine, tintedBG] = resizedLayers;
  ({ vMax, width, height } = dimensions);
  calcCircleRadius();
  stage--;
  nextDrawing();
}

function touchdown() {
  isMousedown = 1;
  throughDotCount = 0;

  let _x = winMouseX;
  let _y = winMouseY;

  for (let i = 0; i < dotsCount; i++) {
    dots[i].getCol(_x, _y);
  }

  return false;
}

function touchstop() {
  isMousedown = 0;
  throughDotCount = 1;
  lineLayer.clear();
  render();
}

function moved(ev) {
  if (!isMousedown) return;

  preventDefault(ev);

  for (let i = 0; i < dotsCount; i++) {
    dots[i].clicked(winMouseX, winMouseY);
  }

  lineLayer.stroke(colHue, colSat, colBri, 80);
  lineLayer.strokeWeight(8);
  lineLayer.clear();

  //if (throughDotCount > 0) {  // removed in response to line issues
  lineLayer.line(tempwinMouseX, tempwinMouseY, winMouseX, winMouseY);
  //}

  // DATA
  const time = new Date().getTime();
  const pressure = getPressure(ev);
  pointStore.push({ time, x: mouseX, y: mouseY, pressure });

  render();

  return false;
}

function preventDefault(ev) {
  if (ev.preventDefault) {
    ev.preventDefault();
  } else {
    ev.returnValue = false;
  }
}

function render() {
  image(tintedBG, 0, 0, width, height);
  image(lineLayer, 0, 0);
  image(permaLine, 0, 0);
  fill(255, tempOpacity--);
  // small animation that fires when dot is selected
  if (hitRad < 200) {
    circle(tempwinMouseX, tempwinMouseY, hitRad++);
  }
  // show all dots under this stage
  for (let i = 0; i < dotsCount; i++) {
    dots[i].show();
  }
}

function copyLine() {
  permaLine.stroke(colHue, colSat, colBri, 80);
  permaLine.strokeWeight(6);
  if (throughDotCount > 1) {
    let x1 = tempwinMouseX;
    let y1 = tempwinMouseY;
    let x2 = tempwinMouseX2;
    let y2 = tempwinMouseY2;
    permaLine.line(x1, y1, x2, y2);
    //DATA
    lineStore.push({
      line: {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
      },
      points: pointStore,
      stage: stage,
    });
    pointStore = [];
  }
}

getPressure = function (ev) {
  return ev.touches &&
    ev.touches[0] &&
    typeof ev.touches[0]["force"] !== "undefined"
    ? ev.touches[0]["force"]
    : 1.0;
};

// Dot class, not used in intro
class Dot {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.h = primaryArray[int(random(0, 3))];
    this.s = 0;
    this.b = random(80, 255);
  }
  show() {
    noStroke();
    fill(this.h, this.s, this.b * 0.9, 100);
    ellipse(this.x, this.y, this.r * 3);
    fill(this.h, this.s, this.b * 0.65, 100);
    ellipse(this.x, this.y, this.r * 2.5);
    fill(this.h, this.s, this.b * 0.4, 100);
    ellipse(this.x, this.y, this.r * 2);
  }
  getCol(x, y) {
    let d = dist(x, y, this.x, this.y);
    if (d < this.r * 4 && (this.x != verifyX || this.y != verifyY)) {
      colHue = this.h;
      this.s = 255;
    }
  }
  clicked(x, y) {
    let rMultiplier = 1.5;
    let d = dist(x, y, this.x, this.y);
    if (throughDotCount === 0) {
      rMultiplier = 1.2; // increase radius for first grab
    }
    if (
      d < this.r * 2.05 * rMultiplier &&
      (this.x != verifyX || this.y != verifyY)
    ) {
      verifyX = this.x;
      verifyY = this.y;
      tempwinMouseX2 = tempwinMouseX;
      tempwinMouseY2 = tempwinMouseY;
      tempwinMouseX = this.x;
      tempwinMouseY = this.y;
      throughDotCount++;
      tempOpacity = 20;
      hitRad = 60;

      if (colHue != this.h) {
        if (abs(colHue - this.h) > 280) {
          this.h = ((this.h + colHue) / 2 - 180) % 360;
        } else {
          this.h = ((this.h + colHue) / 2) % 360;
        }
      }
      colHue = this.h;
      this.s = colSat;
      this.b = colBri;
      copyLine();
    }
  }
}

function restart() {
  stage = 0; // ⚠️ this is different from the value at initialization (1)
  calcViewportDimensions();
  nextDrawing();
}

function nextDrawing() {
  throughDotCount = 0;
  dotsCount = 0;
  permaLine.clear();
  lineLayer.clear();
  if (stage < 3) {
    stage0grid();
  } else if (stage >= 3 && stage < 6) {
    stage1grid();
  } else if (stage >= 6 && stage < 8) {
    stage2grid();
  } else if (stage >= 8 && stage < 9) {
    stage3grid();
  } else if (stage >= 9 && stage < 11) {
    stage4grid();
  } else if (stage >= 11 && stage < 13) {
    stage5grid();
  }
  tintedBG.image(bg, 0, 0, width, height);
  tintedBG.fill(0, 20 * stage);
  tintedBG.rect(0, 0, width, height);
  stage++;
  render();
}

function stage0grid() {
  let manualArray = [
    [1, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 4, 7],
    [1, 1, 2, 1, 3, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 2, 7, 3, 7, 4, 7],
    [
      1, 1, 3, 1, 2, 2, 4, 2, 1, 3, 3, 3, 2, 4, 4, 4, 1, 5, 3, 5, 2, 6, 4, 6, 1,
      7, 3, 7, 2, 8, 4, 8,
    ],
  ];
  dots = [];
  let w = width / 5;
  let h = height / 9;
  let r = vMax * 2;
  dotQtyY = manualArray[stage].length / 2;
  for (let i = 0; i < manualArray[stage].length; i += 2) {
    dots[dotsCount++] = new Dot(
      manualArray[stage][i] * w,
      manualArray[stage][i + 1] * h,
      r
    );
  }
}

function stage1grid() {
  dots = [];
  if (stage === 3) {
    dotQtyX = 7;
    dotQtyY = 9;
    r = vMax * 1.2;
    let spaceX = width / dotQtyX + 4;
    let spaceY = height / dotQtyY + 4;
    for (let i = 0; i < dotQtyX; i++) {
      for (let j = 0; j < dotQtyY; j++) {
        dots[dotsCount++] = new Dot((i + 1) * spaceX, (j + 1) * spaceY, r);
      }
    }
  } else if (stage === 4) {
    dotQtyX = 2;
    dotQtyY = 5 * 4;
    r = vMax * 1;
    let spaceX = width / dotQtyX + 2;
    let spaceY = height / dotQtyY + 2;
    for (let i = 0; i < dotQtyX; i++) {
      for (let j = 0; j < dotQtyY; j += 4) {
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX - spaceX / 6,
          (j + 0.5) * spaceY,
          r
        );
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX + spaceX / 6,
          (j + 0.5) * spaceY,
          r
        );
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX - spaceX / 3,
          (j + 0.5) * spaceY + spaceY * 2,
          r
        );
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX + (spaceX / 6) * 2,
          (j + 0.5) * spaceY + spaceY * 2,
          r
        );
      }
    }
  } else if (stage === 5) {
    dotQtyX = 4;
    dotQtyY = 13 * 4;
    r = vMax * 0.5;
    let spaceX = width / dotQtyX + 2;
    let spaceY = height / dotQtyY + 2;
    for (let i = 0; i < dotQtyX; i++) {
      for (let j = 0; j < dotQtyY; j += 4) {
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX - spaceX / 6,
          (j + 0.5) * spaceY,
          r
        );
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX + spaceX / 6,
          (j + 0.5) * spaceY,
          r
        );
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX - spaceX / 3,
          (j + 0.5) * spaceY + spaceY * 2,
          r
        );
        dots[dotsCount++] = new Dot(
          (i + 0.5) * spaceX + (spaceX / 6) * 2,
          (j + 0.5) * spaceY + spaceY * 2,
          r
        );
      }
    }
  }
}

function stage2grid() {
  let r = vMax;
  ringQty = 1;
  if (stage === 6) {
    dotQty = 7;
  }
  if (stage === 7) {
    dotQty = 10;
  }
  for (let i = 0; i < ringQty; i++) {
    for (let j = 0; j < dotQty; j++) {
      let rotateVal = j * (360 / dotQty);
      let tran = (circleRad / ringQty) * (i + 1);
      let tempX = tran * cos(radians(rotateVal)) + width / 2;
      let tempY = tran * sin(radians(rotateVal)) + height / 2;
      dots[dotsCount++] = new Dot(tempX, tempY, r);
    }
  }
}

function stage3grid() {
  let r = vMax;
  if (stage === 8) {
    dotQty = 7;
    ringQty = 3;
    r = vMax * 0.75;
  }
  for (let i = 0; i < ringQty; i++) {
    for (let j = 0; j < dotQty + i * 3; j++) {
      let rotateVal = j * (360 / (dotQty + i * 3));
      let tran = (circleRad / ringQty) * (i + 1);
      let tempX = tran * cos(radians(rotateVal)) + width / 2;
      let tempY = tran * sin(radians(rotateVal)) + height / 2;
      r = r - r / 100;
      dots[dotsCount++] = new Dot(tempX, tempY, r);
    }
  }
}

function stage4grid() {
  let r = vMax;
  let gap;
  let remainder;
  if (stage === 9) {
    dotQty = 50;
    r = vMax * 0.6;
    gap = circleRad * 0.9;
    remainder = circleRad - gap;
  }
  if (stage === 10) {
    dotQty = 100;
    r = vMax * 0.5;
    gap = circleRad * 0.7;
    remainder = circleRad - gap;
  }
  for (let i = 0; i < dotQty; i++) {
    let rotateVal = i * 137.5;
    let tran = (gap / dotQty) * (i + 1) + remainder;
    let tempX = tran * cos(radians(rotateVal)) + width / 2;
    let tempY = tran * sin(radians(rotateVal)) + height / 2;
    r = r + (i / 40000) * vMax;
    dots[dotsCount++] = new Dot(tempX, tempY, r);
  }
}

function stage5grid() {
  if (stage === 11) {
    x = 7;
    y = 7;
    noiseAmp = 8;
    dotSize = 5;
  } else if (stage === 12) {
    restart();
  }
  dotQtyX = x;
  dotQtyY = y;
  spaceX = width / (dotQtyX + 2);
  spaceY = height / (dotQtyY + 2);
  for (let i = 0; i < dotQtyX; i++) {
    for (let j = 0; j < dotQtyY; j++) {
      let noiseX = int((random(-width, width) * noiseAmp) / 150);
      let noiseY = int((random(-height, height) * noiseAmp) / 150);
      let r = random(vMax * (dotSize / 10), vMax * (dotSize / 10) * 2);
      dots[dotsCount++] = new Dot(
        noiseX + spaceX * 1.5 + spaceX * i,
        noiseY + spaceY * 1.5 + spaceY * j,
        r
      );
    }
  }
  noiseAmp += 10;
  x += 5;
  y += 5;
  dotSize--;
}

window.addEventListener("resize", windowResized);
