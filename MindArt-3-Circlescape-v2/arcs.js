var a2, w, h;

var mX = 0;
var mY = 0;
var tX, tY;
var counter = 0;
var r, a;
var c;
var toggle = 0;
var button;
var lineQty = 0;

var centerW;
var centerY;

var vectors = [];
let aC = 0;

let colVersion = 0;
let levelVersion = 0;
let levelMax = 9;
let gridLevels = [
  [1, 1],
  [2, 1],
  [3, 1],
  [2, 2],
  [3, 4]
];
var selectedVertice = 0;

var colSel = 0;
var currentC = 0;
var colours = [
  ['#0D0A07', '#D9D0C7', '#F20C1F', '#BF1515'],
  ['#345573', '#223240', '#F2913D', '#F24B0F'],
  ['#172426', '#455559', '#D9C3B0', '#F2DFCE'],
  ['#3C5E73','#F2BBBB','#F24968','#F24444'],
  ['#3FA663','#2D7345','#3391A6','#262626'],
  ['#A60321','#D9043D','#F29F05','#D8BA7A'],
  ['#3C2D73','#131A40','#D97E6A','#BF7396'],
  ['#81edf7','#00a4c0','#f70110','#6e0516'],
  ['#192819','#2c4928','#719b25','#cbe368'],
  ['#314035','#5E7348','#A4BF69','#E0F2A0'],
  ['#a4fba6','#4ae54a', '#0f9200', '#006203'],
  ['#2d3157','#34c1bb','#badccc','#ffda4d'],
  ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  ['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6']
  ['#345573', '#F2913D', '#223240', '#F24B0F'], // I think ill be fine after eating ice cream
  ['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D', '#404040'], // Unchained
  ['#A6886D', '#F2E0D0', '#402E27', '#F29D52', '#221F26'], // the Planets
  ['#BF4B8B', '#3981BF', '#1F628C', '#590808', '#D92929'], // adidas-Telstar-50-anniversary
  ['#A64456', '#422A59', '#F2B366', '#D9BBA0', '#D96D55'], // Lettering-Love
  ['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet
  ['#D9A74A', '#BF6E3F', '#A67563', '#BFA095', '#BF4141'], // Sparkling-Botanicals-1'
  ['#F27EA9', '#05AFF2', '#F2B705', '#F29F05', '#F2541B'] // Lettering-Series-XXII-1
  // new colours
];

function preload() {
  paper = loadImage('assets/texture.jpg');
}


function start() {
  $(".startBtn").remove();
  fullscreen(1);
  // note currently everything resets on windowResized. Unsure if this is logical yet
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);

  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch here to begin</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);

}

function windowResized(){


  resizeCanvas(windowWidth, windowHeight);
  calcDimensions();

  writeTextUI();


  temp = createGraphics(windowWidth, windowHeight);
  perm = createGraphics(windowWidth, windowHeight);
  background(245);
  fill(0);
  strokeCap(SQUARE);
  temp.strokeCap(SQUARE);
  perm.strokeCap(SQUARE);

  perm.stroke(80, 24, 200, 100);
  perm.strokeWeight(25);
  perm.noFill();
  temp.stroke(80, 24, 200, 100);
  temp.strokeWeight(2);
  temp.noFill();


  colVersion = colours.length; // set to max, as this will cause reset to 0;
  levelVersion = levelMax;


  reset();

}


function changeCol(cc){

  if (cc >= 3){cc = 0;}
  if (cc <= 1){toggle = 0;} else {toggle = 1;}
  currentC = cc;
  c = colours[colVersion][cc];
  colSel = colorAlpha(c, 0.1);

  for (let i = 0; i < 3; i++) {
        swatch[i].position((((i) * 7)+3) * vMax, height - (9 * vMax));
        swatch[i].size(7 * vMax, 6 * vMax);
  }

  swatch[cc].position((((cc) * 7)+3) * vMax, height - (13.5 * vMax));
      swatch[cc].size(7 * vMax, 10.5 * vMax);
}

function reset(){



    colVersion++;
    if (colVersion >= colours.length) {
      colVersion = 0;
    }

    levelVersion++;
    if (levelVersion >= levelMax) {
      levelVersion = 0;
    }


    vectors = [];

    if (levelVersion < gridLevels.length) {
      makeGrid();
    } else {
      scatterPoints();
    }
  $(".box").remove();
  createSwatch();

  temp.clear();
  perm.clear();
  clear();
  render();
}

function makeGrid() {

  let xQty = gridLevels[levelVersion][0];
  let yQty = gridLevels[levelVersion][1];


  for (let i = 0; i < xQty; i++) {
    for (let j = 0; j < yQty; j++) {
      noStroke();
      fill(0, 100);
      // vectors.push(createVector(random(0,width), random(0, height)));
      vectors.push(createVector((width / (xQty + 1)) * (i + 1), (height / (yQty + 1)) * (j + 1)));
      ellipse(vectors[vectors.length - 1].x, vectors[vectors.length - 1].y, width / 50, width / 50);
    }
  }
}

function scatterPoints() {

  let n = levelVersion - gridLevels.length;
  let qty = 1 + (n * n);

  for (let i = 0; i < qty; i++) {

    let m = height / 10; // margin
    vectors.push(createVector(randomGaussian(width / 2, width / 4), randomGaussian(height / 2, height / 4)));

    // make dots (consider delete)
    noStroke();
    fill(0, 100);
    ellipse(vectors[vectors.length - 1].x, vectors[vectors.length - 1].y, width / 50, width / 50);

  }
}

function touchStarted() {

  w = 0;
  h = 0;

  let tempHigh = 1000;
  selectedVertice = 0;

  // select closest point
  for (let i = 0; i < vectors.length; i++) {
    let temp = dist(mouseX, mouseY, vectors[i].x, vectors[i].y);
    if (temp < tempHigh) {
      tempHigh = temp;
      selectedVertice = i;
    }
  }

  centerW = vectors[selectedVertice].x;
  centerY = vectors[selectedVertice].y;

  // select Radius
  r = 2 * dist(mouseX, mouseY, centerW, centerY);

  temp.stroke(colSel);

  w = abs(centerW - mouseX) + 100;
  h = abs(centerY - mouseY) + 100;

  mX = mouseX;
  mY = mouseY;
  tX = mouseX; // currently obsolete
  tY = mouseY; // currently obsolete
}

function touchMoved() {
render();

// draw the current selectedVertice bigger;
fill(colours[colVersion][1]);
ellipse(vectors[selectedVertice].x, vectors[selectedVertice].y, vMax*4, vMax*4);

return false;
}

function render(){
  if (currentC == 0) {
    temp.stroke(colSel);
    temp.noFill();
    lineQty = 10;
    vertRand = 2;
    angRand = 1;
  } else if (currentC ==1) {
    temp.stroke(colSel);
    temp.noFill();
    lineQty = 100;
    vertRand = 10;
    angRand = 4;
  } else {
    lineQty = 10;
    temp.noStroke();
    temp.fill(colSel);
    vertRand = 2;
    angRand = 4;
  }

  // set background
  blendMode(BLEND);
    background(colours[colVersion][3]);

  blendMode(MULTIPLY);
  image(paper, 0, 0, width, height);
  blendMode(BLEND);

  // draw ellipses for each point using the vertices
  fill(colours[colVersion][0]);
  for (let i = 0; i < vectors.length; i++) {
    ellipse(vectors[i].x, vectors[i].y, vMax*2, vMax*2);
  }



  image(temp, 0, 0, windowWidth, windowHeight);
  image(perm, 0, 0, windowWidth, windowHeight);
  fill(255);
  blendMode(DIFFERENCE);
  textSize(width / 50);
  text("colour set " + colVersion, width - (width / 5), height / 10);
  blendMode(BLEND);

  a = atan2(mouseY - centerY, mouseX - centerW);
  a2 = atan2(mY - centerY, mX - centerW);

  var diff = a2 - a;

  if (abs(diff) > 5) {
    diff = a - a2
  }

  for (var i = 0; i < lineQty; i++) {
    var nR = randomGaussian(-angRand, angRand);
    a2 = atan2(nR + mY - centerY, nR + mX - centerW);
    a = atan2(nR + mouseY - centerY, nR + mouseX - centerW);

    var n = randomGaussian(-vertRand, vertRand);

    if (diff <= 0) {
      temp.arc(centerW, centerY, r + n, r + n, a2, a);
      counter++;
    } else {
      temp.arc(centerW, centerY, r + n, r + n, a, a2);
      counter--;
    }
  }

  mX = mouseX;
  mY = mouseY;
}

function touchEnded() {
  counter = 0;
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function dimensionCalc() {

  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
    vMax = width / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    vMax = height / 100;
    circleRad = shortEdge * 0.45;
  }
}
