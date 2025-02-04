// Track the current screen orientation state
let storedOrientation = null;
let storedOrientationDegrees = 0;
let rotateDirection = -1; // Used during orientation changes

/**
 * Calculates key viewport dimensions
 * @returns {Object} Object containing width, height, vMin, and vMax values
 */
export function calcViewportDimensions() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  const vMax = isLandscape ? width / 100 : height / 100;
  const vMin = isLandscape ? height / 100 : width / 100;

  return { width, height, vMin, vMax };
}

/**
 * Helps with memory management by cleaning up graphics buffers
 * @param {p5.Graphics} buffer - The graphics buffer to clean up
 * @returns {null} Returns null to allow garbage collection
 */
export function cleanupGraphics(buffer) {
  return null;
}

/**
 * Creates a new graphics layer with resized dimensions and optionally rotates content
 * @param {p5} p5 - The p5 instance
 * @param {p5.Graphics|p5.Image} layer - The graphics layer to resize
 * @param {number} width - New width
 * @param {number} height - New height
 * @param {boolean} rotate - Whether to rotate the content
 * @param {number} direction - Direction of rotation (1 or -1)
 * @returns {p5.Graphics} New resized graphics layer
 */
export function resizeGraphicsLayer(
  p5,
  layer,
  width,
  height,
  rotate = false,
  direction = 1
) {
  const newLayer = p5.createGraphics(width, height);

  // A p5.Image has loadPixels but no strokeWeight
  // A p5.Graphics has both loadPixels and strokeWeight
  const isImage = layer.loadPixels && !layer.strokeWeight;
  if (isImage) {
    if (rotate) {
      // Apply rotation transformation for orientation changes
      newLayer.push();
      newLayer.translate(width / 2, height / 2);
      newLayer.rotate((p5.PI / 2) * direction);
      newLayer.translate(-height / 2, -width / 2);
      newLayer.image(layer, 0, 0, height, width);
      newLayer.pop();
    } else {
      // Simple resize without rotation
      newLayer.image(layer, 0, 0, width, height);
    }
  } else {
    if (rotate) {
      newLayer.push();
      newLayer.translate(width / 2, height / 2);
      newLayer.rotate((p5.PI / 2) * direction);
      newLayer.translate(-height / 2, -width / 2);
      newLayer.image(layer, 0, 0, height, width);
      newLayer.pop();
    } else {
      newLayer.image(layer, 0, 0, width, height);
    }
  }

  layer = cleanupGraphics(layer);
  return newLayer;
}

/**
 * Main resize handler - manages orientation changes and layer resizing
 * @param {p5} p5 - The p5 instance
 * @param {Array} layers - Array of graphics layers to resize
 * @returns {Object} Object containing new dimensions, resized layers, and orientation info
 */
export function handleResize(p5, layers = []) {
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

  const resizedLayers = layers.map((layer) =>
    resizeGraphicsLayer(p5, layer, width, height, orientationChanged, direction)
  );

  storedOrientation = currentOrientation;

  return {
    dimensions,
    resizedLayers,
    orientationChanged,
    direction,
  };
}
