// images
let bg;
let brush = [];
// brush mechanics
let angle1, segLength;
let scalar = 30;
let tempwinMouseX = 0;
let tempwinMouseY = 0;
let tempX = 100;
let tempY = 100;
let dx, dy;
// VARIABLES FOR TIME DELAY ON BRUSH
let milliCounter;
let milliTrack = 0;
//BRUSH CHARACTERISTICS
let milliComp = 5;
let scatterAmount = 2;
// COLOUR VARAIABLES
let colHue;
const colHueMin = 0;
const colHueMax = 360;
let colSat;
const colSatMin = 0;
const colSatMax = 255;
let colBri;
const colBriMin = 0;
const colBriMax = 255;
let colOpacity = 0.4;
let colourBool = 0;
let introLayer;
let cloudHSB = [
  [180, 47, 25],
  [178, 23, 55],
  [170, 15, 75],
  [164, 12, 95],
  [176, 45, 19],
];
let sunsetHSB = [
  [11, 53, 96],
  [13, 83, 91],
  [2, 90, 100],
  [334, 81, 91],
  [300, 67, 99],
];

let colourLevel = 0;

let colourSwatch = [
  ["#F2A97E", "#F28D77", "#BF7E7E", "#7E708C", "#49538C"],
  ["#F2A74B", "#F2955E", "#D95F43", "#734663", "#2A1A40"],
  ["#F21905", "#A60303", "#027373", "#025159", "#025159"],
  ["#CFCFCF", "#88898C", "#565759", "#0D0D0D", "#00010D"],
  ["#91AA9D", "#D1DBBD", "#91AA9D", "#3E606F", "#193441"],
];

const rotateDrift = 0.6;
let bool = 1;
let brushTemp = 0;
let buttonText1state = 0;
let buttonText2state = 0;
let vMax;
let audio;
let startState = 0;
let alphaErase;
let eraseState = 0;
let saveState = 1;
let buttonTEST;
let autoX = 0,
  autoY = 0,
  pautoX = 0,
  pautoY = 0; // automated drawing mouse states
let paintLayer, traceLayer;
let started = 0;

function preload() {
  bg = loadImage("assets/paper.jpg"); // background paper
  for (let i = 0; i < 15; i++) {
    brush[i] = loadImage("assets/Cloud" + i + ".png"); // brush loader
  }
}

function start() {
  playSoundtrack();
  reset();
  started = 1;
}

async function setup() {
  await initAudio("4_Colour");
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls(reset);
  initializeToolbarButtons();
  // set up p5 for drawing
  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );
  paintLayer = createGraphics(width, height);
  traceLayer = createGraphics(width, height);

  pixelDensity(1); // Ignores retina displays

  colHue = random(colHueMin, colHueMax);
  colSat = random(colSatMin, colSatMax);
  strokeWeight(4); // for line work
  stroke(255, 0, 255); // for line work

  setLayerProperties();
}

function setLayerProperties() {
  imageMode(CENTER); // centers loaded brushes
  blendMode(BLEND); // consider overlay and multiply
  traceLayer.blendMode(LIGHTEST); // consider overlay and multiply
  colorMode(RGB, 255, 255, 255, 1);
  paintLayer.colorMode(RGB, 255, 255, 255, 255);
  traceLayer.colorMode(HSB, 360, 100, 100, 1);
  traceLayer.strokeWeight(8);
  traceLayer.stroke(255, 0, 255, 0.8); // for line work
}

function reset() {
  colourLevel = (colourLevel + 1) % 5; //TODO
  calcViewportDimensions();
  drawErase();
  clearActiveButtonState();

  backdrop();
  segLength = windowWidth / 40; // length of delay between touch and paint or line // 15 is a good value.
  setProperties(0, 0);
  paintLayer.clear();
  traceLayer.clear();
  if (!bool) invertTracing();
  render();
}

function backdrop() {
  background(255);
  noTint();
  image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight); // display backgrond
}

function touchStarted() {
  if (!started) {
    start();
  }
  setProperties(winMouseX, winMouseY);
}

function setProperties(_x, _y) {
  tempwinMouseX = windowWidth / 2 - _x; // record position on downpress
  tempwinMouseY = windowHeight / 2 - _y; // record position on downpress
  brushTemp = int(random(0, brush.length - 1));

  if (bool) {
    //image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
    if (!colourBool) {
      let selectedNum = Math.floor(random(0, 2));
      currentColour = hexToRgb(colourSwatch[colourLevel][selectedNum]);
    } else {
      let selectedNum = Math.floor(random(3, 5));
      currentColour = hexToRgb(colourSwatch[colourLevel][selectedNum]);
    }
  }
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

function render() {
  blendMode(BLEND);
  backdrop();
  blendMode(DARKEST);
  image(paintLayer, width / 2, height / 2);
  blendMode(LIGHTEST);
  image(traceLayer, width / 2, height / 2);
}

function autoDraw() {
  pautoX = autoX;
  pautoY = autoY;
  autoX = autoX + random(-50, 55);
  autoY = autoY + random(-20, 22);
  makeDrawing(autoX % width, autoY % height, pautoX % width, pautoY % height);
}

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
      angle1 = atan2(dy, dx) + random(-rotateDrift, rotateDrift); // https://p5js.org/reference/#/p5/atan2
      tempX = _x - (cos(angle1) * segLength) / 2; // https://p5js.org/examples/interaction-follow-1.html
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

function segment(rakeX, rakeY, a, rake, scalar) {
  currentColour.setAlpha(0.5);
  paintLayer.tint(currentColour); // Display at half opacity
  paintLayer.push();
  paintLayer.imageMode(CENTER); // centers loaded brushes
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
  paintLayer.imageMode(CORNER); // centers loaded brushes
  paintLayer.pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const { dimensions, resizedLayers } = handleResize([paintLayer, traceLayer]);
  [paintLayer, traceLayer] = resizedLayers;
  ({ vMax } = dimensions);

  setLayerProperties();
  render();
}

window.addEventListener("resize", windowResized);
