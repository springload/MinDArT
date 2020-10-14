
let saveButton, newButton, button3, button, fsButton, centerButton;
let fsBool = 0;

let rectWidth;
let counter = 4; // so that when the restart happens, resets to 0 via the restart function.
let uiInterrupt = 0;

let colArray = ["#000000", "#444444", "#888888", "#a1a1a1", "#c2c2c2", "#ffffff"]

function writeTextUI() {

  textSize(longEdge / 50);
  fill(0);
  noStroke();

  newButton = createButton("Next")
  newButton.class("select");
  newButton.position(width - (15 * vMax), height - (12.5 * vMax));
  newButton.style('font-size', '2.6vmax');
  newButton.style('height', '4.5vmax');
  newButton.mousePressed(restart);

  centerButton = createButton("Pick New Center");
  centerButton.class("select");
  centerButton.id("centerButton");
  centerButton.style('font-size', '1.2vmax');
  centerButton.style('height', '4.5vmax');
  centerButton.position(2.5*vMax, 2.5 * vMax);
  centerButton.mousePressed(reCenter);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '2.6vmax');
  saveButton.style('height', '4.5vmax');
  saveButton.position(width - (15 * vMax), height - (6.5 * vMax));
  saveButton.mousePressed(saveImg);

  button = createImg('assets/eraseOn.png');
  button.remove();
  button = createImg('assets/eraseOff.png');
  button.position(1.5 * vMax, height - (12 * vMax));
  button.size(12 * vMax, 12 * vMax);
  button.mousePressed(eraser);

for (let i = 0; i < 6; i++){
  swatch = createButton("");
  swatch.position((12+(6*i)) * vMax, height - (13 * vMax));
  swatch.size(6 * vMax, 10.5 * vMax);
  swatch.style("background-color", colArray[i]);
  swatch.class("box");
  swatch.mousePressed(function() {
    changeBrush(i+1)
  });
}
    selColour = createImg('assets/colSelected.png');
    selColour.position(12 * vMax, height - (16 * vMax));
    selColour.size(6 * vMax, 16 * vMax);
    selColour.mousePressed();
}



function eraser(){
brushSelected = 6;
button.remove();
button = createImg('assets/eraseOn.png');
button.position(1.5 * vMax, height - (12 * vMax));
button.size(12 * vMax, 12 * vMax);
button.mousePressed(eraser);
selColour.remove();

  }


  function changeBrush(brushSel) {
    click.play();
    button.remove();
    button = createImg('assets/eraseOff.png');
    button.position(1.5 * vMax, height - (12 * vMax));
    button.size(12 * vMax, 12 * vMax);
    button.mousePressed(eraser);

    brushSelected = brushSel-1;

    selColour.remove();
    selColour = createImg('assets/colSelected.png');
    selColour.position((12 + ((brushSel-1) * 6)) * vMax, height - (16 * vMax));
    selColour.size(6 * vMax, 16 * vMax);
    selColour.mousePressed();

  }



function interruptor() {
  uiInterrupt= 1;
}


function restartTimeout(){
  click.play();
  setTimeout(restart, 250);
}

function restart() {
  counter++;

  fill(0);
  dimensionCalc();
  intX = width / 5
  intY = height / 2;

  drawState = 1;
  drawLayer.clear();
  uiLayer.clear();

  if (counter >= 10){
    counter = 0;
  }

  if (counter === 1 || counter === 2){
  uiLayer.strokeWeight(1);
  uiLayer.stroke(210);
  uiLayer.line(0, height/2, width, height/2);
}


  if (counter === 0 || counter === 2){
  uiLayer.strokeWeight(1);
  uiLayer.stroke(210);
  uiLayer.line(width/2, 0, width/2, height);
}

if (counter === 3){
uiLayer.strokeWeight(1);
uiLayer.stroke(210);
uiLayer.line(0, 0, width, height);
uiLayer.line(width, 0, 0, height);
}


render();

}

function saveImg() {
    click.play();
  image(bg, 0, 0, width, height);
  image(drawLayer, 0, 0, width, height);
  save('SymmetryScape' + month() + day() + hour() + second() + '.jpg');
}

function checkFS(){
  if (!fullscreen()){
  addFS();
}
}

function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}
