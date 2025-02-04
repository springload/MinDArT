let componentsRegistered = false;

async function registerComponents() {
  if (componentsRegistered) return;

  // Import and register components
  await Promise.all([
    import("./components/loading-dialog.js"),
    import("./components/app-controls.js"),
    import("./components/drawing-toolbar.js"),
  ]);

  componentsRegistered = true;
}

async function init() {
  await registerComponents();

  const homeView = document.querySelector('[data-element="home-view"]');
  const appView = document.querySelector('[data-element="app-view"]');

  async function updateView() {
    const params = new URLSearchParams(window.location.search);
    const appName = params.get("app");

    const themeClass = Array.from(document.body.classList).find((className) =>
      className.startsWith("u-theme--")
    );

    if (!appName) {
      homeView.classList.remove("u-hide");
      appView.classList.add("u-hide");
      document.body.removeAttribute("data-app-name");
      if (themeClass) document.body.classList.remove(themeClass);
      return;
    }

    homeView.classList.add("u-hide");
    appView.classList.remove("u-hide");
    document.body.setAttribute("data-app-name", appName);

    const themeLookup = {
      touchscape: "blue",
      linescape: "green",
      circlescape: "yellow",
      colourscape: "red",
      dotscape: "grey",
      linkscape: "slate",
      rotationscape: "orange",
      symmetryscape: "teal",
    };

    const themeColor = themeLookup[appName];
    if (themeColor) {
      if (themeClass) document.body.classList.remove(themeClass);
      document.body.classList.add(`u-theme--${themeColor}`);
    }

    const loadingDialog = document.querySelector("loading-dialog");
    const drawingToolbar = document.querySelector("drawing-toolbar");
    const appControls = document.querySelector("app-controls");

    if (loadingDialog && drawingToolbar && appControls) {
      loadingDialog.setAttribute("app-name", appName);
      drawingToolbar.setAttribute("app-name", appName);
      appControls.setAttribute("app-name", appName);
    }
  }

  const appLinks = document.querySelectorAll("[data-app]");
  appLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const appName = link.dataset.app;
      window.history.pushState({}, "", `?app=${appName}`);
      updateView();
    });
  });

  // Handle browser back/forward
  window.addEventListener("popstate", updateView);

  updateView();
}

export const initializeRouter = () => init().catch(console.error);
