const MAX_VECTOR_COUNT = 100;
// distance vector calculator
let smoothDist = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;
let currentFunction;
let drawMulti = 1;

let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

let axis;

let dragTracker = 0;

let poleArr = [];

let colArray = [
  ["#345573", "#223240", "#F2913D", "#F24B0F"],
  ["#345573", "#F2913D", "#223240", "#F24B0F"],
  ["#172426", "#455559", "#D9C3B0", "#F2DFCE"],
  ["#F2BBBB", "#3C5E73", "#FFFFFF", "#F24444"],
  ["#6C2EF2", "#9726A6", "#8F49F2", "#F27ECA"],
  ["#BF4B8B", "#3981BF", "#1F628C", "#D92929"],
  ["#F24452", "#5CE3F2", "#F2E205", "#F2CB05"],
  ["#2d3157", "#34c1bb", "#badccc", "#ffda4d"],
  ["#CCCCCC", "#F2F2F2", "#B3B3B3", "#E6E6E6"],
  ["#F2F2F2", "#A6A6A6", "#737373", "#0D0D0D"],
];

let colChoice = 0;
let arrayChoice = 0;

let eraserOffToggle = 0;

function preload() {
  // nothing to load in this case
}

async function setup() {
  await initAudio("3_Circle");
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls(restart);
  initializeToolbarButtons();

  // set up p5 for drawing
  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );

  pixelDensity(1);
}

function start() {
  playSoundtrack();
  // Initialize dimensions and graphics
  ({ vMax, width, height } = calcViewportDimensions());
  vW = width / 100;
  vH = height / 100;

  // vector array used to store points, this will max out at MAX_VECTOR_COUNT
  resetVectorStore();

  // create Start and End vectors
  let v1 = createVector(
    width / 2 + random(-width / 4, width / 4),
    height / 2 + random(-height / 4, height / 4)
  );
  let v2 = createVector(
    width / 2 + random(-width / 4, width / 4),
    height / 2 + random(-height / 10, height / 10)
  );
  let d = p5.Vector.dist(v1, v2) / 2;

  // create equal 10 points along that measure
  for (let i = 0; i < d; i++) {
    let tmp = p5.Vector.lerp(v1, v2, i / d);
    poleArr.push(tmp);
  }
  restart();
}

function resetVectorStore() {
  // Initialize vector array with p5.Vector objects
  for (let i = 0; i < MAX_VECTOR_COUNT; i++) {
    vec[i] = createVector(0, 0);
  }
}

function touchStarted(event) {
  // Skip if touching UI elements
  if (
    event.target.closest(".toolbar") ||
    event.target.closest(".app-controls")
  ) {
    return true;
  }

  dragTracker = 0;
  axis = createVector(mouseX, mouseY);
  colChoice = (colChoice + 1) % 4;
  stroke(colArray[arrayChoice][colChoice]);

  // Initialize all vectors to current touch position
  for (let i = 0; i < MAX_VECTOR_COUNT; i++) {
    vec[i] = createVector(mouseX, mouseY);
  }

  return false;
}

function touchMoved(event) {
  // Skip if touching UI elements
  if (
    event.target.closest(".toolbar") ||
    event.target.closest(".app-controls")
  ) {
    return true;
  }

  calcDynamics();

  if (eraserOffToggle) {
    brush_rake(
      x,
      y,
      x2,
      y2,
      angle1,
      24 * drawMulti,
      20 + velocity * 2 * drawMulti,
      10,
      0.001
    );
  } else {
    eraser();
  }

  return false;
}

function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, ns) {
  strokeW = ceil(brushWidth / qtyOfLines);
  strokeWeight(strokeW);

  let brushHalfWidth = brushWidth / 2;

  // Create points for brush width line perpendicular to movement
  let leftPoint = createVector(
    x + brushHalfWidth * cos(angle - PI / 2),
    y + brushHalfWidth * sin(angle - PI / 2)
  );

  let rightPoint = createVector(
    x + brushHalfWidth * cos(angle + PI / 2),
    y + brushHalfWidth * sin(angle + PI / 2)
  );

  for (var i = 0; i < qtyOfLines; i++) {
    let t = i / (qtyOfLines - 1 || 1);
    let currentPoint = createVector(
      lerp(leftPoint.x, rightPoint.x, t),
      lerp(leftPoint.y, rightPoint.y, t)
    );

    if (vec[i]) {
      stroke(colArray[arrayChoice][colChoice]);
      line(vec[i].x, vec[i].y, currentPoint.x, currentPoint.y);
    }

    vec[i] = currentPoint;
  }
}

function touchEnded(event) {
  // Reset vectors when touch ends to prepare for next stroke
  if (
    !event.target.closest(".toolbar") &&
    !event.target.closest(".app-controls")
  ) {
    for (let i = 0; i < MAX_VECTOR_COUNT; i++) {
      vec[i] = null; // Clear the vectors
    }
  }
  return false;
}

function calcDynamics() {
  // calculate the distance between mouse position, and previous position
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  smoothDist.shift();
  smoothDist.push(d);
  velocity = smoothDist.reduce(reducer) / smoothDist.length;

  // calculate mouseDirection
  let dx = mouseX - x;
  let dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = mouseX - cos(angle1) * dragLength;
  x2 = 100 - cos(PI / 2) * 1;
  y = mouseY - sin(angle1) * dragLength;
  y2 = 100 - sin(PI / 2) * 1;
}

function eraseToggle() {
  eraserOffToggle = 0;
  strokeCap(ROUND);
  blendMode(BLEND);
  currentFunction = "erase";
  return false;
}

function drawActive() {
  eraserOffToggle = 1;
  strokeCap(SQUARE);
  blendMode(DIFFERENCE);
  // Initialize vectors to null, we need to wait for first touch
  for (let i = 0; i < MAX_VECTOR_COUNT; i++) {
    vec[i] = null;
  }
}

function drawSmall() {
  drawActive();
  drawMulti = 0.5;
  currentFunction = "drawSmall";
}

function drawBig() {
  drawActive();
  drawMulti = 2;
  currentFunction = "drawBig";
}

function eraser() {
  stroke(colArray[arrayChoice][0]);
  strokeWeight(45);
  line(pmouseX, pmouseY, mouseX, mouseY);
}

function restart() {
  arrayChoice++;
  arrayChoice = arrayChoice % colArray.length;
  blendMode(BLEND);
  background(colArray[arrayChoice][0]);
  drawBig();
}

function windowResized() {
  const { dimensions } = handleResize();
  ({ vMax, width, height } = dimensions);
  vW = width / 100;
  vH = height / 100;
  background(colArray[arrayChoice][0]);
}

window.addEventListener("resize", windowResized);
