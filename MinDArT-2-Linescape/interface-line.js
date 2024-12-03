let resetButton, saveButton, homeButton, fsButton, toggleBut;
let toggle = 0;

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

function writeTextUI() {
  createSwatch();
}

function createSwatch() {
  $(".box").remove();
  $(".toggle").remove();

  swatch = [];
  for (let i = 0; i < 2; i++) {
    swatch[i] = createButton("");
    swatch[i].size(7 * vMax, 10.5 * vMax);
    swatch[i].style("background-color", colours[cc][i]);
    swatch[i].style("border-width", "6px");
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
  }
}

function left_colour() {
  bool = 0;
  resetButtons();
  toggle = false;
  click.play();
}

function right_colour() {
  bool = 0;
  resetButtons();
  toggle = true;
  click.play();
}

function paintOff() {
  for (let i = 0; i < 2; i++) {
    swatch[i].position((i * 9 + 12) * vMax, height - 11 * vMax);
    swatch[i].size(9 * vMax, 8 * vMax);
  }
}
