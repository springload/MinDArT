let col, colSelect;
let eraserVersion = 0; // erase paint = 0, erase trace = 1;
let fsBool = 0;

function paintWarm() {
  eraseState = 0;
  eraserVersion = 0;
  colourBool = false;
  click.play();
  bool = 1;
}

function paintCool() {
  eraseState = 0;
  eraserVersion = 0;
  colourBool = true;
  click.play();
  bool = 1;
}

function switchToTrace() {
  click.play();
  bool = 0;
  eraseState = 0; // revert to True for erase before passing back to eraser function, which inverts
  eraserVersion = 0;
  traceLayer.strokeWeight(8);
  traceLayer.stroke(255, 0, 255, 0.8); // for line work
}

function paintErase() {
  eraseState = 1;
  eraserVersion = true;
  click.play();
}

function drawErase() {
  eraseState = 1;
  eraserVersion = false;
  click.play();
}

function eraseDrawing() {
  if (eraserVersion) {
    paintLayer.noStroke();
    paintLayer.strokeWeight(45);
    paintLayer.stroke(255, 255, 255, 125);
    paintLayer.line(mouseX, mouseY, pmouseX, pmouseY);
  } else {
    traceLayer.blendMode(BLEND);
    traceLayer.strokeWeight(45);
    traceLayer.stroke(255, 0, 0, 0.4);
    traceLayer.line(mouseX, mouseY, pmouseX, pmouseY);
    traceLayer.blendMode(LIGHTEST);
  }
}