/**
 * Converts a hex color string to a p5.Color object.
 *
 * @param {p5} p5 - The p5 instance to use for color creation
 * @param {string} hex - The hex color string (with or without leading #)
 * @returns {p5.Color} A p5.Color object representing the hex color
 *
 * @example
 * const color = hexToRgb(p5, "#F2A97E");
 * // Returns p5.Color with RGB values (242, 169, 126)
 */
export function hexToRgb(p5, hex) {
  hex = hex.replace("#", "");

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return p5.color(r, g, b);
}

/**
 * Creates a new color with modified alpha channel from an existing color.
 *
 * @param {p5} p5 - The p5 instance to use for color creation
 * @param {p5.Color|string} aColor - The source color to modify (can be p5.Color object or color string)
 * @param {number} alpha - The alpha value between 0 and 1 (0 = fully transparent, 1 = fully opaque)
 * @returns {p5.Color} A new p5.Color object with the specified alpha value
 *
 * @example
 * const originalColor = p5.color(255, 0, 0);
 * const transparentRed = colorAlpha(p5, originalColor, 0.5);
 * // Returns p5.Color with RGBA values (255, 0, 0, 127)
 */
export function colorAlpha(p5, aColor, alpha) {
  const c = p5.color(aColor);
  return p5.color(p5.red(c), p5.green(c), p5.blue(c), alpha * 255);
}
