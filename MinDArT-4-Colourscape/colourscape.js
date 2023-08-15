  // images
  let bg;
  let brush = [];
  // brush mechanics
  let angle1, segLength;
  let scalar = 30;
  let tempwinMouseX = 0;
  let tempwinMouseY = 0;
  let tempX = 100;
  let tempY = 100;
  let dx, dy;
  // VARIABLES FOR TIME DELAY ON BRUSH
  let milliCounter;
  let milliTrack = 0;
  //BRUSH CHARACTERISTICS
  let milliComp = 5;
  let scatterAmount = 2;
  // COLOUR VARAIABLES
  let colHue;
  const colHueMin = 0;
  const colHueMax = 360;
  let colSat;
  const colSatMin = 0;
  const colSatMax = 255;
  let colBri;
  const colBriMin = 0;
  const colBriMax = 255;
  let colOpacity = 0.4;
  let colourBool = 0;
  let introLayer;
  let cloudHSB = [
    [180, 47, 25],
    [178, 23, 55],
    [170, 15, 75],
    [164, 12, 95],
    [176, 45, 19]
  ];
  let sunsetHSB = [
    [11, 53, 96],
    [13, 83, 91],
    [2, 90, 100],
    [334, 81, 91],
    [300, 67, 99]
  ];
  const hueDrift = 3;
  const satDrift = 3;
  const rotateDrift = 0.6;
  let bool = 1;
  let brushTemp = 0;
  let buttonText1state = 0;
  let buttonText2state = 0;
  let wmax, hmax, vMax;
  let audio;
  let startState = 0;
  let alphaErase;
  let eraseState = 0;
  let saveState = 1;
  let buttonTEST;
  let autoX = 0,
    autoY = 0,
    pautoX = 0,
    pautoY = 0; // automated drawing mouse states
  let paintLayer, traceLayer;
  let started = 0;
  let storedOrientation, storedOrientationDegrees, rotateDirection;

  function preload() {
    bg = loadImage('assets/paper.jpg'); // background paper
    for (let i = 0; i < 15; i++) {
      brush[i] = loadImage('assets/Cloud' + i + '.png') // brush loader
    }
    audio = loadSound('../sound/Scene4_Colour.mp3');
    click = loadSound('../sound/click.mp3');
  }


  function start() {
    $(".startBtn").remove();
    fullscreen(1);
    // note currently everything resets on windowResized. Unsure if this is logical yet

    if (audio.isPlaying()) {} else {
      audio.loop(1);
    }

    reset();
    started = 1;
  }

  function setup() {
    createCanvas(windowWidth, windowHeight);

    paintLayer = createGraphics(width, height);
    traceLayer = createGraphics(width, height);
    pixelDensity(1); // Ignores retina displays

    colHue = random(colHueMin, colHueMax);
    colSat = random(colSatMin, colSatMax);
    strokeWeight(4); // for line work
    stroke(255, 0, 255); // for line work

    setLayerProperties();


    var stbtn = $("<div />").appendTo("body");
    stbtn.addClass('startBtn');
    $('<p>Touch here to begin</p>').appendTo(stbtn);
    stbtn.mousedown(start);
    stbtn.mousemove(start);
  }

  function setLayerProperties(){
    imageMode(CENTER); // centers loaded brushes
    blendMode(BLEND); // consider overlay and multiply
    traceLayer.blendMode(LIGHTEST); // consider overlay and multiply
    colorMode(HSB, 360, 100, 100, 1);
    paintLayer.colorMode(HSB, 360, 100, 100, 1);
    traceLayer.colorMode(HSB, 360, 100, 100, 1);
  }

  function reset(){
    calcDimensions();
    writeTextUI();

    backdrop();
    segLength = windowWidth / 40; // length of delay between touch and paint or line // 15 is a good value
    setProperties(0, 0);
        paintLayer.clear();
    traceLayer.clear();
    if (!bool) invertTracing();
    render();
  }

  function backdrop() {
    background(255);
    noTint();
    image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight); // display backgrond
  }

  function touchStarted() {
    if (!started){
      start();
    }
      setProperties(winMouseX, winMouseY); 
  }

  function setProperties(_x, _y) {
    tempwinMouseX = ((windowWidth / 2) - _x); // record position on downpress
    tempwinMouseY = ((windowHeight / 2) - _y); // record position on downpress
    brushTemp = int(random(0, brush.length-1));

    if (bool) {
      //image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
      let swatchTemp = int(random(0, 5));
      if (colourBool) {
        colHue = cloudHSB[swatchTemp][0];
        colSat = cloudHSB[swatchTemp][1];
        colBri = cloudHSB[swatchTemp][2];
      } else {
        colHue = sunsetHSB[swatchTemp][0];
        colSat = sunsetHSB[swatchTemp][1];
        colBri = sunsetHSB[swatchTemp][2];
      }
    }
  }



  function touchMoved() {

    if (started){

      if (eraseState === 0) {
        makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
      } else {
        eraseDrawing();
      }

      render();
    }

    return false;
  }

  function render(){
    blendMode(BLEND);
    backdrop();
    blendMode(DARKEST);
    image(paintLayer, width / 2, height / 2);
    blendMode(LIGHTEST);
    image(traceLayer, width / 2, height / 2);

  }

  function autoDraw() {
    pautoX = autoX;
    pautoY = autoY;
    autoX = autoX + (random(-50, 55));
    autoY = autoY + (random(-20, 22));
    makeDrawing(autoX % width, autoY % height, pautoX % width, pautoY % height);
  }

  function makeDrawing(_x, _y, pX, pY) {
    milliCounter = millis();
    if (bool) {
      if (milliCounter > milliTrack + milliComp) {
        if (colSat < 10) {
          colSat += 30
        }
        dx = _x - tempX;
        dy = _y - tempY;
        angle1 = atan2(dy, dx) + (random(-rotateDrift, rotateDrift)); // https://p5js.org/reference/#/p5/atan2
        tempX = _x - (cos(angle1) * segLength / 2); // https://p5js.org/examples/interaction-follow-1.html
        tempY = _y - (sin(angle1) * segLength / 2);
        scalar = constrain(70 * (random(3, abs(_x - pX)) / windowWidth), 0.2, 1.2);
        segment(tempX, tempY, angle1, brush[brushTemp], scalar)
        milliTrack = milliCounter;
      }
    } else {
      for (let i = 0; i < 5; i++) {
        traceLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), .8, 3.5)); // for line work
        traceLayer.stroke(255, 0, 255, 0.4); // for line work
        traceLayer.line(_x + random(-3, 3), _y + random(-3, 3), pX + random(-3, 3), pY + random(-3, 3));
      }
    }
  }

  function segment(rakeX, rakeY, a, rake, scalar) {
    paintLayer.tint((colHue += random(-hueDrift, hueDrift)), (colSat += random(-satDrift, satDrift)), colBri, colOpacity); // Display at half opacity
    paintLayer.push();
    paintLayer.imageMode(CENTER); // centers loaded brushes
    paintLayer.translate(rakeX + (randomGaussian(-scatterAmount * (0.1 * scalar), scatterAmount * (0.1 * scalar))), rakeY + (randomGaussian(-scatterAmount * (0.1 * scalar), scatterAmount * (0.1 * scalar))));
    paintLayer.scale(scalar);
    paintLayer.rotate(a);
    paintLayer.image(rake, 0, 0, 200, 200);
    paintLayer.imageMode(CORNER); // centers loaded brushes
    paintLayer.pop();
  }



  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    sizeWindow();
    setLayerProperties();
    writeTextUI();
    checkFS();
     render();



  }


  function sizeWindow() {
    if (width < height) {
      currentOrientation = "portrait";
    } else {
      currentOrientation = "landscape";
    }
    if (currentOrientation === storedOrientation) {
      stretchWindow();
    } else {
      if (window.orientation < storedOrientationDegrees) {
        direction = 1;
      } else {
        direction = -1;
      }

      if (abs(window.orientation - storedOrientationDegrees) == 270){
        direction = -direction;
      }
      rotateWindow(direction);
      storedOrientationDegrees = window.orientation;
    }
    storedOrientation = currentOrientation;
    calcDimensions();
  }

  function stretchWindow() {

    var newpaintLayer = createGraphics(windowWidth, windowHeight);
    newpaintLayer.image(paintLayer, 0, 0, windowWidth, windowHeight);
    paintLayer.resizeCanvas(windowWidth, windowHeight);
    paintLayer = newpaintLayer;
    newpaintLayer.remove();

    var newtraceLayer = createGraphics(windowWidth, windowHeight);
    newtraceLayer.image(traceLayer, 0, 0, windowWidth, windowHeight);
    traceLayer.resizeCanvas(windowWidth, windowHeight);
    traceLayer = newtraceLayer;
    newtraceLayer.remove();


  }

  function rotateWindow(direction) {
    var newpaintLayer = createGraphics(windowWidth, windowHeight);
    newpaintLayer.push();
    newpaintLayer.translate(width / 2, height / 2);
    newpaintLayer.rotate((PI / 2) * direction);
    newpaintLayer.translate(-height / 2, -width / 2);
    newpaintLayer.image(paintLayer, 0, 0, windowHeight, windowWidth);
    newpaintLayer.pop()
    paintLayer.resizeCanvas(windowWidth, windowHeight);
    paintLayer = newpaintLayer;
    newpaintLayer.remove();

    var newtraceLayer = createGraphics(windowWidth, windowHeight);
    newtraceLayer.push();
    newtraceLayer.translate(width / 2, height / 2);
    newtraceLayer.rotate((PI / 2) * direction);
    newtraceLayer.translate(-height / 2, -width / 2);
    newtraceLayer.image(traceLayer, 0, 0, windowHeight, windowWidth);
    newtraceLayer.pop()
    traceLayer.resizeCanvas(windowWidth, windowHeight);
    traceLayer = newtraceLayer;
    newtraceLayer.remove();


    // TODO: properly detect the orientation
    rotateDirection = rotateDirection * -1;
  }



  function checkFS(){
    if (!fullscreen()){
    addFS();
  }
  }

  //startSimulation and pauseSimulation defined elsewhere
  function handleVisibilityChange() {
    if (document.hidden) {
      audio.stop();
    } else {
      audio.loop(1);
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, false);
