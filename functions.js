function showOnlyCurrentLinks() {
  // set programme start date (mm/dd/yyyy)
  const startDate = new Date("02/19/2024");
  const dayInMilliseconds = 86400000;

  // Calculate the number of elapsed days since programme start
  const today = new Date();
  const elapsedDays = Math.floor((today - startDate) / dayInMilliseconds);
  const currentWeekNumber = Math.ceil(elapsedDays / 7);

  const homeGrid = document.querySelector('[data-element="home-grid"]');
  if (!homeGrid) {
    console.warn(
      'Parent element with attribute data-element="home-grid" not found'
    );
  }
  const links = homeGrid.querySelectorAll("[data-week]");

  // make any still-to-be-unlocked apps unclickable (opacity will also be reduced in the CSS)
  links.forEach((link) => {
    link.dataset.week <= currentWeekNumber
      ? link.removeAttribute("inert")
      : link.setAttribute("inert", true);
  });
}

// Common interface functions
function menu() {
  window.location.href = "https://jameswilce.github.io/DevMinDArT";
  //window.location.href = "/";
}

function show_btns() {
  var getBtns = document.getElementsByClassName("btn");
  for (var i = 0; i < getBtns.length; i++) {
    getBtns[i].style.display = "inline";
  }
}

function resetButtons() {
  var activeButtons = document.querySelectorAll(".btn.active");
  for (var i = 0; i < activeButtons.length; i++) {
    activeButtons[i].classList.remove("active");
  }
}

function setActive(id1, id2) {
  resetButtons();
  document.getElementById(id1).classList.add("active");
  document.getElementById(id2).classList.add("active");
}

function setActiveElementById(id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("active");
  }
}

function stopAudioWhenHidden(audio) {
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        audio.stop();
      } else if (!audio.isPlaying()) {
        audio.loop(1);
      }
    },
    false
  );
}

function setupLoadingScreen(onStart) {
  const dialog = document.querySelector('[data-element="loading-dialog"]');
  const startButton = dialog.querySelector('[data-element="start-button"]');

  if (!dialog || !startButton) {
    throw new Error("Loading manager: Required elements not found");
  }

  startButton.addEventListener("click", () => {
    dialog.close();
    onStart();
  });

  startButton.style.display = "block";
}

function initializeAppControls(appName, resetCallback) {
  const buttonConfigs = [
    {
      name: "reset-button",
      handler:
        resetCallback || (() => console.warn("No reset callback provided")),
    },
    {
      name: "save-button",
      handler: () => {
        click.play();
        save(`${appName}${month()}${day()}${hour()}${second()}.jpg`);
      },
    },
  ];

  const [resetButton, saveButton] = buttonConfigs.reduce(
    (acc, { name, handler }) => {
      // warning if the button isn't found
      const element = document.querySelector(`[data-element="${name}"]`);
      if (!element) {
        console.warn(
          `${name} not found - missing element with data-element="${name}"`
        );
        return acc;
      }
      // otherwise, add the click handler
      element.addEventListener("click", handler);
      return [...acc, element];
    },
    []
  );

  return {
    resetButton,
    saveButton,
    container: document.querySelector('[data-element="app-controls"]'),
  };
}

function initializeToolbarButtons() {
  const toolbar = document.querySelector('[data-element="toolbar"]');
  if (toolbar) {
    const btns = Array.from(toolbar.getElementsByClassName("btn"));
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Prevent the event from reaching the canvas
        e.preventDefault();
        e.stopPropagation();

        const clicked = e.currentTarget;
        const current = document.querySelector(".active");
        if (current) {
          current.classList.remove("active");
        }
        clicked.classList.add("active");
      });
    });
  }
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return color(r, g, b);
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color("rgba(" + [red(c), green(c), blue(c), alpha].join(",") + ")");
}

function setupCanvasEventListeners() {
  const canvasContainer = document.querySelector(
    '[data-element="canvas-container"]'
  );
  const canvas = canvasContainer.querySelector("canvas");
  canvas.addEventListener("touchmove", moved, { passive: false }); // passive: false prevents scroll on touch
  canvas.addEventListener("mousemove", moved);
  canvas.addEventListener("touchstart", touchdown);
  canvas.addEventListener("mousedown", touchdown);
  canvas.addEventListener("touchend", touchstop);
  canvas.addEventListener("touchleave", touchstop);
  canvas.addEventListener("mouseup", touchstop);
  canvas.addEventListener("mouseup", touchstop);
}

function isClickOnButton(e) {
  return (
    e.target.closest(".btn") !== null || e.target.closest(".interface") !== null
  );
}
