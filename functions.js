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
function resetButtons() {
  const activeButtons = document.querySelectorAll(".btn.active");
  activeButtons.forEach((button) => button.classList.remove("active"));
}

function setActiveElementById(id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("active");
  }
}

function hasActiveClass(el) {
  return Boolean(el && el.classList.contains("active"));
}

function setupLoadingScreen(onStart) {
  const dialog = document.querySelector('[data-element="loading-dialog"]');
  const startButton = dialog.querySelector('[data-element="start-button"]');

  if (!dialog || !startButton) {
    throw new Error("Loading manager: Required elements not found");
  }

  addClickSound(startButton);

  startButton.addEventListener("click", () => {
    dialog.close();
    onStart();
  });
  // now that the p5 assets are loaded, the start button can be shown
  startButton.style.display = "block";
}

function initializeAppControls(appName, resetCallback) {
  const appControls = document.querySelector('[data-element="app-controls"]');
  if (!appControls) {
    console.warn(
      'No element with [data-element="app-controls"] found. App controls not initialized.'
    );
    return;
  }
  // there's currently only one link: 'Main Menu'
  const links = appControls.querySelectorAll("a");
  links.forEach(addClickSound);

  const buttonConfigs = [
    {
      name: "reset-button",
      handler:
        resetCallback || (() => console.warn("No reset callback provided")),
    },
    {
      name: "save-button",
      handler: () => {
        save(`${appName}${month()}${day()}${hour()}${second()}.jpg`);
      },
    },
  ];

  const [resetButton, saveButton] = buttonConfigs.reduce(
    (acc, { name, handler }) => {
      // warning if the button isn't found
      const element = appControls.querySelector(`[data-element="${name}"]`);
      if (!element) {
        console.warn(
          `${name} not found - missing element with data-element="${name}"`
        );
        return acc;
      }
      // otherwise, add the click sound and click handler
      addClickSound(element);
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
    const btns = Array.from(toolbar.querySelectorAll(".btn"));

    btns.forEach((btn) => {
      addClickSound(btn);

      if (
        ["dotscape", "linkscape"].some(
          (appName) => document.body.dataset.appName === appName
        )
      ) {
        // for these applications we just want the clicks, not any of the other stuff
        return;
      }

      btn.addEventListener("click", (e) => {
        // Prevent the event from reaching the canvas
        e.stopPropagation();

        const clicked = e.currentTarget;

        // exception for a button in symmetryscape which should not receive the active styling
        if (clicked.dataset.element === "draw-mode-button") {
          return;
        }

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
