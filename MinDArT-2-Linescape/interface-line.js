let resetButton, saveButton, homeButton, fsButton, toggleBut;
let toggle = 0;

var colours = [
  ['#6A732C', '#18261B', '#BF9649'],
  ['#8AA6A3', '#BFBFBF', '#4C5958'],
  ['#F2B077', '#F24405', '#261813'],
  ['#D94929', '#590902', '#F2B705'],
  ['#F2B705', '#6F7302', '#384001'],
  ['#0D0D0D', '#F2C572', '#262626']
];

let cc = 0;

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

  $('#interface').on("touchstart", function(event){
    event.preventDefault();
  }, {passive: false});
  
  $('#interface').on("click", function(event){
    event.preventDefault();
  }, {passive: false});


// UI elements
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

// Set the button colours
var getColours = header.getElementsByClassName("swatch");
for (var c = 0; c < getColours.length; c++) {
  getColours[c].style.backgroundColor=colours[cc][c];
}

// Buttons on the right..
homeButton = createButton('Main Menu');
homeButton.position(width - (13 * vMax),height - (20 * vMax));
homeButton.class('right-buttons');
homeButton.mousePressed(menu);  

resetButton = createButton('New');
resetButton.position(width - (13 * vMax),height - (14 * vMax));
resetButton.class('right-buttons');
resetButton.mousePressed(next);

saveButton = createButton('Save');
saveButton.position(width - (13 * vMax),height - (8 * vMax));
saveButton.class('right-buttons');
saveButton.mousePressed(saveImg);

  createSwatch();
}

function createSwatch() {

  $(".box").remove();
  $(".toggle").remove();

  swatch = [];
  for (let i = 0; i < 2; i++) {
    swatch[i] = createButton("");
    swatch[i].size(7 * vMax, 10.5 * vMax);
    swatch[i].style("background-color", colours[cc][i]);
    swatch[i].style("border-width", '6px');
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
  }

}

function left_colour() {
  bool = 0;
  resetButtons();
  toggle = false;
  click.play();
}

function right_colour() {
  bool = 0;
  resetButtons();
  toggle = true;
  click.play();
}

function paintOff() {
  for (let i = 0; i < 2; i++) {
    swatch[i].position(((i * 9) + 12) * vMax, height - (11 * vMax));
    swatch[i].size(9 * vMax, 8 * vMax);
  }
}

function saveImg() {
  click.play();
  save('linescape' + month() + day() + hour() + second() + '.jpg');
}