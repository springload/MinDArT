let brush = [];
let longEdge, shortEdge, circleRad, vMax, wmax, hmax;
let drawLayer, symmetryAxisLayer;
let brushSelected = 0; // eraser
let lastDrawingBrush = 0;
let faderStart;
let xCo = [];
let yCo = [];
let velo = [];
let brushBool = 0;
let intX, intY;
let selectedPalette = 0;
let counter = -1;
let palettes = [
  ["#000000", "#444444", "#888888", "#a1a1a1", "#c2c2c2", "#ffffff"],
  ["#F2F2F2", "#F2913D", "#223240", "#F24B0F"],
  ["#6D808C", "#FFFFFF", "#D9AA8F", "#F2CAB3"],
  ["#3C5E73", "#F2BBBB", "#FFFFFF", "#F24444"],
];

function preload() {
  bg = loadImage("assets/paper.jpg");
}

async function setup() {
  await initAudio("8_Symmetry");
  // add JS functionality to existing HTML elements
  setupLoadingScreen(start);
  initializeAppControls(restart);
  initializeToolbarButtons();
  // Create canvas and attach to container
  const mainCanvas = createCanvas(windowWidth, windowHeight);
  mainCanvas.parent(
    document.querySelector('[data-element="canvas-container"]')
  );
  pixelDensity(1); // Ignores retina displays
  drawLayer = createGraphics(width, height);
  drawLayer.colorMode(RGB, 255, 255, 255, 1000);
  drawLayer.strokeCap(PROJECT);
  symmetryAxisLayer = createGraphics(width, height);
  setSwatchColors();
}

function start() {
  counter = 0;
  selectedPalette = 0;
  playSoundtrack();
  initializeState();
}

function initializeState() {
  clearActiveButtonState();
  setSwatchColors();

  fill(0);
  dimensionCalc();
  intX = width / 5;
  intY = height / 2;

  drawState = 1;
  drawLayer.clear();
  symmetryAxisLayer.clear();

  // Set initial symmetry lines
  if (counter === 1 || counter === 2) {
    symmetryAxisLayer.strokeWeight(1);
    symmetryAxisLayer.stroke(210);
    symmetryAxisLayer.line(0, height / 2, width, height / 2);
  }

  if (counter === 0 || counter === 2) {
    symmetryAxisLayer.strokeWeight(1);
    symmetryAxisLayer.stroke(210);
    symmetryAxisLayer.line(width / 2, 0, width / 2, height);
  }

  if (counter === 3) {
    symmetryAxisLayer.strokeWeight(1);
    symmetryAxisLayer.stroke(210);
    symmetryAxisLayer.line(0, 0, width, height);
    symmetryAxisLayer.line(width, 0, 0, height);
  }

  changeBrush(1);
  render();
}

function restart() {
  clearActiveButtonState();
  counter++;
  selectedPalette++;
  if (selectedPalette >= palettes.length) {
    selectedPalette = 0;
  }
  if (counter >= 4) {
    counter = 0;
  }

  initializeState();
}

function dimensionCalc() {
  ({ width, height, vMax } = calcViewportDimensions());
  wmax = width / 100;
  hmax = height / 100;
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
  } else {
    longEdge = height;
    shortEdge = width;
    circleRad = shortEdge * 0.45;
  }
}

function handlePointerStart(e) {
  if (e && isClickOnButton(e)) {
    return false;
  }
  faderStart = 600;
  return false;
}

function touchstart(e) {
  return handlePointerStart(e);
}

function mousePressed(e) {
  return handlePointerStart(e);
}

function handleDrag(e) {
  if (e && isClickOnButton(e)) {
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

function makeDrawing(currentX, currentY, previousX, previousY) {
  if (counter === 0) {
    brushIt(currentX, currentY, previousX, previousY);
    brushIt(width - currentX, currentY, width - previousX, previousY);
  } else if (counter === 1) {
    brushIt(currentX, currentY, previousX, previousY);
    brushIt(currentX, height - currentY, previousX, height - previousY);
  } else if (counter === 2) {
    brushIt(currentX, currentY, previousX, previousY);
    brushIt(width - currentX, currentY, width - previousX, previousY);
    brushIt(currentX, height - currentY, previousX, height - previousY);
    brushIt(
      width - currentX,
      height - currentY,
      width - previousX,
      height - previousY
    );
  } else if (counter === 3) {
    drawLayer.push();
    brushIt(currentX, currentY, previousX, previousY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 0.5);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(currentX, currentY, previousX, previousY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 1);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(currentX, currentY, previousX, previousY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 1.5);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(currentX, currentY, previousX, previousY);
    drawLayer.pop();
  }
}

function render() {
  image(bg, 0, 0, width, height);
  image(drawLayer, 0, 0, width, height);
  image(symmetryAxisLayer, 0, 0, width, height);
}

function eraser(e) {
  if (e) {
    e.stopPropagation();
  }
  clearActiveButtonState();
  lastDrawingBrush = brushSelected;
  brushSelected = 0;
}

function switchToDrawMode(e) {
  if (e) {
    e.stopPropagation();
  }
  clearActiveButtonState();

  const toolbar = document.querySelector('[data-element="toolbar"]');
  const drawButton = toolbar.querySelector('[data-element="draw-mode-button"]');

  if (brushSelected === 0) {
    brushSelected = lastDrawingBrush || 1; // Default to brush 1 if no last brush

    // Set active state on the restored brush button
    const brushButton = toolbar?.querySelector(
      `[data-brush="${brushSelected}"]`
    );

    if (brushButton) {
      brushButton.classList.add("active");
    }
    if (hasActiveClass(drawButton)) {
      drawButton?.classList.remove("active");
    }
  }
}

function changeBrush(brushSel, e) {
  if (e) {
    e.stopPropagation();
  }
  brushSelected = brushSel;
  if (brushSelected !== 0) {
    lastDrawingBrush = brushSelected;
  }
  clearActiveButtonState();

  const toolbar = document.querySelector('[data-element="toolbar"]');
  const selectedButton = toolbar?.querySelector(`[data-brush="${brushSel}"]`);
  if (selectedButton) {
    selectedButton.classList.add("active");
  }
}

function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 0) {
    // eraser
    drawLayer.blendMode(REMOVE);
    drawLayer.noStroke();
    drawLayer.fill(255, 127);
    drawLayer.circle(_x, _y, 50);
    drawLayer.blendMode(BLEND);
    return;
  }

  // Get the color for the current brush (subtract 1 since brush 0 is eraser)
  const colorIndex = Math.min(
    brushSelected - 1,
    palettes[selectedPalette].length - 1
  );
  const currentColor = palettes[selectedPalette][colorIndex];

  if (brushSelected === 1) {
    drawLayer.strokeWeight(constrain(abs(_y + _x - (pX + pY)), 3, 5));
    drawLayer.stroke(colorAlpha(currentColor, 0.8));
    drawLayer.line(pX, pY, _x, _y);
  } else if (brushSelected === 2) {
    drawLayer.strokeWeight(constrain(abs(_y + _x - (pX + pY)), 14, 15));
    drawLayer.stroke(colorAlpha(currentColor, 0.6));
    drawLayer.line(pX, pY, _x, _y);
  } else if (brushSelected === 3) {
    drawLayer.strokeWeight(constrain(abs(_y + _x - (pX + pY)), 8, 10));
    drawLayer.stroke(colorAlpha(currentColor, 0.5));
    for (let i = 0; i < 10; i++) {
      let randX = randomGaussian(-6, 6);
      let randY = randomGaussian(-6, 6);
      drawLayer.line(pX + randX, pY + randY, _x + randX, _y + randY);
    }
  } else if (brushSelected === 4) {
    drawLayer.strokeWeight(4);
    drawLayer.stroke(colorAlpha(currentColor, 0.4));
    for (let i = 0; i < 60; i++) {
      drawLayer.point(
        _x + randomGaussian(-10, 10),
        _y + randomGaussian(-10, 10)
      );
    }
  } else {
    // Default brush style for any additional colors
    drawLayer.strokeWeight(constrain(abs(_y + _x - (pX + pY)), 6, 8));
    drawLayer.stroke(colorAlpha(currentColor, 0.6));
    drawLayer.line(pX, pY, _x, _y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const { resizedLayers } = handleResize([bg, drawLayer, symmetryAxisLayer]);
  [bg, drawLayer, symmetryAxisLayer] = resizedLayers;

  drawLayer.strokeCap(PROJECT);
  dimensionCalc();
  render();
}

function setSwatchColors() {
  const allBrushes = Array.from(document.querySelectorAll("[data-brush]"));
  const swatchButtons = allBrushes.slice(1); // remove the eraser from the selection
  const currentPaletteLength = palettes[selectedPalette].length;

  swatchButtons.forEach((swatch, index) => {
    if (index < currentPaletteLength) {
      swatch.style.backgroundColor = palettes[selectedPalette][index];
      swatch.classList.remove("u-hide"); // Show button if it's within palette length
    } else {
      swatch.classList.add("u-hide"); // Hide button if it's beyond palette length
    }
  });
}

window.addEventListener("resize", windowResized);
