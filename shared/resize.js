let storedOrientation = null;
let storedOrientationDegrees = 0;
let rotateDirection = -1;

function calcViewportDimensions() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const vMax = width > height ? width / 100 : height / 100;
  const vMin = width > height ? height / 100 : width / 100;

  return { width, height, vMin, vMax };
}

function cleanupGraphics(buffer) {
  // Instead of trying to remove the buffer, we'll just return null
  // The garbage collector will handle the cleanup
  return null;
}

function resizeGraphicsLayer(
  layer,
  width,
  height,
  rotate = false,
  direction = 1
) {
  // Create a new graphics buffer with the new dimensions
  const newLayer = createGraphics(width, height);

  // If the layer is not a P5.Image (like the background image), handle it differently
  if (layer instanceof p5.Image) {
    if (rotate) {
      newLayer.push();
      newLayer.translate(width / 2, height / 2);
      newLayer.rotate((PI / 2) * direction);
      newLayer.translate(-height / 2, -width / 2);
      newLayer.image(layer, 0, 0, height, width);
      newLayer.pop();
    } else {
      newLayer.image(layer, 0, 0, width, height);
    }
  } else if (layer instanceof p5.Graphics) {
    if (rotate) {
      newLayer.push();
      newLayer.translate(width / 2, height / 2);
      newLayer.rotate((PI / 2) * direction);
      newLayer.translate(-height / 2, -width / 2);
      newLayer.image(layer, 0, 0, height, width);
      newLayer.pop();
    } else {
      newLayer.image(layer, 0, 0, width, height);
    }
  }

  // Clean up the old layer
  layer = cleanupGraphics(layer);

  return newLayer;
}

function handleResize(layers = []) {
  const dimensions = calcViewportDimensions();
  const { width, height } = dimensions;

  const currentOrientation = width < height ? "portrait" : "landscape";
  const orientationChanged = currentOrientation !== storedOrientation;

  let direction = 1;
  if (orientationChanged) {
    if (window.orientation < storedOrientationDegrees) {
      direction = 1;
    } else {
      direction = -1;
    }

    if (Math.abs(window.orientation - storedOrientationDegrees) === 270) {
      direction = -direction;
    }

    storedOrientationDegrees = window.orientation;
    rotateDirection *= -1;
  }

  // Resize all graphics layers
  const resizedLayers = layers.map((layer) =>
    resizeGraphicsLayer(layer, width, height, orientationChanged, direction)
  );

  storedOrientation = currentOrientation;

  return {
    dimensions,
    resizedLayers,
    orientationChanged,
    direction,
  };
}
