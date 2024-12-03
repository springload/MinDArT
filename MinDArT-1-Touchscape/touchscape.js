// Configuration and state variables
let isMousedown = false;
let vMax;
const appCol = "#469ede"; // 70, 158, 222

// Data storage
let pointStore;
let lineStore;

// Drawing variables
let x = 100,
  y = 100,
  vec = [],
  px = [],
  py = [],
  pA = [],
  angle1 = 0.0,
  dragLength = 30;

// Brush configuration
let r = 0;
let qtyOfLines = 40;
let brushWidth = 200;
let strokeW = brushWidth / qtyOfLines;
let opacity = 200;

// Assets and storage
let gui_img = [];
let pebble = [];
let randomScalar = [];
let tempID = [];
let tempX = [];
let tempY = [];

// Graphics layers
let fg, pLayer;
let background, audio, click;

function preload() {
  // Load assets
  background = loadImage("assets/sand_01.jpg");
  audio = loadSound("../sound/Scene1_Touch.mp3");
  click = loadSound("../sound/click.mp3");

  // Load pebble assets
  for (let i = 1; i < 8; i++) {
    pebble[i] = loadImage(`assets/wpebble${i}.png`);
  }
}

function setup() {
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls("touchscape", resetTimeout);
  initializeToolbarButtons();
  // set up p5 for drawing
  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );
  initializeLayers();
  setupGraphics();
  stopAudioWhenHidden(audio);
}

function initializeLayers() {
  fg = createGraphics(width, height);
  pLayer = createGraphics(width, height);
}

function setupGraphics() {
  fg.strokeWeight(strokeW);
  fg.noFill();
  fg.stroke(20, 100);

  colorMode(HSB, 360, 100, 100, 1.0);

  pixelDensity(1);
}

function start() {
  click.play();

  if (!audio.isPlaying()) {
    audio.loop(1);
  }

  change();
  ({ vMax } = calcViewportDimensions());

  rake(currentRake);
  reset();
  counter = 0;

  setupEventListeners();
  initializeDataStores();
}

function setupEventListeners() {
  const canvas = document.querySelector("canvas");
  canvas.addEventListener("touchmove", moved, { passive: false });
  canvas.addEventListener("mousemove", moved);
  canvas.addEventListener("touchstart", touchdown);
  canvas.addEventListener("mousedown", touchdown);
  canvas.addEventListener("touchend", touchstop);
  canvas.addEventListener("touchleave", touchstop);
  canvas.addEventListener("mouseup", touchstop);
}

function initializeDataStores() {
  pointStore = [];
  lineStore = [];
}

function change(qty = qtyOfLines, width = brushWidth, opac = opacity) {
  qtyOfLines = qty;
  brushWidth = width;
  opacity = opac;
  vec = Array(qtyOfLines)
    .fill()
    .map(() => []);
  strokeW = Math.ceil(brushWidth / qtyOfLines);
  fg.strokeWeight(strokeW);
}

function touchdown(ev) {
  isMousedown = true;
  return false;
}

function touchstop(ev) {
  isMousedown = false;
  vec = Array(qtyOfLines)
    .fill()
    .map(() => []);
}

function moved(ev) {
  if (!isMousedown) return;
  ev.preventDefault();

  const dx = mouseX - x;
  const dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = mouseX - cos(angle1) * dragLength;
  const x2 = 100 - cos(PI / 2);
  y = mouseY - sin(angle1) * dragLength;
  const y2 = 100 - sin(PI / 2);

  makeArray(x, y, x2, y2, angle1);
  display();

  return false;
}

function makeArray(x, y, x2, y2, angle) {
  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    d = p5.Vector.lerp(
      a,
      c,
      i / (qtyOfLines + 1) + random(0, (1 / qtyOfLines) * 0.2)
    );
    point(d.x, d.y);

    vec[i].push(d);
  }
}

function display() {
  var bool = 0;
  if (vec[0].length > 1) {
    for (var i = 0; i < vec.length; i++) {
      if (i === 0 || i === vec.length - 1 || i % 3 === 2) {
        // if first line, last line or every 3rd line, then thin, else fat
        fg.strokeWeight(strokeW / 2);
      } else {
        fg.strokeWeight(strokeW);
      }

      var n = vec[i];
      if (i % 3 === 0) {
        fg.stroke(40);
      } else if (i % 3 === 1) {
        fg.stroke(200);
      } else if (i % 3 === 2) {
        fg.stroke(0);
      }

      if (eraseActive) {
        fg.noStroke();
        fg.fill(127, 80);
        fg.ellipse(mouseX, mouseY, vMax * 4, vMax * 4);
      } else {
        bool++;
        fg.line(
          n[n.length - 1].x,
          n[n.length - 1].y,
          n[n.length - 2].x,
          n[n.length - 2].y
        );
      }
    }
  }
  blendMode(BLEND);
  image(background, 0, 0, width, height);
  blendMode(OVERLAY);

  image(fg, 0, 0, width, height);
  blendMode(BLEND);
  noTint();
  image(pLayer, 0, 0, width, height);
}

function resetTimeout() {
  resetButtons();
  reset();
}

function reset() {
  click.play();
  blendMode(REPLACE);
  image(background, 0, 0, width, height);
  fg.clear();
  pLayer.clear();
  change(qtyOfLines, brushWidth, opacity);

  tempcount = int(random(0.7, 3));
  for (let k = 0; k < tempcount; k++) {
    randomScalar[k] = int(random(120, 180));
    tempID[k] = int(random(1, 7));
    tempX[k] = int(random(0, width - randomScalar[k]));
    tempY[k] = int(random(0, height - randomScalar[k]));
    pLayer.image(
      pebble[tempID[k]],
      tempX[k],
      tempY[k],
      randomScalar[k],
      randomScalar[k]
    );
  }

  display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const { dimensions, resizedLayers } = handleResize([fg, pLayer]);
  [fg, pLayer] = resizedLayers;
  ({ vMax } = dimensions);

  display();
}

window.addEventListener("resize", windowResized);
