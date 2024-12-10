let currentSwatch = 0;
let swatch = [];

var colours = [
  ["#F2B705", "#701036"],
  ["#0D0D0D", "#0D0D0D"],
  ["#F2B077", "#023E73"],
  ["#D94929", "#590902"],
  ["#F2B705", "#02735E"],
  ["#F2B705", "#011F26"],
  ["#F2B705", "#A6600A"],
  ["#F2B705", "#1450A4"],
  ["#F2B705", "#363432"],
];

let cc = 0;

function initializeSwatches() {
  updateSwatchColors();
  initializeToolbarButtons();
}

function switchSwatch(el) {
  currentSwatch = parseInt(el.dataset.swatch);
}

function updateSwatchColors() {
  const swatches = document.querySelectorAll('[data-element="swatch"]');
  swatches.forEach((swatch) => {
    const index = parseInt(swatch.dataset.swatch);
    swatch.style.backgroundColor = colours[cc][index];
  });
}
