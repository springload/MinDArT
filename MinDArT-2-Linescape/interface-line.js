let toggle = 0;
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
  document.querySelectorAll('[data-element="swatch"]').forEach((swatch, i) => {
    swatch.addEventListener("click", () => switchSwatch(i));
  });

  setActiveElementById("swatch0");
}

function switchSwatch(number) {
  resetButtons();
  toggle = number === 1; // true if second swatch
  setActiveElementById("swatch" + number);
  click.play();
}

function updateSwatchColors() {
  document.getElementById("swatch0").style.backgroundColor = colours[cc][0];
  document.getElementById("swatch1").style.backgroundColor = colours[cc][1];
}
