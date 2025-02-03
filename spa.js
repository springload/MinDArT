export function initializeRouter() {
  const homeView = document.querySelector('[data-element="home-view"]');
  const appView = document.querySelector('[data-element="app-view"]');
  const loadingDialog = document.querySelector("loading-dialog");
  const drawingToolbar = document.querySelector("drawing-toolbar");
  const appControls = document.querySelector("app-controls");

  function updateView() {
    const params = new URLSearchParams(window.location.search);
    const appName = params.get("app");
    const themeClass = Array.from(document.body.classList).find((className) =>
      className.startsWith("theme--")
    );
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

    if (!appName) {
      homeView.classList.remove("u-hide");
      appView.classList.add("u-hide");
      document.body.removeAttribute("data-app-name");
      if (themeClass) document.body.classList.remove(themeClass);

      loadingDialog.removeAttribute("app-name");
      drawingToolbar.removeAttribute("app-name");
      appControls.removeAttribute("app-name");
    } else {
      homeView.classList.add("u-hide");
      appView.classList.remove("u-hide");
      document.body.setAttribute("data-app-name", appName);
      if (!themeColor) {
        console.warn(`Theme color for ${appName} not found`);
      }
      document.body.classList.add(`u-theme--${themeColor}`);

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
