let resetButton, saveButton, fsButton, toggleBut;
let toggle = 0;

// var colours = [
//   ['#0D0A07', '#D9D0C7', '#F20C1F', '#BF1515'],
//   ['#345573', '#223240', '#F2913D', '#F24B0F'],
//   ['#172426', '#455559', '#D9C3B0', '#F2DFCE'],
//   ['#BFBFBF','#737373','#404040','#262626'],
//   ['#3C5E73','#F2BBBB','#F24968','#F24444'],
//   ['#3FA663','#2D7345','#3391A6','#262626'],
//   ['#A60321','#D9043D','#F29F05','#D8BA7A'],
//   ['#FAFAFA','#F0F0F0','#E6E6E6','#DCDCDC'],
//   ['#3C2D73','#131A40','#D97E6A','#BF7396'],
//   ['#81edf7','#00a4c0','#f70110','#6e0516'],
//   ['#314035','#5E7348','#A4BF69','#E0F2A0'],
//   ['#a4fba6','#4ae54a', '#0f9200', '#006203'],
//   ['#2d3157','#34c1bb','#badccc','#ffda4d'],
//   ['#D93E30', '#4ED98A', '#F2B705', '#030A8C'],
//   ['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6']
// ];

var colours = [
  ['#D9042B','#F27405','#730217'],
    ['#3E8C49','#F29D35','#F26444'],
      ['#F057F2','#9177F2','#5550F2'],
          ['#F28F6B','#F2C49B','#5FB6D9'],
            ['#788C64','#D1D99A','#BFB063'],
            ['#F2D1B3','#D9C1D0','#F27649'],
              ['#CCCCCC','#F2F2F2','#B3B3B3'],
                  ['#F2C36B','#049DBF','#F21905']
                ];

let cc = 0;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function removeElements(){
//todo
}

function writeTextUI() {

  // TODO: REMOVE ELEMENTS

$(".interface").remove();
$(".select").remove();

// UI elements
newDrawingButton = createButton('Next');
newDrawingButton.position(width - (10 * vMax), height - (6 * vMax));
newDrawingButton.class("select");
newDrawingButton.style('font-size', '1.7vmax');
newDrawingButton.style('height', '4vmax');
newDrawingButton.style('width', '8vmax');
newDrawingButton.mousePressed(next);

saveButton = createButton("Save")
saveButton.class("select");
saveButton.style('font-size', '1.7vmax');
saveButton.style('height', '4vmax');
saveButton.style('width', '8vmax');
saveButton.position(width - (10 * vMax), height - (12 * vMax));
saveButton.mousePressed(saveImg);


//invert
swapButton = createButton('Draw');
swapButton.position(2 * vMax, height - (6 * vMax));
swapButton.class("select");
swapButton.style('font-size', '1.7vmax');
swapButton.style('height', '4vmax');
swapButton.style('width', '8vmax');
swapButton.mousePressed(activateDraw);

slider1 = createSlider(-500, 500, 0); // density
slider1.input(updateSize);
slider1.position(10, -150);
slider1.style('width', '300px');





createSwatch();
}

function createSwatch() {

  $(".box").remove();
  $(".toggle").remove();

  swatch = [];
  for (let i = 0; i < 2; i++) {
    swatch[i] = createButton("");
    swatch[i].size(7 * vMax, 10.5 * vMax);
    swatch[i].style("background-color", colours[cc][i*2]);
        swatch[i].style("border-width", '6px');
            swatch[i].style("border-color", colours[cc][1+(i*2)]);
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
    swatch[i].mousePressed(function() {
     toggleIt();
    });


  }

  toggleBut = createButton('Paint Lines');
  toggleBut.mouseClicked(toggleIt);
  toggleBut.class("toggle");
  toggleBut.id("ui4");
  toggleBut.position(12*vMax, height - (6 * vMax));
  toggleBut.style('width', '18vmax')
  toggleBut.style('font-size', '1.7vmax');
  toggleBut.style('height', '4vmax');

  toggleIt();

}

function toggleIt() {

  bool = 0;
  toggle = !toggle;
  for (let i = 0; i < 2; i++) {
        swatch[i].position(((i * 9)+12) * vMax, height - (11 * vMax));
        swatch[i].size(9 * vMax, 8 * vMax);
  }
var n = 0;
if (toggle){
  n = 1;
}
  swatch[n].position(((toggle * 9)+12) * vMax, height - (15.5 * vMax));
  swatch[n].size(9 * vMax, 12.5 * vMax);
}

function paintOff(){
  for (let i = 0; i < 2; i++) {
        swatch[i].position(((i * 9)+12) * vMax, height - (11 * vMax));
          swatch[i].size(9 * vMax, 8 * vMax);
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

function checkFS(){
  if (!fullscreen()){
  addFS();
}
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}

function saveImg() {
  click.play();
  save('linescape' + month() + day() + hour() + second() + '.jpg');
}
