// Configuration and state
const colours = [
  ["#F2B705", "#701036"],
  ["#0D0D0D", "#0D0D0D"],
  ["#F2B077", "#023E73"],
  ["#D94929", "#590902"],
  ["#F2B705", "#02735E"],
  ["#F2B705", "#011F26"],
  ["#F2B705", "#A6600A"],
  ["#F2B705", "#1450A4"],
  ["#F2B705", "#363432"],
];

// State variables
let colorPairIndex = 0;
let currentRgbColor;
let currentSwatch = 0;
let swatch = [];

// Dimension variables
let vMax, hMax, wMax, vW, vH;
let brushSizeBaseline = 60;

// Grid state
let xCount = 0,
  yCount = 0,
  counter = 0;
let store = [];
let arr = [];
let arrLineCol = [];

// Stroke settings
let strokeBaseline = 0;

// Motion tracking
let smoothDist = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;
let img, direction;

// P5.js lifecycle functions
function preload() {
  // nothing to load
}

async function setup() {
  await initAudio("2_Line");
  // add JS functionality to existing HTML elements
  initializeAppControls(next);
  initializeSwatches();

  // set up p5 for drawing
  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );

  pixelDensity(1);
}

// Core Drawing Functions

function redrawIt() {
  background(255);
  for (let y = 0; y < yCount; y++) {
    strokeWeight((1 / yCount) * y * 4.5);
    stroke(arrLineCol[y][0], arrLineCol[y][1], arrLineCol[y][2], 90);
    fill(arrLineCol[y][0], arrLineCol[y][1], arrLineCol[y][2], 100);
    beginShape();
    let vvW = -10 * vW;
    let vvH = -10 * vH;
    for (let x = 0; x < xCount; x++) {
      curveVertex(arr[x][y].x, arr[x][y].y);
    }

    // curveVertex(windowWidth, windowHeight);
    // curveVertex(0, windowHeight);

    endShape();
  }
}

function touchMoved() {
  store = [];
  // calculate all points within a distance, then sort...
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let d = dist(mouseX, mouseY, arr[x][y].x, arr[x][y].y);
      if (d < brushSizeBaseline) {
        store.push([d, x, y]);
      }
    }
  }

  store.sort((a, b) => b[0] - a[0]);

  for (let i = 0; i < store.length; i++) {
    let _d = store[i][0];
    let _x = store[i][1];
    let _y = store[i][2];
    let temp = createVector(mouseX, mouseY);
    _d = _d / (vMax * 0.2);
    arr[_x][_y] = p5.Vector.lerp(arr[_x][_y], temp, 1 / _d);
  }

  // If a swatch is active, apply color
  if (store.length > 0) {
    currentRgbColor = hexToRgb(colours[colorPairIndex][currentSwatch]);
    arrLineCol[store[store.length - 1][2]] = [
      currentRgbColor.levels[0],
      currentRgbColor.levels[1],
      currentRgbColor.levels[2],
    ];
  }

  redrawIt();
}

function start() {
  playSoundtrack();
  // Initialize dimensions and graphics
  ({ vMax, width, height } = calcViewportDimensions());

  vW = width / 100;
  vH = height / 100;

  // Set up initial state
  setupDefaults();
  setupArrays();
}

function setupDefaults() {
  strokeWeight(2); // set a baseline in case strokeWeight within touchMoved is disabled
  yCount = 35;
  xCount = 35;
  counter = 0;
  stroke(255, 50);
  brushSizeBaseline = 100;
}

function setupArrays() {
  arr = [];
  arrLineCol = [];

  // make col array
  for (let j = 0; j < yCount; j++) {
    currentRgbColor = hexToRgb(colours[colorPairIndex][1], 0.5);
    arrLineCol[j] = [
      currentRgbColor.levels[0],
      currentRgbColor.levels[1],
      currentRgbColor.levels[2],
    ];
  }

  // x and y may need to be swapped
  for (let i = 0; i < xCount; i++) {
    arr[i] = [];
    for (let j = 0; j < yCount; j++) {
      let _x = (width / xCount) * i;
      _x = map(_x, 0, width, vW * -20, width + vW * 20); // ensures beyond margin
      let _y = (height / yCount) * j;
      _y = map(pow(_y, 2), 0, pow(height, 2), 0, height);
      _y = map(_y, 0, height, vH * -20, height + vH * 20); // ensures beyond margin
      arr[i][j] = createVector(_x, _y);
    }
  }
  redrawIt();
}

// UI and control functions
function initializeSwatches() {
  updateSwatchColors();
  initializeToolbarButtons();
}

function switchSwatch(el) {
  currentSwatch = parseInt(el.dataset.swatch);
}

function updateSwatchColors() {
  const elements = document.querySelectorAll('[data-element="swatch"]');
  elements.forEach((el) => {
    el.style.backgroundColor =
      colours[colorPairIndex][parseInt(el.dataset.swatch)];
  });
}

function next() {
  clearActiveButtonState();
  yCount = int((yCount *= 1.3));
  xCount = int((xCount *= 0.95));
  brushSizeBaseline *= 0.95;
  counter++;
  if (counter > 7) {
    setupDefaults();
  }

  colorPairIndex++;
  if (colorPairIndex > colours.length - 1) {
    colorPairIndex = 0;
  }

  updateSwatchColors();
  setupArrays();
  background(255, 255);
  blendMode(BLEND);
  redrawIt();
}

// Window and resize handling
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const { dimensions, orientationChanged } = handleResize();
  ({ vMax } = dimensions);

  if (orientationChanged) {
    // Transform all points in the vector grid
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        // Convert points to new orientation
        const x = arr[i][j].x;
        const y = arr[i][j].y;
        arr[i][j].x = (x / width) * height;
        arr[i][j].y = (y / height) * width;
      }
    }
    rotateDirection *= -1;
  }

  redrawIt();
}

window.addEventListener("resize", windowResized);
