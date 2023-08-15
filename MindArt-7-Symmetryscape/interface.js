
let saveButton, newButton, button3, button, fsButton;
let fsBool = 0;

let rectWidth;
let counter = 4; // so that when the restart happens, resets to 0 via the restart function.
let uiInterrupt = 0;

let colArray = ["#000000", "#444444", "#888888", "#a1a1a1", "#c2c2c2", "#ffffff"]

function writeTextUI() {

  removeElements(); 

  textSize(longEdge / 50);
  fill(0);
  noStroke();

  newButton = createButton("New")
  newButton.class("select");
  newButton.position(width - (15 * vMax), height - (12.5 * vMax));
  newButton.style('font-size', '2.6vmax');
  newButton.style('height', '4.5vmax');
  newButton.mousePressed(restart);

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

    swatch1 = createButton("");
    swatch1.position(12 * vMax, height - (13 * vMax));
    swatch1.size(6 * vMax, 10.5 * vMax);
    swatch1.style("background-color", colArray[0]);
    swatch1.class("box");
    swatch1.mousePressed(function() {
      changeBrush(1)
    });

    swatch2 = createButton("");
    swatch2.position(18 * vMax, height - (13 * vMax));
    swatch2.size(6 * vMax, 10.5 * vMax);
    swatch2.style("background-color", colArray[1]);
    swatch2.class("box");
    swatch2.mousePressed(function() {
      changeBrush(2)
    });

    swatch3 = createButton("");
    swatch3.position(24 * vMax, height - (13 * vMax));
    swatch3.size(6 * vMax, 10.5 * vMax);
    swatch3.style('background-color', colArray[2]);
    swatch3.class("box");
    swatch3.mousePressed(function() {
      changeBrush(3)
    });

    swatch4 = createButton("");
    swatch4.position(30 * vMax, height - (13 * vMax));
    swatch4.size(6 * vMax, 10.5 * vMax);
    swatch4.style("background-color", colArray[3]);
    swatch4.class("box");
    swatch4.mousePressed(function() {
      changeBrush(4)
    });

    swatch5 = createButton("");
    swatch5.position(36 * vMax, height - (13 * vMax));
    swatch5.size(6 * vMax, 10.5 * vMax);
    swatch5.style("background-color", colArray[4]);
    swatch5.class("box");
    swatch5.mousePressed(function() {
      changeBrush(5)
    });

    swatch6 = createButton("");
    swatch6.position(42 * vMax, height - (13 * vMax));
    swatch6.size(6 * vMax, 10.5 * vMax);
    swatch6.style("background-color", colArray[5]);
    swatch6.class("box");
    swatch6.mousePressed(function() {
      changeBrush(6)
    });

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

  if (counter >= 4){
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
  fsButton = createImg("../assets/enterFS.png", "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}
