import "../css/styles.css";
import p5 from "p5";
window.p5 = p5;

import { initializeRouter } from "./core/router.js";
import { showOnlyCurrentLinks } from "./utils/dom.js";

initializeRouter();
showOnlyCurrentLinks();

import "./core/app.js";
