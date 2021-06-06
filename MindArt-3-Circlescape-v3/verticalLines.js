// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

let axis;

let dragTracker = 0;

let poleArr = [];


let colArray = [
['#345573', '#223240', '#F2913D', '#F24B0F'],
['#345573', '#F2913D', '#223240', '#F24B0F'],
['#6D808C','#FFFFFF','#D9AA8F','#F2CAB3'],
['#172426', '#455559', '#D9C3B0', '#F2DFCE'],
['#3C5E73','#F2BBBB','#FFFFFF','#F24444'],
['#9726A6','#8F49F2','#6C2EF2','#F27ECA'],
['#BF4B8B', '#3981BF', '#1F628C', '#D92929'],
['#F24452', '#5CE3F2', '#F2E205', '#F2CB05'],
['#2d3157','#34c1bb','#badccc','#ffda4d'],
['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6'],
['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D']
];
let colChoice = 0;
let arrayChoice = 0;

let bool = 0;


function preload() {


}

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);
    dimensionCalc();

  newButton = createButton("Next")
  newButton.class("select");
  newButton.position(width - (15 * vMax), height - (12.5 * vMax));
  newButton.style('font-size', '2.6vmax');
  newButton.style('height', '4.5vmax');
  newButton.mousePressed(restart);

  //invert
  swapButton = createButton('Draw');
  swapButton.position(2 * vMax, height - (10 * vH));
  swapButton.class("select");
  swapButton.style('font-size', '1.3vmax');
  swapButton.style('height', '3vmax');
  swapButton.style('width', '6vmax');
  swapButton.mousePressed(invert);


  // vector array used to store points, this will max out at 100
  resetVectorStore();

  // create Start and End vectors
  let v1 = createVector((width/2)+random(-width/4, width/4), height/2+random(-height/4, height/4));
  let v2 = createVector((width/2)+random(-width/4, width/4), height/2+random(-height/10, height/10));
  let d = (p5.Vector.dist(v1, v2))/2;

    // create equal 10 points along that measure
  for (let i = 0; i < d; i++){
    let tmp = p5.Vector.lerp(v1, v2, i/d)
    poleArr.push(tmp);
  }

  restart();
}

function touchEnded() {
  resetVectorStore();

}

function dimensionCalc() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
  vW = width / 100;
  vH = height / 100;
}


function resetVectorStore() {
  for (let i = 0; i < 1000; i++) {
    vec[i] = 0;
  }
}

function touchStarted(){
  dragTracker = 0;
  axis = createVector(mouseX, mouseY);
  colChoice = (colChoice + 1)%4;
  stroke(colArray[arrayChoice][colChoice]);
}


function touchMoved() {
  // background(255);

  // push();
  // // translate(width/2, height/2);
  // translate(axis.x, axis.y)
  // rotate(dragTracker++/100);
  // translate(-axis.x, -axis.y)
  // line(poleArr[0].x, poleArr[0].y, poleArr[poleArr.length-1].x, poleArr[poleArr.length-1].y)
  // pop();
  //
  calcDynamics();


if (bool){

brush_rake(x, y, x2, y2, angle1, 40, 200+(velocity*3), 10, 0.001); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
}
else {
brush_bubbles();
}
render();
}

function render() {


}

function calcDynamics() {

  // calculate the distance between mouse position, and previous position. Average the previous
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  smoothDist.shift();
  smoothDist.push(d);
  velocity = smoothDist.reduce(reducer) / smoothDist.length;

  // calculate mouseDirection
  let dx = mouseX - x;
  let dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI / 2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI / 2) * 1;

}


function brush_bubbles(){

  stroke(colArray[arrayChoice][0]);
  strokeWeight(200);
  line(pmouseX, pmouseY, mouseX, mouseY);

}






function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, ns) {

  strokeW = ceil(brushWidth / qtyOfLines);
  strokeWeight(strokeW);

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {

    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)));

    // // randomise
    // vec[i].x = vec[i].x + random(-ns, ns);
    //   vec[i].y = vec[i].y + random(-ns, ns);

    // strokeWeight(noise(d.x, d.y)*3)

    line(vec[i].x, vec[i].y, d.x, d.y);


  vec[i] = d;
  }
}

function restart(){
  arrayChoice++;
  arrayChoice = arrayChoice%colArray.length;
  blendMode(BLEND);
  background(colArray[arrayChoice][0]);
  console.log(colArray[arrayChoice]);
  // blend(DIFFERENCE);
  bool = 0;
  invert();
}

function invert() {
  bool = abs(bool - 1);

  if (bool){
      strokeCap(SQUARE);
      blendMode(DIFFERENCE);
      swapButton.html('Erase');

  } else {
      strokeCap(ROUND);
      blendMode(BLEND);
      swapButton.html('Draw');
  }

  console.log(bool);
  return false;
}
