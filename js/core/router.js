import "../components/loading-dialog.js";
import "../components/app-controls.js";
import "../components/drawing-toolbar.js";
import { stopSoundtrack } from "../utils/audio.js";
import { addInteractionHandlers } from "../utils/events.js";

async function init() {
  const homeView = document.querySelector('[data-element="home-view"]');
  const appView = document.querySelector('[data-element="app-view"]');

  async function updateView() {
    const params = new URLSearchParams(window.location.search);
    const appName = params.get("app");

    const themeClass = Array.from(document.body.classList).find((className) =>
      className.startsWith("u-theme--")
    );

    if (!appName) {
      stopSoundtrack();
      homeView.classList.remove("u-hide");
      appView.classList.add("u-hide");
      document.body.removeAttribute("data-app-name");
      if (themeClass) document.body.classList.remove(themeClass);
      document.body.classList.add("home");
      return;
    }

    homeView.classList.add("u-hide");
    appView.classList.remove("u-hide");
    document.body.classList.remove("home");
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

    // Initialize p5 whenever we navigate to an app view
    if (typeof window.initializeP5 === "function") {
      window.initializeP5();
    }
  }

  const appLinks = document.querySelectorAll("[data-app]");
  appLinks.forEach((link) => {
    addInteractionHandlers(link, (e) => {
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
