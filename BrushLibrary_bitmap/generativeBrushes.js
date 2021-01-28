/* TODO:
- Look into https://github.com/diwi/PixelFlow
- consider how the greyscale value from a brush, could transfer to a Hue value via some sort of mask, or m
perhps an array of pixels that reads the pixel values 1 by 1, and then rewrites them as hue...
- could tint work
*/

// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

// brush orientation
let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];
let d = 0; // distance

let brushLib = [];
let brush = 1;

// let sl1, sl2, sl3, sl4, sl5, sl6, sl7, sl8;

function preload() {

  for (let i = 1; i < 50; i++) {
    brushLib[i] = loadImage('assets/brushes/brush-' + i + '.png');
  }


}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(200);
  colorMode(HSB, 360, 100, 100, 100);

  createUI();

  // vector array used to store points, this will max out at 100
  brushLayer = createGraphics(width, height);
  brushLayer.tint(0, 0, 0, 10);
  brushLayer.image(brushLib[41], 0, 0, width, height);


newScene();
}


function createUI() {


  slider = createSlider(2, 100, 10);
  slider.position(10, 10);
  slider.style('width', '120px');


  slider2 = createSlider(0, 100, 1);
  slider2.position(10, 30);
  slider2.style('width', '120px');


  slider3 = createSlider(0, 100, 1);
  slider3.position(10, 50);
  slider3.style('width', '120px');


  slider4 = createSlider(0, 100, 1);
  slider4.position(10, 70);
  slider4.style('width', '120px');


  slider5 = createSlider(0, 200, 100);
  slider5.position(10, 90);
  slider5.style('width', '120px');



  button = createButton('nextBrush');
  button.position(10, 110);
  button.mousePressed(change);

  slider6 = createSlider(0, 255, 100);
  slider6.position(10, 130);
  slider6.style('width', '120px');

  slider6.input(change2)


  button = createButton('clear');
  button.position(10, 180);
  button.mousePressed(newScene);
}

function newScene() {

  background(200);

  textSize(20);
  fill(20);
  text('size', 130, 25);
  text('sizeJitter', 130, 45);
  text('angleJitter', 130, 65);
  text('scatter', 130, 85);
  text('density', 130, 105);
  text('Opacity', 130, 145);
  text(brush, 110, 125);

}


function change() {

  brush++;
  if (brush > 40) {
    brush = 1;
  }

  change2();

}

function change2() {



  brushLayer = createGraphics(width, height);
  brushLayer.tint(0, 0, 0, slider6.value());
  brushLayer.image(brushLib[brush], 0, 0, width, height);

  text(brush, 110, 125);

}



function touchMoved() {
  calcDynamics();
  //brush_rake(x, y, x2, y2, angle1, 200, 100, 25, 10); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  let size = slider.value();
  let sizeJitter = slider2.value() / 100; // float between 0 and 1.0 (Max);
  let angleJitter = slider3.value() / 100; // float between 0 and 1.0 (Max);
  let scatter = slider4.value() / 100; // float between 0 and 2.0 (Max);
  let density = slider5.value() / 100;
  let rotateActive = 1;
  if (!rotateActive) {
    angle1 = 0;
  }
  brushImg2(mouseX, mouseY, pmouseX, pmouseY, angle1, angleJitter, size, sizeJitter, scatter, density, d);
  render();
}

function render() {}

function calcDynamics() {
  // calculate the distance between mouse position, and previous position. Average the previous
  d = dist(mouseX, mouseY, pmouseX, pmouseY);
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

function brushImg2(_x, _y, x2, y2, a, aJ, s, sJ, sC, dens, dist) {
  dist = dist * dens;
  let v1 = createVector(_x, _y);
  let v2 = createVector(x2, y2);
  for (let i = 1; i < int(dist); i++) {
    dist = constrain(dist, 1, 1000);
    let v3 = p5.Vector.lerp(v1, v2, i / (int(dist)));
    let _s = s * (1 - (randomGaussian(sJ)));
    let _a = a + (2 * PI * random(aJ));
    let sCx = random(-sC, sC) * s;
    let sCy = random(-sC, sC) * s;
    v3.x = v3.x + sCx;
    v3.y = v3.y + sCy;

    push();
    translate(v3.x, v3.y);
    rotate(_a);
    translate(-v3.x, -v3.y);
    image(brushLayer, v3.x - (_s / 2), v3.y - (_s / 2), _s, _s);
    pop();
  }
  render();
}
