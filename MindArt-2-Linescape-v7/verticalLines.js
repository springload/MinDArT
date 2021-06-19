// counters
let xCount = 0, yCount = 0, counter = 0;
let fromCol, toCol;
let store = [];
let arr = [];

// dimensions
let vMax, hMax, wMax;
bool = 1;
let brushSizeBaseline = 60;

// strokes
let strokeBaseline = 0;


//UI elements
let newTextureButton;
let slider1, slider2, slider3;

// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

let drawArray = [];
let drawCounter = 0;

let img;

function preload(){
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
}

function setup() {

  // setup Basics

    createCanvas(window.innerWidth, window.innerHeight);
    pixelDensity(1);







    var stbtn = $("<div />").appendTo("body");
    stbtn.addClass('startBtn');
    $('<p>Touch here to begin</p>').appendTo(stbtn);
    stbtn.mousedown(start);
    stbtn.mousemove(start);


}

function start(){

    $(".startBtn").remove();
  //  fullscreen(1);

    //todo, consider pausing audio context
    if (audio.isPlaying()) {} else {
      audio.loop(1);
    }

    // UI elements
    newTextureButton = createButton('Next');
    newTextureButton.position(width - (8 * vMax), height - (10 * vH));
    newTextureButton.class("select");
    newTextureButton.style('font-size', '1.3vmax');
    newTextureButton.style('height', '3vmax');
    newTextureButton.style('width', '6vmax');
    newTextureButton.mousePressed(next);

    //invert
    swapButton = createButton('Draw');
    swapButton.position(2 * vMax, height - (10 * vH));
    swapButton.class("select");
    swapButton.style('font-size', '1.3vmax');
    swapButton.style('height', '3vmax');
    swapButton.style('width', '6vmax');
    swapButton.mousePressed(invert);

    slider1 = createSlider(-500, 500, 0); // density
    slider1.input(updateSize);
    slider1.position(10, -150);
    slider1.style('width', '300px');

    dimensionCalc();




  // display baselines
  fromCol = color(100, 100, 100);
  toCol = color(230, 230, 230);
  noFill()
  stroke(255, 140);
  let marginX = 0;
  let marginY = 0;

  // run setup functions
  setupDefaults();
  setupArrays();

    // sizeWindow();
    // writeTextUI();
    // restart();


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
  yCount = 40;
  xCount = 35;
  counter = 0;
  stroke(255, 50);
  brushSizeBaseline = 100;

  // fill(255,10);
}

function setupArrays() {
  arr = [];
  for (let i = 0; i < xCount; i++) {
    arr[i] = [];
    for (let j = 0; j < yCount; j++) {
      let _x = (width / xCount) * i;

      _x = map(_x, 0, width, vW * -3, width + (vW * 3)); // ensures beyond margin
      let _y = ((height / yCount) * j);
            _y= map(pow(_y, 2), 0, pow(height, 2), 0, height);
       _y = map(_y, 0, height, vH * -3, height + (vH *3)); // ensures beyond margin
      arr[i][j] = createVector(_x, _y);
    }
  }
  redrawIt();
}

function invert() {
  bool = abs(bool - 1);

  if (bool){

      swapButton.html('Draw');

  } else {


      swapButton.html('Push');
  }

  return false;
}

function next() {
  yCount = int(yCount *= 1.3);
  xCount = int(xCount *= 0.95);
  brushSizeBaseline *= 0.95;

  counter++;

  if (counter > 8) {
    setupDefaults();
  }

  bool = 0;
  invert();
  setupArrays();

  drawArray = [];
  drawCounter = 0;
  drawArray[0] = [];
  redrawIt();

  // console.log(yCount);
}

function touchEnded(){
  if (!bool){
  drawCounter++;
  drawArray[drawCounter] = [];
}
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
    _d = _d / (vMax*0.2);
    arr[_x][_y] = p5.Vector.lerp(arr[_x][_y], temp, 1 / _d);
  }


} else {

drawArray[drawCounter].push(createVector(mouseX, mouseY));
// line(mouseX, mouseY, pmouseX, pmouseY);
}
  redrawIt();
}

function updateSize() {


  curveTightness(slider1.value()/100);
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
  blendMode(SCREEN);
  stroke(255, 100);
  //strokeWeight(constrain(160/yCount, 1, 200));


  for (let y = 0; y < yCount; y++) {
    stroke((1/yCount)*y*255, 180)
    strokeWeight((1/yCount)*y*3);

    beginShape();

let vvW = -10*vW;
let vvH = -10*vH;


   for (let x = 0; x < xCount; x++) {
    curveVertex(arr[x][y].x, arr[x][y].y);
    }

    endShape();

  }


  blendMode(BLEND);

  stroke(50, 255);
  strokeWeight(40);

  for (let i = 0; i < drawArray.length; i++){
    beginShape();

    if (!(drawArray[i] === undefined || drawArray[i].length == 0)){
      for (let j = 0; j < drawArray[i].length; j++){
      curveVertex(drawArray[i][j].x, drawArray[i][j].y);
  }
}

    endShape();
  }

}
