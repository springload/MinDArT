let resetButton, saveButton, homeButton, fsButton;
let appBg = '#1f2b45';

let button1, button2;
var node;

let vW, vMax, vMin;
let multiselectable = 1;

let dotsActive = 0;


function calcDimensions() {
  vW = width / 100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
    lineCanv.strokeWeight(2.2*vMax);
}


function writeTextUI(){

  $(".select").remove();
    $(".select2").remove();

  // Buttons on the right..
homeButton = createButton('Main Menu');
homeButton.position(windowWidth-170,windowHeight-290);
homeButton.class('right-buttons');
homeButton.mousePressed(menu);  

resetButton = createButton('New');
resetButton.position(windowWidth-170,windowHeight-205);
resetButton.class('right-buttons');
resetButton.mousePressed(reset);

saveButton = createButton('Save');
saveButton.position(windowWidth-170,windowHeight-120);
saveButton.class('right-buttons');
saveButton.mousePressed(saveImg);

  // pinButton = createButton("  Turn pins on")
  // pinButton.class("select2");
  // pinButton.id("pin");
  // pinButton.style('font-size', '1.7vmax');
  // pinButton.style('height', '5vmax');
  // pinButton.style('width', '18vmax');
  // pinButton.position((3 * vMax), height - (7 * vMax));
  // pinButton.mousePressed(dotsToggle);
  // node = document.createElement("LI")
  // node.classList.add("fa");
  // node.classList.add("fa-map-pin");
  // $('#pin').prepend(node);

  addButton = createButton("  Add a string")
  addButton.class("select2");
  addButton.id("add");
  addButton.style('font-size', '1.7vmax');
  addButton.style('width', '20vmax');
  addButton.style('height', '5vmax');
  addButton.position(3  * vMax, height - (7 * vMax));
  addButton.mousePressed(addLine);

  var node2 = document.createElement("LI")
  node2.classList.add("fa");
  node2.classList.add("fa-plus");
  $('#add').prepend(node2);
}

function dotsToggle(){
  dotsActive = !dotsActive;

  if (dotsActive){
  $('#pin').html("  Turn pins off");
  $('#pin').removeClass("select2");
  $('#pin').addClass("selectActive");
} else {
  $('#pin').html("  Turn pins on");
  $('#pin').addClass("select2");
  $('#pin').removeClass("selectActive");
}

$('#pin').prepend(node);

 render();
}

function addLine(){
initialiseLine(x.length); // init new line, new array
if (x.length > 2){
  $("#add").remove();
}
render();
}



function saveImg() {
  click.play();
  background(40);
  // paintCanv.background(0, 10);
  image(paintCanv, 0, 0, width, height);

save('stringscape' + month() + day() + hour() + second() + '.jpg');
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
