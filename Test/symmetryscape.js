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
let appStarted = 0;

function preload() {
  bg = loadImage('assets/paper.jpg');
  audio = loadSound('../sound/Scene8_Symmetry .mp3');
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

  $('.startBtn').remove();
  fullscreen(1);
  windowResized(); // note, this seems unecessary, but for some reason am not always getting fs, this forces it for now.
  appStarted = 1;

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
}

function mousePressed() {
  faderStart = 600;

  return false;
}





function touchMoved() {
  if (appStarted){
  makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
    render();
  }
  return false;
}

function makeDrawing(_x, _y, pX, pY) {
  drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 1, 2)); // for line work
  drawLayer.stroke(0);
  if (counter === 0) {
    brushIt(_x, _y, pX, pY);
    brushIt(width - _x, _y, width - pX, pY);
  } else if (counter === 1) {
    brushIt(_x, _y, pX, pY);
    brushIt(_x, height - _y, pX, height - pY);
  } else if (counter === 2) {
    brushIt(_x, _y, pX, pY);
    brushIt(width - _x, _y, width - pX, pY);
    brushIt(_x, height - _y, pX, height - pY);
    brushIt(width - _x, height - _y, width - pX, height - pY);
  } else if (counter === 3) {
    drawLayer.push();
    brushIt(_x, _y, pX, pY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 0.5);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(_x, _y, pX, pY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 1);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(_x, _y, pX, pY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 1.5);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(_x, _y, pX, pY);
    drawLayer.pop();
  }
}

function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 3) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 2, 3)); // for line work
    drawLayer.stroke(100, 100, 100, 50);
    for (i = 0; i < 10; i++) {
      let randX = randomGaussian(-6, 6);
      let randY = randomGaussian(-6, 6);
      drawLayer.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }
  }
  if (brushSelected === 0) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 3, 5)); // for line work
    drawLayer.stroke(10, 10, 10, 120);
    drawLayer.line(_x, _y, pX, pY);
  }
  if (brushSelected === 1) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 14, 15)); // for line work
    drawLayer.stroke(20, 20, 20, 80);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 4) {
    drawLayer.strokeWeight(abs(random(0, 4)));
    for (i = 0; i < 60; i++) {
      let tempCol = abs(random(200, 255));
      drawLayer.stroke(tempCol, tempCol, tempCol, 100);
      drawLayer.point(_x + randomGaussian(-10, 10), _y + randomGaussian(-10, 10));
    }
  } else if (brushSelected === 5) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 30, 40)); // for line work
    drawLayer.stroke(255, 255, 255, 35);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 2) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 50, 60)); // for line work
    if (faderStart <= 0) {
      brushBool = 0;
    }
    if (faderStart >= 1000) {
      brushBool = 1;
    }
    if (brushBool === 0) {
      drawLayer.stroke(100, 100, 100, (faderStart += 20) / 50);
    }
    if (brushBool === 1) {
      drawLayer.stroke(100, 100, 100, (faderStart -= 20) / 50);
    }
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 6) {
    drawLayer.blendMode(REMOVE);

    drawLayer.image(eraseAlpha, _x - 50, _y - 50, 100, 100);
    drawLayer.blendMode(BLEND);

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
  drawLayer.strokeCap(PROJECT);
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
