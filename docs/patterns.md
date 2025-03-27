# Patterns used in the Springload | Te Pipītanga refactor of the MinDArT application


* [Single Page App routing](#single-page-app-routing)
* [P5.js Instance Mode](#p5js-instance-mode)
* [Web Components](#web-components)
* [JSDoc Documentation](#jsdoc-documentation)
* [Classes & Attributes](#classes-attributes)
    + [Classes](#classes)
    + [Data attributes](#data-attributes)
* [File formats](#file-formats)
    + [WebP images](#webp-images)
    + [SVG graphics](#svg-graphics)
    + [WOFF2 fonts](#woff2-fonts)
* [Debug Features](#debug-features)
    + [PWA Debugging](#pwa-debugging)
    + [Performance Monitoring](#performance-monitoring)



## Single Page App routing
The project now uses a [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) architecture to provide a reliable offline experience. Instead of a separate page for each drawing app, a single `index.html` file loads bundled JavaScript containing all the drawing apps. The router handles navigation by responding to URL parameters (like `?app=touchscape`) and swapping views without page reloads, maintaining application state.

Image and sound assets are now organized in a flatter directory structure that simplifies caching. When Vite builds the project, it bundles all code into minimal production files, reducing the total download size. This means the service worker can cache everything needed for offline use during the user's first visit to any page.

This architecture ensures that once the initial page load succeeds, all drawing apps work reliably offline since everything needed is already cached. It's an approach that simplifies the PWA implementation and reduces duplication.

## P5.js Instance Mode
The project uses [p5.js instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode) instead of global mode, so that each drawing app is fully encapsulated. The major advantage of this is that you can load the p5 library once, and then each drawing app gets its own separate p5 instance, preventing any conflicts between sketches.

```js
// Create new p5 instance for each app
p5Instance = new p5((p5) => {
  let drawingApp;
  
  p5.setup = async () => {
    // Setup code using provided p5 instance
    drawingApp = createDrawingApp(p5);
    await drawingApp.setup();
  }
  
  p5.draw = () => {
    return drawingApp?.draw();
  }
}, document.querySelector('[data-element="canvas-container"]'));
```


```js
function createTouchscape(p5) {
  // All p5 methods are accessed through the passed instance
  function setup() {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.pixelDensity(1);
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
  }
  
  return { setup, /* other methods */ };
}
```
This makes maintaining 8 separate drawing apps much more reliable. Instance mode is also the key that enables us to use the SPA approach and seamlessly swap out different apps within the same page. 

## Web Components
The project uses [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) to create reusable custom elements that encapsulate functionality. Each component extends `HTMLElement` and is registered with a custom tag name using `customElements.define()`:

```js
class DrawingToolbar extends HTMLElement {
  // Component logic here
}
customElements.define("drawing-toolbar", DrawingToolbar);
```
This allows you to use the component in your HTML, just like you would a standard HTML element:
```html
`<drawing-toolbar app-name="touchscape"></drawing-toolbar>`
```

Components use lifecycle callbacks like `connectedCallback` (when added to DOM) and `attributeChangedCallback` (when observed attributes change) to manage their behavior:

```js
static get observedAttributes() {
  return ["app-name"]; // Attributes to observe
}

connectedCallback() {
  this.render(); // Initial render when added to DOM
}

attributeChangedCallback(name, oldValue, newValue) {
  if (name === "app-name" && oldValue !== newValue) {
    this.render(); // Re-render when app-name changes
  }
}
```
This allows each component to manage its own rendering, event handling, and state, and components can be reused across different drawing apps while maintaining consistent behavior.


## JSDoc Documentation
Most functions have [JSDoc](https://jsdoc.app/) comments (starting with `/**`). These provide documentation and type information. This helps IDEs like VSCode provide better autocomplete and type checking, and helps developers understand the code.
JSDoc is useful for documenting what parameters a function takes, and what it returns, as well as any events fired, and detailing complex object structures. It allows you to have some of the structure and clarity of TypeScript without needing to switch from vanilla JavaScript.

For example, this JSDoc documents that `createLinescape` returns an object containing multiple methods with different parameter and return types:

```js
/**
* @param {p5} p5 - The p5 instance to use
* @returns {{
*   setup: () => Promise<void>,
*   reset: () => void,
*   handleMove: (x: number, y: number) => boolean,
*   render: () => void
* }} Object containing sketch lifecycle methods
*/
function createLinescape(p5) {
```
Now, when hovering over the function name `createLinescape` in VSCode (whether the function declaration, or an instance of it) you will see the above information nicely formatted as a tooltip.

If it's useful (I don't find it _that_ useful) JSDoc can also generate documentation as a website from these comments. 
1. Install the tool and a Typescript-syntax plugin with:
```node
npm install --save-dev jsdoc jsdoc-plugin-typescript
```
2. Save a config file telling it to look in the `./js` directory, and put the output in `./docs`:
```json
{
  "source": {
    "include": ["js"],
    "includePattern": ".js$",
    "excludePattern": "(node_modules/|docs)"
  },
  "plugins": ["jsdoc-plugin-typescript"],
  "opts": {
    "destination": "./docs/jsdoc",
    "recurse": true
  },
  "templates": {
    "cleverLinks": true,
    "monospaceLinks": true
  }
}
```
3. Run it, referencing the config:
```node
jsdoc -c jsdoc.json
```
4. Open the resulting index.html in a browser and explore.

## Classes & Attributes
We link CSS & JS to the HTML in 2 distinct ways:
 - [classes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) are added to HTML elements to enable styling via CSS
 - [data attributes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes) are added to HTML elements to enable functionality via JS

### Classes
 - class names generally follow the [BEM](https://getbem.com/naming/) naming approach (e.g. `.loading-dialog__start-button` indicates a `start-button` element _within_ the `.loading-dialog` block, whereas `.btn--warm-stripes` uses the `--warm-stripes` modifier to differentiate _this_ `.btn` from the unmodified `.btn`, and other variants like `.btn--cool-stripes` ) However, this is a small project with minimal CSS, so strict adherence to BEM is not absolutely necessary.
 - not all selections in CSS directly use a class, but specificity for CSS rules should ideally be kept flat, at `0,1,0` (equivalent to a single class) to avoid unexpected overrides or a 'specificity arms race'. This can be accomplished by using [`:where()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) to cancel out the specificity of its contents. For example:
    - ❌ `.btn:has(svg.brush)` has [a specificity of `0,2,1`](https://polypane.app/css-specificity-calculator/#selector=.btn%3Ahas%28svg.brush%29)

    - ✅ `.btn:where(:has(svg.brush))` has [a specificity of `0,1,0`](https://polypane.app/css-specificity-calculator/#selector=.btn%3Awhere%28%3Ahas%28svg.brush%29%29)
- utilities (such as `.u-theme--blue` or `.u-hide`) also have a specificity of `0,1,0`, but `utilities.css` is imported into `styles.css` _last_, so they can always trump other CSS rules when needed.

### Data attributes
 A data attribute on an element indicates that _something javascripty_ will happen to it.
 `data-element` is used for accessing the element itself, e.g. 
 ```js
 document.querySelector('[data-element="canvas-container"]')
 ```
 Other data attributes are used for, well, _data_ related to the element:
```html
<button class="btn btn--white" data-brush="1"></button>
<button class="btn btn--white" data-brush="2"></button>
```

```js
const brushNumber = parseInt(button.getAttribute("data-brush"));
```
 Although the `button.dataset.brush` syntax is clear and convenient, `button.getAttribute("data-brush")` is preferred, as you can then do a project-wide search for `data-brush` and see where it is used in both the HTML _and_ the JS.


## File formats
Keep it light! The less data users need to download, the faster the install, the snappier apps will load, and the more reliable the PWA experience.

### WebP images
To ensure fast installs and reasonable data usage, I've converted PNG and JPEG images used within the application to [WebP](https://en.wikipedia.org/wiki/WebP), which outperforms both formats in terms of complex photos (traditionally the domain of JPEG) and in terms of graphical or semi-transparent elements (traditionally the domain of PNG.)

To convert images to WebP, you can use online converters:
- [Squoosh](https://squoosh.app/) for single images and detailed comparison
- [Squish](https://squish.addy.ie/) for bulk processing

or command line tools like [ImageMagick](https://imagemagick.org/) 

### SVG graphics
For the MinDArT logo, and the symbolic icons for each drawing app, I'm currently using WebP images, which is fine in terms of file size. But the file size would be even smaller, and the flexibility much better, if these images were served as [Scalable Vector Graphics](https://developer.mozilla.org/en-US/docs/Web/SVG). The reason for this is that the symbolic icons could easily adapt their colours to things like hover or tap, they could be animated, and in addition they would be perfectly crisp at any size.

### WOFF2 fonts
[All modern browsers support woff2](https://caniuse.com/woff2), which is far more efficient than older font formats (otf, ttf, woff). 
Support is so good (and failure is so benign) that there's no need to provide any other format as a fallback.
If your chosen typeface doesn't come as a woff2 font, you can convert it, either with an [online service](https://cloudconvert.com/woff2-converter) or using [fontTools](https://fonttools.readthedocs.io/en/latest/ttLib/woff2.html).

## Debug features
We've added debugging features to assist with development and troubleshooting.
These display technical information overlaid on the screen, so you can test functionality on a tablet (where you may not have access to the browser console).

### PWA debugging
The `debug-panel` web component lets you monitor and troubleshoot service worker behavior and updates. It displays over the entire application, as you navigate between apps and the home screen.

```js
// Only import the debug module if debugging is enabled
if (DEBUG_ENABLED) {
  import("./utils/pwa-monitor.js").catch(console.error);
}
```

The debug panel is controlled by a configuration flag in `debug-config.js`:

```js
export const DEBUG_ENABLED = false; // Set to true during development
```

When enabled, the debug panel displays console messages, provides Service Worker monitoring, navigation monitoring, Online/Offline status, and has buttons to force update checks and activation of the Service Worker.
  
### FPS Performance monitoring

For performance monitoring, the Linkscape drawing app includes a built-in FPS (frames per second) counter that can be enabled for debugging. 
```js
const state = {
  // Other state properties...
  showDebugInfo: false,
  frameRateHistory: [],
  frameRateHistoryMaxLength: 60,
};
```

It's enabled by setting `state.showDebugInfo = true`, and will display real-time performance metrics in the corner of the screen:

```js
// On-screen FPS debugging can be enabled by setting state.showDebugInfo to true
function displayDebugInfo() {
  if (!state.showDebugInfo) return;
```

it uses `p5.frameRate();` to show a current and average Frames Per Second value, which is useful for checking performance overall and across devices (e.g. an old low-end tablet will not be quite as performant as a new high-end laptop).

This is (so far) the only app where FPS performance is really an issue, due to the number of trails being drawn and the constant movement of the strings. The same approach could easily be adapted to other drawing apps, however, it should be a matter of copying the `displayDebugInfo` function and calls to it, and adding the `showDebugInfo` boolean to the state of the drawing app.
