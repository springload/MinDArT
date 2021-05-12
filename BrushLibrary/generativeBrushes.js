// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

function preload() {


}

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);


  // vector array used to store points, this will max out at 100
  resetVectorStore();

}

function touchEnded() {
  resetVectorStore();
}

function resetVectorStore() {
  for (let i = 0; i < 1000; i++) {
    vec[i] = 0;
  }
}

function touchMoved() {


  calcDynamics();
  //brush_scatter1(mouseX, mouseY, 100, velocity/30, 12, 0); // mouseX, mouseY, qty, spread, particleSize, colourRandom
    brush_lineScatter(mouseX, mouseY, pmouseX, pmouseY, 100, velocity, (0.5*velocity)+4, 0); // mouseX, mouseY, qty, spread, particleSize, colorRandom
//  brush_rake(x, y, x2, y2, angle1, 50, 100, 100, velocity/100); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
   // brush_pencil(mouseX, mouseY, pmouseX, pmouseY, 50, velocity);
  // brush_pencil2(mouseX, mouseY, pmouseX, pmouseY, 50, velocity*3);



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

function brush_pencil(_x, _y, pX, pY, t, v) {
   v = constrain(v, 3, 10);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  stroke(0, 50);
  strokeWeight(1);
  for (let i = 0; i < 200; i++) {
     let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    point(v3.x + (noise(_x+i)*v), v3.y + (noise(_y+i)*v));
  }
  stroke(255, 180);
  strokeWeight(2);
  for (let i = 0; i < 1; i++) {
   let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    point(v3.x + random(-v, v), v3.y + random(-v, v));
  }
}

function brush_pencil2(_x, _y, pX, pY, t, v) {
   v = constrain(v, 50, 50);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  stroke(0, 10);
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    line(v0.x + (noise(_x+i)*v), v0.y + (noise(_y+i)*v), v1.x + (noise(_x+i)*v), v1.y + (noise(_y+i)*v));
  }
  stroke(255);
  strokeWeight(random(1, 3));
  for (let i = 0; i < 10; i++) {
   let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    point(v3.x + (noise(pX-i)*v*2), v3.y + (noise(pY-i)*v*2));
  }
}


function brush_scatter1(_x, _y, qty, spread, pSize, colRand) {
  spread = spread * random(0.5, 1);
  fill(0, 10);
  noStroke();
  spread = spread * 20;
  qty = qty * random(0, 1);
  pSize = pSize * random(0.2, 1);
  for (let i = 0; i < qty; i++) {
    let rX = randomGaussian(-spread, spread);
    let rY = randomGaussian(-spread, spread);
    // let rX = spread*noise(i+_x);
    // let rY = spread*noise(i+_y);
    ellipse(_x + (rX), _y + (rY), pSize, pSize);
  }
}

function brush_lineScatter(_x, _y, pX, pY, qty, spread, pSize, colRand) {
  strokeWeight(pSize); // for line work
  stroke(0, 2);
  for (i = 0; i < qty; i++) {

    let rX = randomGaussian(-spread, spread);
    let rY = randomGaussian(-spread, spread);
    line(_x + rX, _y + rY, pX + rX, pY + rY);
  }
}

function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise) {

  strokeW = ceil(brushWidth / qtyOfLines);
  strokeWeight(strokeW);

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    // cool
    // d = p5.Vector.lerp(a, c, (i/qtyOfLines)*random(0,1));

    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)) + randomGaussian(0, (1 / qtyOfLines) * noise));


    if (i === 0 || i === vec.length - 1 || (i % 3) === 2) { // if first line, last line or every 3rd line, then thin, else fat
      strokeWeight(strokeW / 2);
    } else {
      strokeWeight(strokeW);
    }

    var n = vec[i];
    if (i % 3 === 0) {
      stroke(40, opacity);
    } else if (i % 3 === 1) {
      stroke(200, opacity);
    } else if (i % 3 === 2) {
      stroke(40, opacity);
    }

    line(vec[i].x, vec[i].y, d.x, d.y);
    vec[i] = d;
  }
  // display();
}





//
// function brushIt(_x, _y, pX, pY) {
//   if (brushSelected === 3) {
//     drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 2, 3)); // for line work
//     drawLayer.stroke(100, 100, 100, 50);
//     for (i = 0; i < 10; i++) {
//       let randX = randomGaussian(-6, 6);
//       let randY = randomGaussian(-6, 6);
//       drawLayer.line(_x + randX, _y + randY, pX + randX, pY + randY);
//     }
//   }
//   if (brushSelected === 0) {
//     drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 3, 5)); // for line work
//     drawLayer.stroke(10, 10, 10, 120);
//     drawLayer.line(_x, _y, pX, pY);
//   }
//   if (brushSelected === 1) {
//     drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 14, 15)); // for line work
//     drawLayer.stroke(20, 20, 20, 80);
//     drawLayer.line(_x, _y, pX, pY);
//   } else if (brushSelected === 4) {
//     drawLayer.strokeWeight(abs(random(0, 4)));
//     for (i = 0; i < 60; i++) {
//       let tempCol = abs(random(200, 255));
//       drawLayer.stroke(tempCol, tempCol, tempCol, 100);
//       drawLayer.point(_x + randomGaussian(-10, 10), _y + randomGaussian(-10, 10));
//     }
//   } else if (brushSelected === 5) {
//     drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 30, 40)); // for line work
//     drawLayer.stroke(255, 255, 255, 35);
//     drawLayer.line(_x, _y, pX, pY);
//   } else if (brushSelected === 2) {
//     drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 50, 60)); // for line work
//     if (faderStart <= 0) {
//       brushBool = 0;
//     }
//     if (faderStart >= 1000) {
//       brushBool = 1;
//     }
//     if (brushBool === 0) {
//       drawLayer.stroke(100, 100, 100, (faderStart += 20) / 50);
//     }
//     if (brushBool === 1) {
//       drawLayer.stroke(100, 100, 100, (faderStart -= 20) / 50);
//     }
//     drawLayer.line(_x, _y, pX, pY);
//   } else if (brushSelected === 6) {
//     drawLayer.blendMode(REMOVE);
//
//     drawLayer.image(eraseAlpha, _x - 50, _y - 50, 100, 100);
//     drawLayer.blendMode(BLEND);
//
//   }
// }
