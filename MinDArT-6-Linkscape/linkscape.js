let x = [],
  y = [],
  segNum = 250,
  segLength = 4,
  distGravity = 50;

let lineLayer, paintLayer;
let texture, pin;
let audio, click;
let isDragging = false;
let isAddingPin = false;
let selected = [0, 0];

// Constraint parameters
let vt = []; // Vector points for pin positions
let vtCount = []; // Count of points affected by each pin
let vtStored = []; // Store which segments are affected by pins
let dotsActive = true;

let levelVersion = 0;
let levelMax = 9;
const palettes = [
  ["#D97398", "#A65398", "#5679A6"],
  ["#F2913D", "#F24B0F", "#5679A6"],
  ["#a4fba6", "#4ae54a", "#0f9200"],
  ["#F2F2F2", "#A6A6A6", "#737373"],
  ["#597d94", "#FFFFFF", "#D9AA8F"],
  ["#F2DFCE", "#FFFFFF", "#D9C3B0"],
  ["#F24444", "#F2BBBB", "#FFFFFF"],
  ["#BF4B8B", "#3981BF", "#D92929"],
  ["#F24452", "#5CE3F2", "#F2E205"],
  ["#CCCCCC", "#F2F2F2", "#B3B3B3"],
];

let width, height, vMin, vMax;

function preload() {
  texture = loadImage("assets/texture.png");
  pin = loadImage("assets/pin.png");
}

async function setup() {
  await initAudio("6_Link");
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls("linkscape", reset);
  initializeToolbarButtons();
  // Initialize dimensions
  ({ width, height, vMin, vMax } = calcViewportDimensions());

  // Create canvas and attach to container
  const mainCanvas = createCanvas(width, height);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );

  // Create graphics layers
  lineLayer = createGraphics(width, height);
  paintLayer = createGraphics(width, height);
}

function start() {
  playSoundtrack();
  lineLayer.strokeWeight(1 * vMax);
  paintLayer.strokeWeight(1 * vMax);
  setupCanvasEventListeners();
  reset();
}

function reset() {
  paintLayer.clear();

  x = [];
  y = [];
  vt = [];
  vtCount = [];

  levelVersion = (levelVersion + 1) % palettes.length;

  initialiseLine(0);
  isDragging = true;
  render();
}

function initialiseLine(l) {
  x[l] = [];
  y[l] = [];

  for (let i = 0; i < segNum; i++) {
    y[l][i] = map(i, 0, segNum, -height, height / 6);
    x[l][i] = map(i, 0, segNum, 0, (width / 4) * (1 + l));
  }
}

function addLine() {
  if (x.length < 3) {
    initialiseLine(x.length);
    render();
  }

  if (x.length >= 3) {
    const button = document.querySelector('[data-element="add-string-button"]');
    if (button) button.setAttribute("inert", true);
  }
}

function addPin() {
  isAddingPin = true;
  document.querySelector("canvas").classList.add("adding-pin");
}

function touchdown() {
  if (isAddingPin) {
    vt.push(createVector(winMouseX, winMouseY));
    vtCount.push(0);
    vtStored.push([]);
    isAddingPin = false;
    document.querySelector("canvas").classList.remove("adding-pin");
    render();
    return false;
  }
  if (!isDragging) {
    for (let i = 0; i < x.length; i++) {
      if (dist(winMouseX, winMouseY, x[i][0], y[i][0]) < 45) {
        selected = [i, 0];
        isDragging = true;
      } else if (
        dist(winMouseX, winMouseY, x[i][segNum - 1], y[i][segNum - 1]) < 45
      ) {
        selected = [i, segNum - 1];
        isDragging = true;
      } else {
        for (let j = 0; j < x[i].length; j++) {
          if (dist(winMouseX, winMouseY, x[i][j], y[i][j]) < 45) {
            selected = [i, j];
            if (j < 30) {
              selected[1] = 1;
            } else if (j > x[i].length - 30) {
              selected[1] = segNum - 1;
            } else {
              selected[1] = j;
            }
            isDragging = true;
            break;
          }
        }
      }
    }
  }
  return false;
}

function moved() {
  vtStored = [];

  if (dotsActive) {
    for (let i = 0; i < vt.length; i++) {
      vtCount[i] = 0;
      vtStored[i] = [];
    }
  }

  if (isDragging) {
    dragCalc(selected, winMouseX, winMouseY);
  }

  render();
  return false;
}

function touchstop() {
  isDragging = false;
}

function dragCalc(sel, mouseX, mouseY) {
  dragSegment(sel, mouseX, mouseY);

  let [i, j] = sel;
  // Update following segments
  for (let k = j; k < x[i].length - 1; k++) {
    dragSegment([i, k + 1], x[i][k], y[i][k]);
  }
  // Update preceding segments
  for (let k = j; k > 0; k--) {
    dragSegment([i, k - 1], x[i][k], y[i][k]);
  }
}

function dragSegment(sel, xin, yin) {
  const [i, j] = sel;
  const dx = xin - x[i][j];
  const dy = yin - y[i][j];
  const angle = atan2(dy, dx);

  x[i][j] = xin - cos(angle) * segLength;
  y[i][j] = yin - sin(angle) * segLength;

  if (dotsActive) {
    for (let k = 0; k < vt.length; k++) {
      let v1 = createVector(x[i][j], y[i][j]);
      let gate = true;

      for (let elt of vtStored[k]) {
        if (abs(elt - j) < 20 && abs(elt - j) > 6) {
          gate = false;
          break;
        }
      }

      if (gate) {
        let d = p5.Vector.dist(v1, vt[k]);
        if (d < distGravity) {
          vtStored[k].push(j);
          x[i][j] = vt[k].x;
          y[i][j] = vt[k].y;
          vtCount[k]++;
        }
      }
    }
  }
}

function render() {
  lineLayer.clear();
  paintLayer.clear();

  for (let i = 0; i < x.length; i++) {
    const baseColor = palettes[levelVersion][i % palettes[levelVersion].length];
    const mainColor = colorAlpha(baseColor, 0.9);
    const shadowColor = colorAlpha(baseColor, 0.3);

    // Draw main string
    lineLayer.strokeWeight(0.6 * vMax);
    lineLayer.stroke(mainColor);
    lineLayer.noFill();
    lineLayer.beginShape();
    for (let j = 0; j < x[i].length; j++) {
      lineLayer.curveVertex(x[i][j], y[i][j]);
    }
    lineLayer.endShape();

    // Draw endpoints
    lineLayer.strokeWeight(1.2 * vMax);
    lineLayer.point(x[i][0], y[i][0]);
    lineLayer.point(x[i][x[i].length - 1], y[i][x[i].length - 1]);

    // Draw shadow effect
    paintLayer.strokeWeight(0.1 * vMax);
    paintLayer.stroke(shadowColor);
    paintLayer.noFill();
    paintLayer.beginShape();
    for (let j = 0; j < x[i].length; j++) {
      paintLayer.curveVertex(x[i][j], y[i][j]);
    }
    paintLayer.endShape();
  }

  // Render final composition
  background(45);
  image(paintLayer, 0, 0, width, height);
  image(lineLayer, 0, 0, width, height);

  // Draw pins if active
  if (dotsActive) {
    const pinSize = vMax * 8;
    for (let i = 0; i < vt.length; i++) {
      image(
        pin,
        vt[i].x - pinSize / 2,
        vt[i].y - pinSize / 1.8,
        pinSize,
        pinSize
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const { dimensions, resizedLayers } = handleResize([lineLayer, paintLayer]);
  [lineLayer, paintLayer] = resizedLayers;
  ({ width, height, vMin, vMax } = dimensions);
  lineLayer.strokeWeight(2.2 * vMax);
}

window.addEventListener("resize", windowResized);
