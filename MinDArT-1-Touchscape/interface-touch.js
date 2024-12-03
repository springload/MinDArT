let resetButton, saveButton, fsButton;
let buttons = [];
let currentRake = 0;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function writeTextUI() {
  document.querySelectorAll(".interface").forEach((el) => el.remove());

  const interfaceElement = document.getElementById("interface" + i);
  if (interfaceElement) {
    interfaceElement.addEventListener(
      "touchstart",
      (event) => {
        rake(i);
        event.preventDefault();
      },
      { passive: false }
    );

    interfaceElement.addEventListener(
      "click",
      (event) => {
        rake(i);
        event.preventDefault();
      },
      { passive: false }
    );
  }

  show_btns();

  const header = document.getElementById("myDIV");
  if (header) {
    const btns = header.getElementsByClassName("btn");
    Array.from(btns).forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from current active button
        const current = document.querySelector(".active");
        if (current) {
          current.classList.remove("active");
        }
        // Add active class to clicked button
        this.classList.add("active");
      });
    });
  }

  createAppControls("touchscape", resetTimeout);
}

function rake(version) {
  currentRake = version;

  switch (version) {
    case 0:
      change(1, 200, 1);
      eraseActive = 1;
      break;
    case 1:
      change(5, 60, 100);
      eraseActive = 0;
      break;
    case 2:
      change(15, 100, 100);
      eraseActive = 0;
      break;
    case 3:
      change(60, 150, 100);
      eraseActive = 0;
      break;
  }
  click.play();
}

function saveImg() {
  click.play();
  save(`touchscape${month()}${day()}${hour()}${second()}.jpg`);
}

function show_btns() {
  const buttons = document.getElementsByClassName("btn");
  Array.from(buttons).forEach((btn) => {
    btn.style.display = "grid";
  });
}
