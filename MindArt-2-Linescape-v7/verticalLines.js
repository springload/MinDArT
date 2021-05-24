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

  //invert
  newTextureButton = createButton('Swap');
  newTextureButton.position(2 * vMax, height - (10 * vH));
  newTextureButton.class("select");
  newTextureButton.style('font-size', '1.3vmax');
  newTextureButton.style('height', '3vmax');
  newTextureButton.style('width', '6vmax');
  newTextureButton.mousePressed(invert);

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
  strokeWeight(2); // set a baseline in case strokeWeight within touchMoved is disabled
  yCount = 10;
  xCount =25;
  counter = 0;
  stroke(255, 50);
}

function setupArrays() {
  arr = [];
  for (let x = 0; x < xCount; x++) {
    arr[x] = [];
    for (let y = 0; y < yCount; y++) {
      let _x = (width / xCount) * x;
      _x = map(_x, 0, width, vW * 10, width - (vW * 10)); // ensures beyond margin
      let _y = (height / yCount) * y;
       _y = map(_y, 0, height, vH * 10, height - (vH * 10)); // ensures beyond margin
      arr[x][y] = createVector(_x, _y);
    }
  }
  redrawIt();
}z

function invert() {
  bool = abs(bool - 1);
}

function next() {
  yCount = int(yCount *= 1.3);
  xCount = int(xCount *= 0.9);

  counter++;

  if (counter > 6) {
    setupDefaults();
  }
  setupArrays();
  // console.log(yCount);
}


function touchMoved() {

  if (bool){
  store = [];

  // calculate all points within a distance, then sort...
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let d = (dist(mouseX, mouseY, arr[x][y].x, arr[x][y].y));
      if (d < brushSizeBaseline) {
        store.push([d, x, y]);
      }
    }
  }

  // sort by size
  store.sort(sortFunction);

  // // redrawOrganic
  for (let i = 0; i < store.length; i++) {
    let _d = store[i][0];
    let _x = store[i][1];
    let _y = store[i][2];
    let temp = createVector(mouseX, mouseY);
    _d = _d / 3;
    arr[_x][_y] = p5.Vector.lerp(arr[_x][_y], temp, 1 / _d);
  }

  redrawIt();
} else {
strokeWeight(10);
line(mouseX, mouseY, pmouseX, pmouseY);
}
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


function redrawIt() {
    // curveTightness(0.5);
  background(50);
  for (let y = 0; y < yCount; y++) {
    // stroke(lerpColor(fromCol, toCol, y / yCount)); possible speed reducer
  //  fill(255-((255/yCount)*y));

    beginShape();

let vvW = -10*vW;
let vvH = -10*vH;

  vertex(-vvW, height+vvH);
  vertex(-vvW, height+vvH);
  vertex(arr[0][y].x, (arr[0][y].y + height)/2);

   for (let x = 0; x < xCount; x++) {
    curveVertex(arr[x][y].x, arr[x][y].y);
    }

    vertex(arr[xCount-1][y].x, (arr[xCount-1][y].y+height)/2);
    vertex(width+vvW, height+vvH);
        vertex(width+vvW, height+vvH);
        vertex(-vvW, height+vvH);
    endShape();

  }
}
