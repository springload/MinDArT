// Asset configuration
let bg;
let brush = [];

// Color palettes and configuration
const cloudHSB = [
  [180, 47, 25],
  [178, 23, 55],
  [170, 15, 75],
  [164, 12, 95],
  [176, 45, 19],
];

const sunsetHSB = [
  [11, 53, 96],
  [13, 83, 91],
  [2, 90, 100],
  [334, 81, 91],
  [300, 67, 99],
];

const colourSwatch = [
  ["#F2A97E", "#F28D77", "#BF7E7E", "#7E708C", "#49538C"],
  ["#F2A74B", "#F2995E", "#D95F43", "#734663", "#2A1A40"],
  ["#F21905", "#A60303", "#027373", "#025159", "#025159"],
  ["#CFCFCF", "#88898C", "#565759", "#0D0D0D", "#00010D"],
  ["#91AA9D", "#D1DBBD", "#91AA9D", "#3E606F", "#193441"],
];

// Color state
let colHue, colSat, colBri;
const colHueMin = 0,
  colHueMax = 360;
const colSatMin = 0,
  colSatMax = 255;
const colBriMin = 0,
  colBriMax = 255;
let colOpacity = 0.4;
let colourBool = 0;
let colourLevel = 0;

// Brush mechanics
let angle1, segLength;
let scalar = 30;
let tempwinMouseX = 0;
let tempwinMouseY = 0;
let tempX = 100;
let tempY = 100;
let dx, dy;
const rotateDrift = 0.6;
const scatterAmount = 2;

// Time delay for brush
let milliCounter;
let milliTrack = 0;
const milliComp = 5;

// Canvas layers
let paintLayer, traceLayer;
let introLayer;

// Application state
let started = 0;
let bool = 1;
let brushTemp = 0;
let buttonText1state = 0;
let buttonText2state = 0;
let vMax;
let startState = 0;
let alphaErase;
let eraseState = 0;
let saveState = 1;
let buttonTEST;
let eraserVersion = 0; // erase paint = 0, erase trace = 1

// Automated drawing state
let autoX = 0,
  autoY = 0,
  pautoX = 0,
  pautoY = 0;

// Drawing modes
function paintWarm() {
  eraseState = 0;
  eraserVersion = 0;
  colourBool = false;
  bool = 1;
}

function paintCool() {
  eraseState = 0;
  eraserVersion = 0;
  colourBool = true;
  bool = 1;
}

function switchToTrace() {
  bool = 0;
  eraseState = 0;
  eraserVersion = 0;
  traceLayer.strokeWeight(8);
  traceLayer.stroke(255, 0, 255, 0.8);
}

// Eraser functions
function paintErase() {
  eraseState = 1;
  eraserVersion = true;
}

function drawErase() {
  eraseState = 1;
  eraserVersion = false;
}

function eraseDrawing() {
  if (eraserVersion) {
    paintLayer.noStroke();
    paintLayer.strokeWeight(45);
    paintLayer.stroke(255, 255, 255, 125);
    paintLayer.line(mouseX, mouseY, pmouseX, pmouseY);
  } else {
    traceLayer.blendMode(BLEND);
    traceLayer.strokeWeight(45);
    traceLayer.stroke(255, 0, 0, 0.4);
    traceLayer.line(mouseX, mouseY, pmouseX, pmouseY);
    traceLayer.blendMode(LIGHTEST);
  }
}

// p5.js lifecycle functions
function preload() {
  bg = loadImage("assets/paper.jpg");
  for (let i = 0; i < 15; i++) {
    brush[i] = loadImage("assets/Cloud" + i + ".png");
  }
}

async function setup() {
  await initAudio("4_Colour");
  setupLoadingScreen(start);
  initializeAppControls(reset);
  initializeToolbarButtons();

  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );
  paintLayer = createGraphics(width, height);
  traceLayer = createGraphics(width, height);

  pixelDensity(1);

  colHue = random(colHueMin, colHueMax);
  colSat = random(colSatMin, colSatMax);
  strokeWeight(4);
  stroke(255, 0, 255);

  setLayerProperties();
}

// Layer configuration
function setLayerProperties() {
  imageMode(CENTER);
  blendMode(BLEND);
  traceLayer.blendMode(LIGHTEST);
  colorMode(RGB, 255, 255, 255, 1);
  paintLayer.colorMode(RGB, 255, 255, 255, 255);
  traceLayer.colorMode(HSB, 360, 100, 100, 1);
  traceLayer.strokeWeight(8);
  traceLayer.stroke(255, 0, 255, 0.8);
}

// Core drawing functions
function makeDrawing(_x, _y, pX, pY) {
  milliCounter = millis();
  if (bool) {
    if (milliCounter > milliTrack + milliComp) {
      if (!colourBool) {
        let selectedNum = Math.floor(random(0, 2));
        currentColour = hexToRgb(colourSwatch[colourLevel][selectedNum]);
      } else {
        let selectedNum = Math.floor(random(3, 5));
        currentColour = hexToRgb(colourSwatch[colourLevel][selectedNum]);
      }

      dx = _x - tempX;
      dy = _y - tempY;
      angle1 = atan2(dy, dx) + random(-rotateDrift, rotateDrift);
      tempX = _x - (cos(angle1) * segLength) / 2;
      tempY = _y - (sin(angle1) * segLength) / 2;
      scalar = constrain(
        70 * (random(3, abs(_x - pX)) / windowWidth),
        0.2,
        1.2
      );
      segment(tempX, tempY, angle1, brush[brushTemp], scalar);
      milliTrack = milliCounter;
    }
  } else {
    traceLayer.line(_x, _y, pX, pY);
  }
}

// Brush segment drawing
function segment(rakeX, rakeY, a, rake, scalar) {
  currentColour.setAlpha(0.5);
  paintLayer.tint(currentColour);
  paintLayer.push();
  paintLayer.imageMode(CENTER);
  paintLayer.translate(
    rakeX +
      randomGaussian(
        -scatterAmount * (0.1 * scalar),
        scatterAmount * (0.1 * scalar)
      ),
    rakeY +
      randomGaussian(
        -scatterAmount * (0.1 * scalar),
        scatterAmount * (0.1 * scalar)
      )
  );
  paintLayer.scale(scalar);
  paintLayer.rotate(a);
  paintLayer.image(rake, 0, 0, 200, 200);
  paintLayer.imageMode(CORNER);
  paintLayer.pop();
}

// Input handlers
function touchStarted() {
  if (!started) {
    start();
  }
  setProperties(winMouseX, winMouseY);
}

function touchMoved() {
  if (started) {
    if (eraseState === 0) {
      makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
    } else {
      eraseDrawing();
    }
    render();
  }
  return false;
}

// Rendering functions
function render() {
  blendMode(BLEND);
  backdrop();
  blendMode(DARKEST);
  image(paintLayer, width / 2, height / 2);
  blendMode(LIGHTEST);
  image(traceLayer, width / 2, height / 2);
}

function backdrop() {
  background(255);
  noTint();
  image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
}

// Utility functions
function setProperties(_x, _y) {
  tempwinMouseX = windowWidth / 2 - _x;
  tempwinMouseY = windowHeight / 2 - _y;
  brushTemp = int(random(0, brush.length - 1));

  if (bool) {
    if (!colourBool) {
      let selectedNum = Math.floor(random(0, 2));
      currentColour = hexToRgb(colourSwatch[colourLevel][selectedNum]);
    } else {
      let selectedNum = Math.floor(random(3, 5));
      currentColour = hexToRgb(colourSwatch[colourLevel][selectedNum]);
    }
  }
}

function start() {
  playSoundtrack();
  reset();
  started = 1;
}

function reset() {
  colourLevel = (colourLevel + 1) % 5;
  calcViewportDimensions();
  drawErase();
  clearActiveButtonState();

  backdrop();
  segLength = windowWidth / 40;
  setProperties(0, 0);
  paintLayer.clear();
  traceLayer.clear();
  render();
}

// Window handling
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const { dimensions, resizedLayers } = handleResize([paintLayer, traceLayer]);
  [paintLayer, traceLayer] = resizedLayers;
  ({ vMax } = dimensions);

  setLayerProperties();
  render();
}

// Automated drawing
function autoDraw() {
  pautoX = autoX;
  pautoY = autoY;
  autoX = autoX + random(-50, 55);
  autoY = autoY + random(-20, 22);
  makeDrawing(autoX % width, autoY % height, pautoX % width, pautoY % height);
}

window.addEventListener("resize", windowResized);
