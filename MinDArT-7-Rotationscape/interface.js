// pick new center resolve

let saveButton, newButton, button3, button, fsButton, centerButton;
let fsBool = 0;

let rectWidth;
let counter = 4; // so that when the restart happens, resets to 0 via the restart function.
let uiInterrupt = 0;

let rotArray = [6, 7, 8, 10, 12, 20, 50];
let colArray = [
['#D97398','#A65398','#263F73','#5679A6'], // 5
// ['#192819','#2c4928','#719b25','#cbe368'], // 5
['#F2F2F2', '#F2913D', '#223240', '#F24B0F'],
['#6D808C','#FFFFFF','#D9AA8F','#F2CAB3'], // 4
['#3C5E73','#F2BBBB','#FFFFFF','#F24444'], // 4
['#F27ECA','#9726A6','#8F49F2','#6C2EF2'], // 5
['#BF4B8B', '#3981BF', '#1F628C', '#D92929'], // adidas-Telstar-50-anniversary // 4
['#F2B705','#F27EA9', '#05AFF2', '#F29F05', '#F2541B'], // Lettering-Series-XXII-1 // 5
['#A60321','#D9043D','#F29F05','#D8BA7A'], // 4
['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet // 5
['#2d3157','#34c1bb','#badccc','#ffda4d'], // 4
['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6'], // 5
['#F2F2F2', '#A6A6A6', '#0D0D0D', '#202020'] // Unchained// 5
]

function writeTextUI() {

  removeElements(); // todo, incorp into writeTextUI

  textSize(longEdge / 50);
  fill(0);
  noStroke();

  newButton = createButton("New")
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
  centerButton.mousePressed(reCenterTimeout);

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

for (let i = 0; i < 4; i++){
  swatch = createButton("");
  swatch.position((12+(6*i)) * vMax, height - (13 * vMax));
  swatch.size(6 * vMax, 10.5 * vMax);
  swatch.style("background-color", colArray[swatchSel][i]);
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

    strokeAssign();

  }

  function strokeAssign(){

    if (brushSelected === 0) {
    drawLayer.stroke(colArray[swatchSel][0]);
  }

    else if (brushSelected === 1) {
      drawLayer.strokeWeight(12); // for line work
    }

    if (brushSelected === 2) {
      drawLayer.strokeWeight(2); // for line work
      drawLayer.stroke(colorAlpha(colArray[swatchSel][2],0.6));
    }

    else if (brushSelected === 3) {
      drawLayer.strokeWeight(8);
        drawLayer.stroke(colorAlpha(colArray[swatchSel][3], 0.55));

    } else if (brushSelected === 4) {
      drawLayer.stroke(colorAlpha(colArray[swatchSel][4], 0.5))
    }  else if (brushSelected === 5) {
      // nothing

    }

  }



function interruptor() {
  uiInterrupt= 1;
}

function restart() {
  counter++;
  swatchSel++;
  if (swatchSel > colArray.length-1){
    swatchSel = 0;
  }

  fill(0);
  dimensionCalc();
  intX = width / 5
  intY = height / 2;

  if (counter >= rotArray.length){
    counter = 0;
  }

  uiLayer.clear();
  drawState = 1;
  drawLayer.clear();
  writeTextUI();

  changeBrush(1);

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

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}
