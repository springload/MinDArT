import "../css/styles.css";
import p5 from "p5";
window.p5 = p5;

import { registerSW } from "virtual:pwa-register";
import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";

registerSW({
  immediate: true,
  onRegisteredSW(swScriptUrl) {
    console.log("SW registered:", swScriptUrl);
  },
});

initializeRouter();
showOnlyCurrentLinks();

import "./core/app.js";
