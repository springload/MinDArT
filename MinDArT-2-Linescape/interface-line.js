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

function removeElements() {
  //todo
}

function writeTextUI() {

  // TODO: REMOVE ELEMENTS

  $(".interface").remove();
  $(".select").remove();

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
homeButton.position(windowWidth-170,windowHeight-290);
homeButton.class('right-buttons');
homeButton.mousePressed(menu);  

resetButton = createButton('New');
resetButton.position(windowWidth-170,windowHeight-205);
resetButton.class('right-buttons');
resetButton.mousePressed(next);

saveButton = createButton('Save');
saveButton.position(windowWidth-170,windowHeight-120);
saveButton.class('right-buttons');
saveButton.mousePressed(saveImg);

  //invert
  /**
  swapButton = createButton('Draw');
  swapButton.position(2 * vMax, height - (6 * vMax));
  swapButton.class("select");
  swapButton.style('font-size', '1.7vmax');
  swapButton.style('height', '4vmax');
  swapButton.style('width', '8vmax');
  swapButton.mousePressed(activateDraw);

*/
/**
  slider1 = createSlider(-500, 500, 0); // density
  slider1.input(updateSize);
  slider1.position(10, -150);
  slider1.style('width', '300px');
 */
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
    //swatch[i].style("border-color", colours[cc][1 + (i * 2)]); 
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
    swatch[i].mousePressed(function() {
      toggleIt();
    });

  }
/**
  toggleBut = createButton('Paint Lines');
  toggleBut.mouseClicked(toggleIt);
  toggleBut.class("toggle");
  toggleBut.id("ui4");
  toggleBut.position(12 * vMax, height - (6 * vMax));
  toggleBut.style('width', '18vmax')
  toggleBut.style('font-size', '1.7vmax');
  toggleBut.style('height', '4vmax');
 */
  toggleIt();

}
function toggleIt() {
  click.play();
  bool = 0;
  resetButtons();
  toggle = !toggle;

  if (!toggle) {
      resetButtons();
      setActive("btnPaint", "btnleft");

  } else {
      resetButtons();
      setActive("btnPaint", "btnright");
  }
  //bool = 1;
}

function paintOff() {
  for (let i = 0; i < 2; i++) {
    swatch[i].position(((i * 9) + 12) * vMax, height - (11 * vMax));
    swatch[i].size(9 * vMax, 8 * vMax);
  }
}

function addFS() {
  $('.fsButton').remove();
  fsButton = createImg('../assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function checkFS() {
  if (!fullscreen()) {
    addFS();
  }
}

function fs() {
  fullscreen(1);
  $('.fsButton').remove();
}

function saveImg() {
  click.play();
  save('linescape' + month() + day() + hour() + second() + '.jpg');
}

function setActiveElementsById(id) {
    const element = document.getElementById(id);
    if (element && element.classList.contains('active')) {
      const otherElement = document.getElementById('btnPaint');
      if (otherElement) {
        otherElement.classList.add('active');
      }
    }
  }

  function setActive (id1, id2) {
    resetButtons();
    document.getElementById(id1).classList.add("active");
    document.getElementById(id2).classList.add("active");
  }