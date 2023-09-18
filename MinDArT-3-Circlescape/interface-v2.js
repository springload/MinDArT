let resetButton, saveButton, homeButton, fsButton, toggleBut, vMin;

function writeTextUI() {

$(".interface").remove();
$(".select").remove();

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
  resetButton.mousePressed(restart);

  saveButton = createButton('Save');
  saveButton.position(width - (13 * vMax),height - (8 * vMax));
  saveButton.class('right-buttons');
  saveButton.mousePressed(saveImg);
  
}

/**
function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('../assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}

function checkFS(){
  if (!fullscreen()){
  addFS();
  }
}

 */
function saveImg() {
  click.play();
  save('circlescape' + month() + day() + hour() + second() + '.jpg');
}


function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
        vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
}