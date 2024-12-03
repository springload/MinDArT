// counters
let xCount = 0,
  yCount = 0,
  counter = 0;
let fromCol, toCol;
let store = [];
let arr = [];
let arrLineCol = [];
let ccc;

// dimensions
let vMax, hMax, wMax, vW, vH;
bool = 1;
let brushSizeBaseline = 60;

// strokes
let strokeBaseline = 0;

//UI elements
let newTextureButton;
let slider1, slider2, slider3;

// distance vector calculator
let smoothDist = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;
let img, direction;

function preload() {
  audio = loadSound("../sound/Scene2_Line.mp3");
  click = loadSound("../sound/click.mp3");
}

function setup() {
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls("linescape", next);

  // set up p5 for drawing
  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );

  pixelDensity(1);
}

function start() {
  click.play();
  if (!audio.isPlaying()) {
    audio.loop(1);
  }

  // Initialize dimensions and graphics
  ({ vMax, width, height } = calcViewportDimensions());

  vW = width / 100;
  vH = height / 100;

  // Set up initial state
  setupDefaults();
  setupArrays();

  // Register audio visibility handler
  stopAudioWhenHidden(audio);
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
    ccc = hexToRgb(colours[cc][1], 0.5);
    arrLineCol[j] = [ccc.levels[0], ccc.levels[1], ccc.levels[2]];
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

function activateDraw() {
  resetButtons();
  bool = 1;
  paintOff();
  return false;
}

function next() {
  resetButtons();
  yCount = int((yCount *= 1.3));
  xCount = int((xCount *= 0.95));
  brushSizeBaseline *= 0.95;
  counter++;
  if (counter > 7) {
    setupDefaults();
  }
  bool = 0;

  cc++;
  if (cc > colours.length - 1) {
    cc = 0;
  }

  activateDraw();
  setupArrays();
  background(255, 255);
  blendMode(BLEND);
  redrawIt();
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

  // sort by size
  store.sort(sortFunction);

  if (bool) {
    // redrawOrganic
    for (let i = 0; i < store.length; i++) {
      let _d = store[i][0];
      let _x = store[i][1];
      let _y = store[i][2];
      let temp = createVector(mouseX, mouseY);
      _d = _d / (vMax * 0.2);
      arr[_x][_y] = p5.Vector.lerp(arr[_x][_y], temp, 1 / _d);
    }
  } else {
    // find the closest match, and paint that colour
    let choice = 0;
    if (toggle) {
      choice = 1;
    }
    if (store.length > 0) {
      ccc = hexToRgb(colours[cc][choice]);
      arrLineCol[store[store.length - 1][2]] = [
        ccc.levels[0],
        ccc.levels[1],
        ccc.levels[2],
      ];
    }
  }
  redrawIt();
}

function updateSize() {
  curveTightness(slider1.value() / 100);
}

function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return b;
  } else {
    return a[0] > b[0] ? -1 : 1;
  }
}

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const { dimensions } = handleResize();
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
