let col, colSelect;
let eraserVersion = 0; // erase paint = 0, erase trace = 1;
let fsBool = 0;

function writeTextUI() {
  fill(0);
  noStroke();
  drawErase();
}

function paintWarm() {
  eraseState = 0;
  eraserVersion = 0;
  resetButtons();
  colourBool = false;
  click.play();
  bool = 1;
}

function paintCool() {
  eraseState = 0;
  eraserVersion = 0;
  resetButtons();
  colourBool = true;
  click.play();
  bool = 1;
}

function switchToTrace() {
  click.play();
  bool = 0;
  eraseState = 0; // revert to True for erase before passing back to eraser function, which inverts
  eraserVersion = 0;
  resetButtons();
  traceLayer.strokeWeight(8);
  traceLayer.stroke(255, 0, 255, 0.8); // for line work
}

function paintErase() {
  resetButtons();
  eraseState = 1;
  eraserVersion = true;
  click.play();
}

function drawErase() {
  resetButtons();
  eraseState = 1;
  eraserVersion = false;
  click.play();
}
