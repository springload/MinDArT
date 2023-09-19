let resetButton, saveButton, fsButton;
let buttons = [];
let currentRake = 1;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function writeTextUI() {

  // TODO: REMOVE ELEMENTS

$(".interface").remove();
$(".select").remove();

    $('#interface'+i).on("touchstart", function(event){
      rake(i);
      event.preventDefault();
    })
    $('#interface'+i).on("click", function(event){
      rake(i);
      event.preventDefault();
    })

    show_btns();

// Add active class to the current button (highlight it)
var header = document.getElementById("myDIV");
var btns = header.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active");
  if (current.length > 0) { 
    current[0].className = current[0].className.replace(" active", "");
  }
  this.className += " active";
  });
}

// Buttons on the right..
homeButton = createButton('Main Menu');
homeButton.position(width - (13 * vMax),height - (20 * vMax));
homeButton.class('right-buttons');
homeButton.mousePressed(menu);  

resetButton = createButton('New');
resetButton.position(width - (13 * vMax),height - (14 * vMax));
resetButton.class('right-buttons');
resetButton.mousePressed(resetTimeout);

saveButton = createButton('Save');
saveButton.position(width - (13 * vMax),height - (8 * vMax));
saveButton.class('right-buttons');
saveButton.mousePressed(saveImg);


}
/**
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
 */
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

function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}

function show_btns() {
    var x = document.getElementsByClassName("btn");
    for (var i = 0; i < x.length; i++) {
      x[i].style.display = "inline";
    }
  }