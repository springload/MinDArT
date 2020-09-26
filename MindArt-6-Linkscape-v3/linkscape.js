let x = [],
  y = [],
  segNum = 300,
  segLength = 8;

let selectedArray = [];
let lineCanv, // lineLayer
  shadow, // shadowLayer
  texture,
  beginning;
let bgCol, stringCol;
let driftVal = 0,
  selected = [0, 0];
drawActive = 1;
let audio;

let cutSeg = 0;

// constraint paramaters
let vt = [];
let vtCount = [];

let levelVersion = 0;
let levelMax = 9;
let gridLevels = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
];
let radialLevels = [3, 5];

function preload() {
  texture = loadImage('assets/texture.png');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
}

function setup() {
  stringCol = color('#a1a1a1');
  bgCol = color('#e5e5e5');
  createCanvas(windowWidth, windowHeight);

  lineCanv = createGraphics(windowWidth, windowHeight);
  lineCanv.strokeWeight(30);
  lineCanv.stroke(20, 20, 50);

  calcDimensions();
  reset();
  saveNext();
}

function reset(){
click.play();
x = [];
y = [];

levelVersion++;
if (levelVersion >= levelMax) {
  levelVersion = 0;
}

vt = [];
vtCount = [];

if (levelVersion < gridLevels.length) {
      makeGrid();
    } else if (levelVersion >= gridLevels.length && levelVersion < (gridLevels.length+radialLevels.length)){
      makeRadial();
    } else {
      scatterPoints();
    }

initialiseLine(0);
drawActive = 1;
render();
}

function initialiseLine(l) {
  // in  this function, each time a new drawing is started
  x[l] = [];
  y[l] = [];

  for (let i = 0; i < segNum; i++) {
    x[l][i] = random(0, width);
    y[l][i] = (height / segNum) * i;
    // y[l][i] = random(0, height);
  }

  selected = [l, 0];
  dragCalc(selected, width / 2, height / 2);
  beginning = 1;
}


function touchEnded() {
  drawActive = 0;
}

function touchStarted() {

  if (audio.isPlaying()) {} else {
    audio.loop(5);
  }




  if (!drawActive) {

    // for initial touch state, detect if a position is crossed.
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < x[i].length; j++) {
        if (dist(winMouseX, winMouseY, x[i][j], y[i][j]) < 45) {
          selected[0] = i;
          selected[1] = j;
          drawActive = true;
          break;
        }
      }
    }

  }
  //return false;

}

function touchMoved() {

  if (dotsActive){
      gravityCalc();
    }

  if (multiselectable) {
    if (drawActive) {
      // do we really need these Layers? // or do we need double the calculation of Lines
      if (beginning) {
        dragCalc(selected, width / 2, height / 2);
        beginning = 0;
      } else {
        dragCalc(selected, winMouseX, winMouseY);
      }
    }
  } else {

    if (beginning) {
      dragCalc(selected, width / 2, height / 2);
      beginning = 0;
    } else {
      let t = [0, 0]

      dragCalc(t, winMouseX, winMouseY);

    }
  }


  render();

  return false;
}


function gravityCalc() {
  // for each vertice of a dot
  for (var k = 0; k < vt.length; k++) {
    // start a counter at that dot for each line // todo, add array
    vtCount[k] = 1;
    // for each segment (currently of line 1 only)
    for (let i = 0; i < segNum; i++) {
      // crreate a vector for that segment
      let vct = createVector(x[0][i], y[0][i]);
      // calculate distance between segment and dot
      var d = p5.Vector.dist(vct, vt[k]);
      // if d is less than 75pixels, increment the counter for that dot
      if (d < 75) {
        vtCount[k]++;
      }
    }
  }
}

function dragCalc(_sel, _mouseX, _mouseY) {
  dragSegment(_sel, _mouseX, _mouseY);
  let i2 = _sel[0];
  let j2 = _sel[1];
  for (let j = j2; j < x[i2].length - 1; j++) {
    let t = [i2, j + 1];
    dragSegment(t, x[i2][j], y[i2][j]);
  }
  for (let j = j2; j > 0; j--) {
    let t = [i2, j - 1];
    dragSegment(t, x[i2][j], y[i2][j]);
  }
}

function dragSegment(_sel, xin, yin) {
  i = _sel[0];
  j = _sel[1];
  const dx = xin - x[i][j];
  const dy = yin - y[i][j];
  const angle = (atan2(dy, dx));
  x[i][j] = xin - cos(angle) * segLength;
  y[i][j] = yin - sin(angle) * segLength;

  //gravitational affector
if (dotsActive){
  for (var k = 0; k < vt.length; k++) {

    // creat a vector for currently referenced dot
    let v1 = createVector(x[i][j], y[i][j]);
    let v2 = createVector(x[i][j], y[i][j]);

    var d = p5.Vector.dist(v1, vt[k]);
    if (d < 65){
      // todo, replace gravitational
      let gravity = map(vtCount[k], 1,  20, 0.115, 0.05);
        let v3 = p5.Vector.lerp(v1, vt[k], gravity);
      x[i][j] = v3.x;
      y[i][j] = v3.y;
    }
  }
}

}

function render() {
  let colours = ['#025373', '#F2C063', '#F29472', '#04ADBF', '#66CDD9'];
  // let colours = ['#1a1a1a'];
  lineCanv.clear();
  for (let i = 0; i < x.length; i++) {
    //let colour = colors[floor(random(0,colors.length))];
    // lineCanv.stroke(colours[i % colours.length]);
    for (let j = 0; j < x[i].length - 1 - cutSeg; j++) {
      lineCanv.line(x[i][j], y[i][j], x[i][j + 1], y[i][j + 1])
    }


    background(0);
    for (let i = 5; i > 0; i--) {
      image(lineCanv, 0, i * 10, width, height);
      image(texture, 0, 0, width, height);
    }
    image(lineCanv, 0, 0, width, height);

  }

if (dotsActive){
  for (var i = 0; i < vt.length; i++) {
    fill(100);
    ellipse(vt[i].x, vt[i].y, 50, 50);
    noFill();
  }}


}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  lineCanv.resizeCanvas(windowWidth, windowHeight);
  touchMoved();
  calcDimensions();
  removeElements();
  saveNext();

}


function makeGrid() {

  let xQty = gridLevels[levelVersion][0];
  let yQty = gridLevels[levelVersion][1];
  for (let i = 0; i < xQty; i++) {
    for (let j = 0; j < yQty; j++) {
      // vectors.push(createVector(random(0,width), random(0, height)));
      vt.push(createVector((((width*1.4) / (xQty + 1)) * (i + 1))-width*0.2, (((height*1.4) / (yQty + 1)) * (j + 1))-height*0.2));
    }
  }
}

function makeRadial(){

// update the level version to start from 0 (after gridLevels)
var level = levelVersion - (gridLevels.length);

// radius of the circular array
let tran = vMin*40;


for (let i = 0; i < radialLevels[level]; i++){

  rotateVal = (360/radialLevels[level])*i;

  let tempX = (tran * cos(radians(rotateVal))) + width / 2;
  let tempY = (tran * sin(radians(rotateVal))) + height / 2;

  vt.push(createVector(tempX, tempY));

}
}

function scatterPoints() {

  let n = levelVersion - gridLevels.length - radialLevels.length;
  // let qty = 5 + (n * n);

  for (let i = 0; i < 50; i++) {

    let m = height / 10; // margin
    let v = createVector(random(width*0.1, width*0.9), random(height*.1, height*0.8));
    var bool = 1;

    for (let j = 0; j < vt.length; j++){
      if (v.dist(vt[j]) < vMax*20){
        bool = 0;
      }
    }

    if (bool){
      vt.push(v);

        // make dots (consider delete)

    }


  }
}
