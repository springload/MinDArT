import "../components/loadingDialog.js";
import "../components/appControls.js";
import "../components/drawingToolbar.js";
import { stopSoundtrack } from "../utils/audio.js";
import { addInteractionHandlers } from "../utils/events.js";
import { checkForUpdates } from "../utils/pwa.js";
/**
 * Extracts the app name from URL query parameters
 * @returns {string|null} The 'app' query parameter value (e.g. `'touchscape'`), or null if not present
 */
const getAppName = () => new URLSearchParams(window.location.search).get("app");

/** @returns {string|undefined} The current theme class name */
const getCurrentTheme = () =>
  Array.from(document.body.classList).find((className) =>
    className.startsWith("u-theme--")
  );

/**
 * @param {HTMLElement} el Element to show
 * @returns {void}
 */
const showEl = (el) => {
  el.classList.remove("u-hide");
};

/**
 * @param {HTMLElement} el Element to hide
 * @returns {void}
 */
const hideEl = (el) => {
  el.classList.add("u-hide");
};

/**
 * @param {string | undefined} appName e.g. `'touchscape'` — If undefined, we'll update attrs for the home view
 * @returns {void}
 */
const updatePageAttributes = (appName) => {
  if (!appName) {
    document.body.removeAttribute("data-app-name");
    clearAppClassNames();
    document.body.classList.add("home");
  } else {
    document.body.classList.remove("home");
    document.body.classList.add(appName);
    document.body.setAttribute("data-app-name", appName);
  }
};

/**
 * Removes all app-related class names from the document body
 * @returns {void}
 */
const clearAppClassNames = () => {
  const appNames = [
    "touchscape",
    "linescape",
    "circlescape",
    "colourscape",
    "dotscape",
    "linkscape",
    "rotationscape",
    "symmetryscape",
  ];
  const appClassNames = Array.from(document.body.classList).filter(
    (className) => appNames.includes(className)
  );
  if (appClassNames.length) {
    document.body.classList.remove(appClassNames);
  }
};
/**
 * @param {string|undefined} themeClass Theme class  (e.g. `'u-theme-blue'`) to remove from the `body` element
 * @returns {void}
 */
const removeTheme = (themeClass) => {
  if (themeClass) document.body.classList.remove(themeClass);
};

/**
 * @param {string} appName Name of the app, e.g. `'touchscape'`
 * @param {string|undefined} themeClass Current theme class to remove
 * @returns {void}
 */
const applyTheme = (appName, themeClass) => {
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
};

/**
 * Passes the app name to the loading screen, app-specific toolbar buttons,
 * and the global app controls, so that the correct button config, functionality
 * and theming will be used.
 * @param {string} appName Name of the app (e.g. `'touchscape'`)
 * @returns {void}
 */
const initializeComponents = (appName) => {
  const components = ["loading-dialog", "drawing-toolbar", "app-controls"];

  const foundComponents = components
    .map((component) => document.querySelector(component))
    .filter(Boolean);

  if (foundComponents.length === components.length) {
    foundComponents.forEach((component) =>
      component.setAttribute("app-name", appName)
    );
  }
};

/**
 * Retrieves the main view container elements
 * @returns {[HTMLElement, HTMLElement]} Tuple of [homeView, appView] elements
 * @throws {Error} If either container element is not found
 */
const getContainerElements = () => {
  const [homeView, appView] = ["home-view", "app-view"].map((viewName) =>
    document.querySelector(`[data-element="${viewName}"]`)
  );

  if (!homeView || !appView) {
    throw new Error("Container for app or home view not found");
  }

  return [homeView, appView];
};

/**
 * Updates the application view state, based on URL parameters
 * Handles transitions between home and app views, theme updates, and component initialization
 * @returns {Promise<void>}
 */
async function updateView() {
  const [homeView, appView] = getContainerElements();
  const appName = getAppName();
  const themeClass = getCurrentTheme();

  if (!appName) {
    // We're eturning to the home view
    stopSoundtrack();
    showEl(homeView);
    hideEl(appView);
    updatePageAttributes();
    removeTheme(themeClass);

    if (navigator.onLine) {
      // Check for updates on home screen only
      const updateAvailable = await checkForUpdates();
      if (updateAvailable) {
        console.log("Update available - page will refresh soon");
      }
    }
    return;
  }

  hideEl(homeView);
  showEl(appView);
  updatePageAttributes(appName);
  applyTheme(appName, themeClass);
  initializeComponents(appName);

  if (typeof window.initializeP5 === "function") {
    window.initializeP5();
  }
}

/**
 * Initializes the application on page load
 * @returns {Promise<void>}
 */
async function init() {
  const appLinks = document.querySelectorAll("[data-app]");

  appLinks.forEach((link) => {
    addInteractionHandlers(link, (e) => {
      e.preventDefault(); // we don't want a full page reload
      const appName = link.getAttribute("data-app"); // name of the app that the link goes to, e.g. 'touchscape'

      // Update the URL with the app name as a parameter, without refreshing the page
      window.history.pushState({}, "", `?app=${appName}`);
      // Update the view to match the new URL
      updateView();
    });
  });

  window.addEventListener("popstate", updateView);

  updateView();
}

/**
 * Initializes the router and handles any errors
 * @returns {Promise<void>}
 */
export const initializeRouter = () => init().catch(console.error);
