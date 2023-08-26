let eraseButton, resetButton, saveButton, homeButton, fsButton;
let currentRake = 1;
let i = 0;
let buttons = [];

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function writeTextUI() {

$(".interface").remove();
$(".select").remove();

// Bottom left buttons..

$('#interface'+i).on("touchstart", function(event){
  rake(i);
  event.preventDefault();
})

$('#interface'+i).on("click", function(event){
  rake(i);
  event.preventDefault();
})

$('#interface'+i).on('contextmenu', event => event.preventDefault());

  eraseButton = createButton('Erase');
  eraseButton.position(10, windowHeight-120);
  eraseButton.class('button-white');
  eraseButton.mousePressed(Eraser);

  brush_1button = createButton(' ');
  brush_1button.position(185,windowHeight-100);
  brush_1button.class('imgbutton-brush1');
  brush_1button.mousePressed(brush_1);
  
  brush_2button = createButton(' ');
  brush_2button.position(320,windowHeight-100);
  brush_2button.class('imgbutton-brush2');
  brush_2button.mousePressed(brush_2);
  
  brush_3button = createButton(' ');
  brush_3button.position(460,windowHeight-100);
  brush_3button.class('imgbutton-brush3');
  brush_3button.mousePressed(brush_3);

// Buttons on the right..
  homeButton = createButton('Main Menu');
  homeButton.position(windowWidth-170,windowHeight-290);
  homeButton.class('button-blue');
  homeButton.mousePressed(menu);  

  resetButton = createButton('New');
  resetButton.position(windowWidth-170,windowHeight-205);
  resetButton.class('button-blue');
  resetButton.mousePressed(resetTimeout);

  saveButton = createButton('Save');
  saveButton.position(windowWidth-170,windowHeight-120);
  saveButton.class('button-blue');
  saveButton.mousePressed(saveImg);


}

//function menu() {
  //window.location.href = "https://jameswilce.github.io/DevMinDArT";
  //window.location.href = "/";
//}

function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}

function Eraser() {
  change(1, 200, 1);
  eraseActive = 1;
  click.play();
}

function brush_1() {
  change(5, 60, 100);
  eraseActive = 0;
  click.play();
}

function brush_2() {
  change(15, 100, 100);
  eraseActive = 0;
  click.play();
}
function brush_3() {
  change(60, 150, 100);
  eraseActive = 0;
  click.play();
}

function rake(version) {

  currentRake = version;

  if (version == 0) {
    change(1, 200, 1);
    eraseActive = 1;
  }
  if (version == 1) {
    change(5, 60, 100);
    eraseActive = 0;
  }
  if (version == 2) {
    change(15, 100, 100);
    eraseActive = 0;
  }
  if (version == 3) {
    change(60, 150, 100);
    eraseActive = 0;
  }

  click.play();
}

function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('../assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}
