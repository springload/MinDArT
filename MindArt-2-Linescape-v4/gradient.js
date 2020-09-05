var colQty = 1;
var colWidth;
var colYtrack = [];
var drawActive = false;

var lineVersion = 0;
var vMax;
var div = 1;

var c1, c2, c3, c4;

var fg;

var restart;
var sel = 0;

var colours = [
  ['#0D0A07', '#D9D0C7', '#F20C1F', '#BF1515'],

];

var numPattern = [1, 2, 4, 8, 16, 32, 64, 128];

var cc = 0; // currentColour
var toggle = 1;

var touchDownY;

var currentOrientation, storedOrientation, storedOrientationDegrees, rotateDirection;



function setup() {
  createCanvas(windowWidth, windowHeight);
  paper = loadImage('assets/paper1.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
  fg = createGraphics(windowWidth, windowHeight);
  intermedia = createGraphics(windowWidth, windowHeight);
  fg.noFill();
  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch here to begin</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);
}

function start() {
  $(".startBtn").remove();
  fullscreen(1);
  // todo, consider pausing audio context
  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }
  sizeWindow();
  writeTextUI();
  restart();
}
//
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//
//   calcDimensions();
//
//
//   writeTextUI();
//
//
//
//   // cc = floor(random(0, colours.length));
//   restart();
//   lineVersion = 0
// }

function toggleIt() {
  toggle = !toggle;
  for (let i = 0; i < 2; i++) {
    swatch[i].position(((i * 9) + 3) * vMax, height - (9 * vMax));
    swatch[i].size(9 * vMax, 6 * vMax);
  }
  var n = 0;
  if (toggle) {
    n = 1;
  }
  swatch[n].position(((toggle * 9) + 3) * vMax, height - (15.5 * vMax));
  swatch[n].size(9 * vMax, 12.5 * vMax);
}

function restart() {
  cc++;
  if (cc >= colours.length) {
    cc = 0;
  }
  lineVersion++;

  if (lineVersion >= numPattern.length) {
    lineVersion = 0;
  }
  // clear both layers
  fg.clear();
  intermedia.clear();
  colQty = floor(random(1, 10));

  c1 = colours[cc][0];
  c2 = colours[cc][1];
  c3 = colours[cc][2];
  c4 = colours[cc][3];

  // make solid gradient, add smaller gradients
  from = color(c1);
  to = color(c2);

  for (var j = 0; j < height; j++) {
    intermedia.stroke(lerpColor(from, to, j / height));
    intermedia.line(0, j, width, j);
  }
  render();
  createSwatch();

}

function touchStarted() {
  touchDownY = mouseY;
}

function touchMoved() {

  // colQty = numPattern[lineVersion];
  // colWidth = width / colQty;
  //
  // var tempSel = floor(mouseX / colWidth);
  // if (sel != tempSel) {
  //   sel = floor(mouseX / colWidth)
  // }
  //   colYtrack[sel] = mouseY;
  //   if (toggle) {
  //     from = color(c3);
  //     to = color(c4);
  //   } else {
  //     from = color(c1);
  //     to = color(c2);
  //   }
  //     if (mouseY >= touchDownY) {
  //       for (var j = touchDownY; j < mouseY; j+=10) {
  //         fg.stroke(lerpColor(to, from, j / mouseY));
  //         fg.line((sel * colWidth), j, (sel * colWidth) + colWidth, j);
  //       }
  //     } else {``
  //         for (var j = touchDownY; j > mouseY; j-=10) {
  //         fg.stroke(lerpColor(to, from, mouseY / j));
  //         fg.line((sel * colWidth), j, (sel * colWidth) + colWidth, j);
  //       }
  //     }
  // render();
  fill(255);
  ellipse(mouseX, mouseY, 100, 100);
}


function render() {
  intermedia.image(fg, 0, 0, width, height);
  blendMode(BLEND);
  image(paper, 0, 0, width, height);
  blendMode(MULTIPLY);
  image(intermedia, 0, 0, width, height);
  // fill(255);
  // blendMode(DIFFERENCE);
  // textSize(width / 50);
  // text(colours[cc][0], width - width / 5, height / 10);

}

function touchEnded() {
  drawActive = false;
}



function checkFS() {

  if (!fullscreen()) {
    addFS();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();

  // removeElements();
  writeTextUI();
  render();
  checkFS();

  fg.strokeWeight(11);
  fg.strokeCap(SQUARE);
}




function sizeWindow() {

  // image(background, 0, 0, width, height);

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

    if (abs(window.orientation - storedOrientationDegrees) == 270) {
      direction = -direction;
    }

    rotateWindow(direction);


    storedOrientationDegrees = window.orientation;



  }
  storedOrientation = currentOrientation;


  calcDimensions();



}



function stretchWindow() {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.image(fg, 0, 0, windowWidth, windowHeight);
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;
  newfg.remove();

  var newintermedia = createGraphics(windowWidth, windowHeight);
  newintermedia.image(intermedia, 0, 0, windowWidth, windowHeight);
  intermedia.resizeCanvas(windowWidth, windowHeight);
  intermedia = newintermedia;
  newintermedia.remove();


}

function rotateWindow(direction) {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.push();
  newfg.translate(width / 2, height / 2);
  newfg.rotate((PI / 2) * direction);
  newfg.translate(-height / 2, -width / 2);
  newfg.image(fg, 0, 0, windowHeight, windowWidth);
  newfg.pop()
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;
  newfg.remove();

  var newintermedia = createGraphics(windowWidth, windowHeight);
  newintermedia.push();
  newintermedia.translate(width / 2, height / 2);
  newintermedia.rotate((PI / 2) * direction);
  newintermedia.translate(-height / 2, -width / 2);
  newintermedia.image(intermedia, 0, 0, windowHeight, windowWidth);
  newintermedia.pop()
  intermedia.resizeCanvas(windowWidth, windowHeight);
  intermedia = newintermedia;
  newintermedia.remove();



  // TODO: properly detect the orientation
  rotateDirection = rotateDirection * -1;
}

// //startSimulation and pauseSimulation defined elsewhere
// function handleVisibilityChange() {
//   if (document.hidden) {
//     audio.stop();
//   } else {
//     audio.loop(1);
//   }
// }
//
// document.addEventListener("visibilitychange", handleVisibilityChange, false);
