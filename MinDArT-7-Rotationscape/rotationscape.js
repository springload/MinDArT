let brush = [];
let longEdge, shortEdge, circleRad, vMax, wmax, hmax;
let drawLayer, uiLayer;
let brushSelected = 0;
let faderStart;
let xCo = [];
let yCo = [];
let velo = [];
let brushBool = 0;
let intX, intY;
let eraseAlpha;
let storedOrientation, storedOrientationDegrees, rotateDirection;
let centeringActive = 0
let centerX, centerY;
let ellipseAnimated = 0;

let swatchSel = 0;

function preload() {
  bg = loadImage('assets/paper.jpg');
  audio = loadSound('../sound/Scene7_Rotation.mp3');
  click = loadSound('../sound/click.mp3');
  eraseAlpha = loadImage('assets/eraseAlpha3.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Ignores retina displays
  drawLayer = createGraphics(width, height);
  drawLayer.colorMode(RGB, 255, 255, 255, 1000);
  drawLayer.strokeCap(PROJECT);
  uiLayer = createGraphics(width, height);



    var stbtn = $("<div />").appendTo("body");
    stbtn.addClass('startBtn');
    $('<p>Touch here to begin</p>').appendTo(stbtn);
    stbtn.mousedown(start);
    stbtn.mousemove(start);

}

function start() {

  counter = rotArray.length;

  $('.startBtn').remove();
  fullscreen(1);

  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }

  restart();





}



function dimensionCalc() {
  wmax = width / 100;
  hmax = height / 100;
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
    vMax = width / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    vMax = height / 100;
    circleRad = shortEdge * 0.45;
  }

  centerX = width/2;
  centerY = height/2;
}

function mousePressed() {
  faderStart = 600;


  if (centeringActive){
    center();
  }

    return false;
}





function touchMoved() {

  if (centeringActive){
    center();
  }
  makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
    render();



  return false;
}

function makeDrawing(_x, _y, pX, pY) {
///  drawLayer.stroke(0);

    qtyRot = rotArray[counter];

    if (brushSelected < 6){
    for (let i = 0; i < qtyRot; i++){
    drawLayer.push();
    drawLayer.translate(centerX, centerY);
    drawLayer.rotate(((2*PI)/qtyRot)*i);
    drawLayer.translate(-centerX, -centerY);
    brushIt(_x, _y, pX, pY);
    drawLayer.pop();
  }} else {
    brushIt(_x, _y, pX, pY);

  }
}

function brushIt(_x, _y, pX, pY) {

  if (brushSelected === 0) {
  drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 3, 4)); // for line work
  drawLayer.line(_x, _y, pX, pY);
}

  else if (brushSelected === 1) {
    if (faderStart <= 0) {
      brushBool = 0;
    }
    if (faderStart >= 1000) {
      brushBool = 1;
    }
    if (brushBool === 0) {
      faderStart += 20;
    }
    if (brushBool === 1) {
    faderStart -= 20;
    }
    drawLayer.stroke(colorAlpha(colArray[swatchSel][1], .25+(faderStart/2000)));

    drawLayer.line(_x, _y, pX, pY);
  }

  if (brushSelected === 2) {
    for (i = 0; i < 10; i++) {
      let randX = randomGaussian(-5, 5);
      let randY = randomGaussian(-5, 5);
      drawLayer.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }
  }

  else if (brushSelected === 3) {
    for (i = 0; i < 4; i++) {
      drawLayer.point(_x + randomGaussian(-4, 4), _y + randomGaussian(-4, 4));
    }
  } else if (brushSelected === 4) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 30, 40)); // for line work
    drawLayer.line(_x, _y, pX, pY);

  }  else if (brushSelected === 6) {
    drawLayer.blendMode(REMOVE);
    drawLayer.image(eraseAlpha, _x - 50, _y - 50, 100, 100);
    drawLayer.blendMode(BLEND);

  }
}

function reCenterTimeout(){
  setTimeout(reCenter, 100);
}

function reCenter(){
  centeringActive = true;
  $("#centerButton").removeClass("select");
  $("#centerButton").addClass("selectActive")
  centerButton.class("selectActive");
  return false;
}

function center(){
  centeringActive = false;
  $("#centerButton").removeClass("selectActive");
  $("#centerButton").addClass("select");
  centerX = mouseX;
  centerY = mouseY;
  ellipseAnimated = 255;
}

function draw(){

  if (ellipseAnimated > 0){
  render();
  ellipseAnimated -=5;
  fill(255, ellipseAnimated);
  ellipse(centerX, centerY, (255-ellipseAnimated)/4, (255-ellipseAnimated)/4);
}
}

function render() {
  image(bg, 0, 0, width, height);
  image(drawLayer, 0, 0, width, height);
  image(uiLayer, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();
  drawLayer.strokeCap(SQUARE);
  dimensionCalc();
  writeTextUI();
  checkFS();
  render();
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
}


function stretchWindow() {
  uiLayer = createGraphics(width, height);
  var newdrawLayer = createGraphics(windowWidth, windowHeight);
  newdrawLayer.image(drawLayer, 0, 0, windowWidth, windowHeight);
  drawLayer.resizeCanvas(windowWidth, windowHeight);
  drawLayer = newdrawLayer;
  newdrawLayer.remove();
}

function rotateWindow(direction) {
  uiLayer = createGraphics(width, height);
  var newdrawLayer = createGraphics(windowWidth, windowHeight);
  newdrawLayer.push();
  newdrawLayer.translate(width / 2, height / 2);
  newdrawLayer.rotate((PI / 2) * direction);
  newdrawLayer.translate(-height / 2, -width / 2);
  newdrawLayer.image(drawLayer, 0, 0, windowHeight, windowWidth);
  newdrawLayer.pop()
  drawLayer.resizeCanvas(windowWidth, windowHeight);
  drawLayer = newdrawLayer;
  newdrawLayer.remove();

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
