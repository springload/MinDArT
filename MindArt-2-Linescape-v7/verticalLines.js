// counters
let xCount = 0, yCount = 0, counter = 0;
let fromCol, toCol;
let store = [];
let arr = [];

// dimensions
let vMax, hMax, wMax;
bool = 1;
let brushSizeBaseline = 140;

// strokes
let strokeBaseline = 0;
let strokeMulti = 0;

//UI elements
let newTextureButton;
let slider1, slider2, slider3;

// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;


function setup() {

  // setup Basics
  createCanvas(windowWidth, windowHeight);
  background(255);
  dimensionCalc();
  // blendMode(DIFFERENCE);

  // UI elements
  newTextureButton = createButton('Next');
  newTextureButton.position(width - (8 * vMax), height - (10 * vH));
  newTextureButton.class("select");
  newTextureButton.style('font-size', '1.3vmax');
  newTextureButton.style('height', '3vmax');
  newTextureButton.style('width', '6vmax');
  newTextureButton.mousePressed(next);
  slider1 = createSlider(1, 300, 50); // density
  slider1.input(updateSize);
  slider1.position(10, -150);
  slider1.style('width', '300px');

  // display baselines
  fromCol = color(0, 0, 0);
  toCol = color(100, 100, 100);
  noFill()
  stroke(255, 140);
  let marginX = 0;
  let marginY = 0;

  // run setup functions
  setupDefaults();
  setupArrays();
}

function dimensionCalc() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
  vW = width / 100;
  vH = height / 100;
}


function setupDefaults() {
  strokeBaseline = 2;
  strokeWeight(strokeBaseline * 10); // set a baseline in case strokeWeight within touchMoved is disabled
  yCount = 10;
  xCount = 25;
  counter = 0;
  strokeMulti = 2;
  strokeWeight(1);
  stroke(255, 50);
}

function setupArrays() {
  for (let x = 0; x < xCount; x++) {
    arr[x] = [];
    for (let y = 0; y < yCount; y++) {
      let _x = (width / xCount) * x;
      _x = map(_x, 0, width, -vW * 10, width + vW * 10); // ensures beyond margin
      let _y = (height / yCount) * y;
      _y = map(_y, 0, height, -vH * 10, height + vH * 10); // ensures beyond margin
      arr[x][y] = createVector(_x, _y);
    }
  }
  redrawIt();
}

function invert() {
  bool = -bool;
}

function next() {
  setTimeout(next2, 150);
}

function next2() {
  yCount = int(yCount *= 1.3);
  strokeBaseline *= 0.75;
  strokeWeight(strokeBaseline * 10); // set a baseline in case strokeWeight within touchMoved is disabled
  strokeWeight(strokeBaseline * 1); //
  strokeMulti *= 0.4;
  counter++;
  if (counter > 6) {
    setupDefaults();
  }
  setupArrays();
}


function touchMoved() {
  store = [];
  // calcDynamics();
  brushSize = brushSizeBaseline * 1; // change 1 for velocity if desired.
  // calculate all points within a distance, then sort...
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let d = (dist(mouseX, mouseY, arr[x][y].x, arr[x][y].y));
      if (d < brushSize) {
        store.push([d, x, y]);
      }
    }
  }

  store.sort(sortFunction);

  // // redrawOrganic
  for (let i = 0; i < store.length; i++) {
    let _d = store[i][0];
    let _x = store[i][1];
    let _y = store[i][2];
    let temp = createVector(mouseX, mouseY);
    _d = _d / 4;
    // let lerpVal = bool * (1 / _d);
    arr[_x][_y] = p5.Vector.lerp(arr[_x][_y], temp, 1 / _d);
  }

  redrawIt();

}

function updateSize() {
  brushSizeBaseline = slider1.value();
}


function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return b;
  } else {
    return (a[0] > b[0]) ? -1 : 1;
  }
}

// function touchEnded() {
//   // this will effectively redraw the frame sans cursor
//   redrawIt();
// }

function redrawIt() {

  background(50);


  for (let y = 0; y < yCount; y++) {
    // stroke(lerpColor(fromCol, toCol, y / yCount)); possible speed reducer
    fill(255-((255/yCount)*y));
    beginShape();
    vertex(0, height);
    for (let x = 0; x < xCount; x++) {
      curveVertex(arr[x][y].x, arr[x][y].y)
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}
