let brush = [];
let longEdge, shortEdge, circleRad, vMax, wmax, hmax;
let drawLayer;
let brushSelected = 0;
let faderStart;
let xCo = [];
let yCo = [];
let velo = [];
let brushBool = 0;
let intX, intY;
let centeringActive = 0;
let centerX, centerY;
let ellipseAnimated = 0;
let justSetCenter = false; // prevents drawing on the same click/touch as setting the center
let selectedPalette = 0;
let counter = -1; // resets to 0 via the restart function.
let rotArray = [6, 7, 8, 10, 12, 20, 50];
let palettes = [
  ["#D97398", "#A65398", "#263F73", "#5679A6"], // 5
  // ['#192819','#2c4928','#719b25','#cbe368'], // 5
  ["#F2F2F2", "#F2913D", "#223240", "#F24B0F"],
  ["#6D808C", "#FFFFFF", "#D9AA8F", "#F2CAB3"], // 4
  ["#3C5E73", "#F2BBBB", "#FFFFFF", "#F24444"], // 4
  ["#F27ECA", "#9726A6", "#8F49F2", "#6C2EF2"], // 5
  ["#BF4B8B", "#3981BF", "#1F628C", "#D92929"], // adidas-Telstar-50-anniversary // 4
  ["#F2B705", "#F27EA9", "#05AFF2", "#F29F05", "#F2541B"], // Lettering-Series-XXII-1 // 5
  ["#A60321", "#D9043D", "#F29F05", "#D8BA7A"], // 4
  ["#F24452", "#5CE3F2", "#F2E205", "#F2CB05", "#F29D35"], // People-of-The-Internet // 5
  ["#2d3157", "#34c1bb", "#badccc", "#ffda4d"], // 4
  ["#CCCCCC", "#F2F2F2", "#B3B3B3", "#E6E6E6"], // 5
  ["#F2F2F2", "#A6A6A6", "#0D0D0D", "#202020"], // Unchained// 5
];

async function preload() {
  bg = loadImage("assets/paper.jpg");
}

async function setup() {
  await initAudio("7_Rotation");
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls("rotationscape", restart);
  initializeToolbarButtons();
  // Create canvas and attach to container
  const mainCanvas = createCanvas(windowWidth, windowHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );

  pixelDensity(1); // Ignores retina displays
  drawLayer = createGraphics(windowWidth, windowHeight);
  drawLayer.colorMode(RGB, 255, 255, 255, 1000);
  drawLayer.strokeCap(PROJECT);
}

function start() {
  counter = -1;
  playSoundtrack();
  restart();
}

function restart() {
  resetButtons();
  counter++;
  selectedPalette++;
  if (selectedPalette > palettes.length - 1) {
    selectedPalette = 0;
  }
  setSwatchColors();

  fill(0);
  ({ width, height, vMax } = calcViewportDimensions());
  rotationDimensionCalc();
  intX = width / 5;
  intY = height / 2;

  if (counter >= rotArray.length) {
    counter = 0;
  }

  drawState = 1;
  drawLayer.clear();

  changeBrush(1);

  render();
}

function rotationDimensionCalc() {
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
  } else {
    longEdge = height;
    shortEdge = width;
    circleRad = shortEdge * 0.45;
  }
  centerX = width / 2;
  centerY = height / 2;
}

function handlePointerStart(e) {
  if (e && isClickOnButton(e)) {
    return false;
  }

  faderStart = 600;

  if (centeringActive) {
    center();
    justSetCenter = true; // Prevent immediate drawing
    return false;
  }

  return false;
}
function touchstart(e) {
  return handlePointerStart(e);
}
function mousePressed(e) {
  return handlePointerStart(e);
}

function handlePointerEnd(e) {
  if (justSetCenter) {
    justSetCenter = false;
    return false;
  }
}
function mouseReleased(e) {
  return handlePointerEnd(e);
}
function touchend(e) {
  return handlePointerEnd(e);
}

function handleDrag(e) {
  if (e && isClickOnButton(e)) {
    return false;
  }

  if (centeringActive || justSetCenter) {
    // Don't draw if we're picking a new center or have just set the center
    return false;
  }

  makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
  render();

  return false;
}
function touchMoved(e) {
  return handleDrag(e);
}
function mouseDragged(e) {
  return handleDrag(e);
}

function makeDrawing(_x, _y, pX, pY) {
  qtyRot = rotArray[counter];

  if (brushSelected < 6) {
    for (let i = 0; i < qtyRot; i++) {
      drawLayer.push();
      drawLayer.translate(centerX, centerY);
      drawLayer.rotate(((2 * PI) / qtyRot) * i);
      drawLayer.translate(-centerX, -centerY);
      brushIt(_x, _y, pX, pY);
      drawLayer.pop();
    }
  } else {
    brushIt(_x, _y, pX, pY);
  }
}

function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 0) {
    drawLayer.strokeWeight(constrain(abs(_y + _x - (pX + pY)), 3, 4)); // for line work
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 1) {
    if (faderStart <= 0) {
      brushBool = 0;
    }
    if (faderStart >= 1000) {
      brushBool = 1;
    }
    if (brushBool === 0) {
      faderStart += 20;
    }
    if (brushBool === 1) {
      faderStart -= 20;
    }
    drawLayer.stroke(
      colorAlpha(palettes[selectedPalette][1], 0.25 + faderStart / 2000)
    );

    drawLayer.line(_x, _y, pX, pY);
  }

  if (brushSelected === 2) {
    for (i = 0; i < 10; i++) {
      let randX = randomGaussian(-5, 5);
      let randY = randomGaussian(-5, 5);
      drawLayer.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }
  } else if (brushSelected === 3) {
    for (i = 0; i < 4; i++) {
      drawLayer.point(_x + randomGaussian(-4, 4), _y + randomGaussian(-4, 4));
    }
  } else if (brushSelected === 4) {
    drawLayer.strokeWeight(constrain(abs(_y + _x - (pX + pY)), 30, 40)); // for line work
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 6) {
    // eraser
    drawLayer.blendMode(REMOVE);
    drawLayer.noStroke();
    drawLayer.fill(255, 127);
    drawLayer.circle(_x, _y, 50);
    drawLayer.blendMode(BLEND);
  }
}

function reCenter(e) {
  if (e) {
    e.stopPropagation();
  }
  centeringActive = true;
  resetButtons();
  return false;
}

function center() {
  centeringActive = false;
  centerX = mouseX;
  centerY = mouseY;
  ellipseAnimated = 255;
  resetButtons();
}

function draw() {
  if (ellipseAnimated > 0) {
    render();
    ellipseAnimated -= 5;
    fill(255, ellipseAnimated);
    ellipse(
      centerX,
      centerY,
      (255 - ellipseAnimated) / 4,
      (255 - ellipseAnimated) / 4
    );
  }
}

function render() {
  image(bg, 0, 0, width, height);
  image(drawLayer, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const { dimensions } = handleResize();
  ({ width, height, vMax } = dimensions);
  rotationDimensionCalc();
  drawLayer.strokeCap(SQUARE);
  render();
}

// Set the button colours
function setSwatchColors() {
  swatchButtons = document.querySelectorAll('[data-element="swatch"]');
  swatchButtons.forEach((swatch, index) => {
    swatch.style.backgroundColor = palettes[selectedPalette][index];
  });
}

function eraser(e) {
  if (e) {
    e.stopPropagation();
  }
  resetButtons();
  brushSelected = 6;
}

function changeBrush(brushSel, e) {
  if (e) {
    e.stopPropagation();
  }
  brushSelected = brushSel - 1;
  strokeAssign();
}

function strokeAssign() {
  if (brushSelected === 0) {
    drawLayer.stroke(palettes[selectedPalette][0]);
  } else if (brushSelected === 1) {
    drawLayer.strokeWeight(12); // for line work
  }

  if (brushSelected === 2) {
    drawLayer.strokeWeight(2); // for line work
    drawLayer.stroke(colorAlpha(palettes[selectedPalette][2], 0.6));
  } else if (brushSelected === 3) {
    drawLayer.strokeWeight(8);
    drawLayer.stroke(colorAlpha(palettes[selectedPalette][3], 0.55));
  } else if (brushSelected === 4) {
    drawLayer.stroke(colorAlpha(palettes[selectedPalette][4], 0.5));
  } else if (brushSelected === 5) {
    // nothing
  }
}

window.addEventListener("resize", windowResized);
