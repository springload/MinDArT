// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

let storedOrientation, storedOrientationDegrees, rotateDirection;

let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

let axis;

let dragTracker = 0;

let poleArr = [];

let colArray = [
  ['#345573', '#223240', '#F2913D', '#F24B0F'],
  ['#345573', '#F2913D', '#223240', '#F24B0F'],
  // ['#6D808C','#FFFFFF','#D9AA8F','#F2CAB3'],
  ['#172426', '#455559', '#D9C3B0', '#F2DFCE'],
  ['#F2BBBB', '#3C5E73', '#FFFFFF', '#F24444'],
  ['#6C2EF2', '#9726A6', '#8F49F2', '#F27ECA'],
  ['#BF4B8B', '#3981BF', '#1F628C', '#D92929'],
  ['#F24452', '#5CE3F2', '#F2E205', '#F2CB05'],
  ['#2d3157', '#34c1bb', '#badccc', '#ffda4d'],
  ['#CCCCCC', '#F2F2F2', '#B3B3B3', '#E6E6E6'],
  ['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D']
];

let colChoice = 0;
let arrayChoice = 0;

let eraserOffToggle = 0;


function preload() {

  audio = loadSound('../sound/Scene3_Circle.mp3');
  click = loadSound('../sound/click.mp3');
}


function setup() {

  createCanvas(window.innerWidth, window.innerHeight);
  dimensionCalc();

  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch here to begin</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);

}
function start(){

  $(".startBtn").remove();
  fullscreen(1);
  // note currently everything resets on windowResized. Unsure if this is logical yet

  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }
  sizeWindow();
  writeTextUI();


  // vector array used to store points, this will max out at 100
  resetVectorStore();

  // create Start and End vectors
  let v1 = createVector((width / 2) + random(-width / 4, width / 4), height / 2 + random(-height / 4, height / 4));
  let v2 = createVector((width / 2) + random(-width / 4, width / 4), height / 2 + random(-height / 10, height / 10));
  let d = (p5.Vector.dist(v1, v2)) / 2;

  // create equal 10 points along that measure
  for (let i = 0; i < d; i++) {
    let tmp = p5.Vector.lerp(v1, v2, i / d)
    poleArr.push(tmp);
  }

  restart();
}

function touchEnded() {
  resetVectorStore();

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


function resetVectorStore() {
  for (let i = 0; i < 1000; i++) {
    vec[i] = 0;
  }
}

function touchStarted() {
  dragTracker = 0;
  axis = createVector(mouseX, mouseY);
  colChoice = (colChoice + 1) % 4;
  stroke(colArray[arrayChoice][colChoice]);
}


function touchMoved() {

  calcDynamics();


  if (eraserOffToggle) {

    brush_rake(x, y, x2, y2, angle1, 24*drawMulti, 20 + (velocity * 2) * drawMulti, 10, 0.001); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  } else {
    eraser();
  }
  render();
}

function render() {


}

function calcDynamics() {

  // calculate the distance between mouse position, and previous position. Average the previous
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  smoothDist.shift();
  smoothDist.push(d);
  velocity = smoothDist.reduce(reducer) / smoothDist.length;

  // calculate mouseDirection
  let dx = mouseX - x;
  let dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI / 2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI / 2) * 1;

}


function eraser() {
  stroke(colArray[arrayChoice][0]);
  strokeWeight(45);
  line(pmouseX, pmouseY, mouseX, mouseY);
}


function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, ns) {

  strokeW = ceil(brushWidth / qtyOfLines);
  strokeWeight(strokeW);

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {

    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)));

    line(vec[i].x, vec[i].y, d.x, d.y);


    vec[i] = d;
  }
}

function restart() {
  arrayChoice++;
  arrayChoice = arrayChoice % colArray.length;
  blendMode(BLEND);
  background(colArray[arrayChoice][0]);
  drawBig();
}

function eraseToggle() {
  console.log("here");
  eraserOffToggle = 0;
  strokeCap(ROUND);
  blendMode(BLEND);

  return false;
}

function drawBig() {
  drawActive();
  drawMulti = 2;
}

function drawSml() {
  drawActive();
  drawMulti = 0.5;
}

function drawActive() {
  eraserOffToggle = 1;
  strokeCap(SQUARE);
  blendMode(DIFFERENCE);
}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();
  writeTextUI();
  checkFS();
  render(); // not currently used
  background(colArray[arrayChoice][0]);

}


function sizeWindow() {
  if (width < height) {
    currentOrientation = "portrait";
  } else {
    currentOrientation = "landscape";
  }
  if (currentOrientation === storedOrientation) {
    stretchWindow();
  } else {
    if (window.orientation < storedOrientationDegrees) {
      direction = 1;
    } else {
      direction = -1;
    }

    if (abs(window.orientation - storedOrientationDegrees) == 270){
      direction = -direction;
    }
    rotateWindow(direction);
    storedOrientationDegrees = window.orientation;
  }
  storedOrientation = currentOrientation;
  calcDimensions();
}

function stretchWindow() {
  // var newtemp = createGraphics(windowWidth, windowHeight);
  // newtemp.image(temp, 0, 0, windowWidth, windowHeight);
  // temp.resizeCanvas(windowWidth, windowHeight);
  // temp = newtemp;
  // newtemp.remove();


}

function rotateWindow(direction) {
  // var newtemp = createGraphics(windowWidth, windowHeight);
  // newtemp.push();
  // newtemp.translate(width / 2, height / 2);
  // newtemp.rotate((PI / 2) * direction);
  // newtemp.translate(-height / 2, -width / 2);
  // newtemp.image(temp, 0, 0, windowHeight, windowWidth);
  // newtemp.pop()
  // temp.resizeCanvas(windowWidth, windowHeight);
  // temp = newtemp;
  // newtemp.remove();




  // TODO: properly detect the orientation
  rotateDirection = rotateDirection * -1;
}

//startSimulation and pauseSimulation defined elsewhere
function handleVisibilityChange() {
  if (document.hidden) {
    audio.stop();
  } else {
    audio.loop(1);
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
