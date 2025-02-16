// Convert hex color to RGB color object
export function hexToRgb(p5, hex) {
  hex = hex.replace("#", "");

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return p5.color(r, g, b);
}

// Apply alpha channel to a color
export function colorAlpha(p5, aColor, alpha) {
  const c = p5.color(aColor);
  return p5.color(p5.red(c), p5.green(c), p5.blue(c), alpha * 255);
}
