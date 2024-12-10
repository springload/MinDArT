// Track the current screen orientation state
let storedOrientation = null;
let storedOrientationDegrees = 0;
let rotateDirection = -1; // Used during orientation changes

/**
 * Calculates key viewport dimensions
 * @returns {Object} Object containing width, height, vMin, and vMax values
 */
function calcViewportDimensions() {
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
function cleanupGraphics(buffer) {
  // Instead of trying to remove the buffer, we'll just return null
  // The garbage collector will handle the cleanup
  return null;
}

/**
 * Creates a new graphics layer with resized dimensions and optionally rotates content
 * @param {p5.Graphics|p5.Image} layer - The graphics layer to resize
 * @param {number} width - New width
 * @param {number} height - New height
 * @param {boolean} rotate - Whether to rotate the content (for orientation changes)
 * @param {number} direction - Direction of rotation (1 or -1)
 * @returns {p5.Graphics} New resized graphics layer
 */
function resizeGraphicsLayer(
  layer,
  width,
  height,
  rotate = false,
  direction = 1
) {
  // Create a new graphics buffer with the new dimensions
  const newLayer = createGraphics(width, height);

  // Handle different types of layers (p5.Image vs p5.Graphics)
  if (layer instanceof p5.Image) {
    if (rotate) {
      // Apply rotation transformation for orientation changes
      newLayer.push();
      newLayer.translate(width / 2, height / 2);
      newLayer.rotate((PI / 2) * direction);
      newLayer.translate(-height / 2, -width / 2);
      newLayer.image(layer, 0, 0, height, width);
      newLayer.pop();
    } else {
      // Simple resize without rotation
      newLayer.image(layer, 0, 0, width, height);
    }
  } else if (layer instanceof p5.Graphics) {
    // Same handling for p5.Graphics objects
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

  // Clean up the old layer to prevent memory leaks
  layer = cleanupGraphics(layer);

  return newLayer;
}

/**
 * Main resize handler - manages orientation changes and layer resizing
 * @param {Array} layers - Array of graphics layers to resize
 * @returns {Object} Object containing new dimensions, resized layers, and orientation info
 */
function handleResize(layers = []) {
  // Get new viewport dimensions
  const dimensions = calcViewportDimensions();
  const { width, height } = dimensions;

  // Check if orientation has changed
  const currentOrientation = width < height ? "portrait" : "landscape";
  const orientationChanged = currentOrientation !== storedOrientation;

  let direction = 1;
  if (orientationChanged) {
    // Determine rotation direction based on orientation change
    if (window.orientation < storedOrientationDegrees) {
      direction = 1;
    } else {
      direction = -1;
    }

    // Handle edge case for 270-degree rotation
    if (Math.abs(window.orientation - storedOrientationDegrees) === 270) {
      direction = -direction;
    }

    // Update stored orientation values
    storedOrientationDegrees = window.orientation;
    rotateDirection *= -1;
  }

  // Resize all provided graphics layers
  const resizedLayers = layers.map((layer) =>
    resizeGraphicsLayer(layer, width, height, orientationChanged, direction)
  );

  // Store current orientation for next comparison
  storedOrientation = currentOrientation;

  return {
    dimensions,
    resizedLayers,
    orientationChanged,
    direction,
  };
}
