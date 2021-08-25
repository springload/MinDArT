  let button1A, button1B, button2A, button2B;
  let col, colSelect;
  let resetButton, saveButton;
  let button1, button2, button3;
  let eraserVersion = 0; // erase paint = 0, erase trace = 1;
  let fsBool = 0;

  function calcDimensions() {
    wmax = width / 100;
    hmax = height / 100;
    vW = width / 100;

    if (width > height) {
      vMax = width / 100;
      vMin = height / 100;
    } else {
      vMax = height / 100;
      vMin = width / 100;
    }
  }

  function writeTextUI() {

    removeElements();

    fill(0);
    noStroke();
    button1 = createImg("assets/icon1.0.png");
    button1.remove();
    button1 = createImg("assets/icon1.2.png");
    button1.remove();
    button1 = createImg("assets/icon1.1.png");
    button2 = createImg("assets/icon2.1.png");
    button2.remove()
    button2 = createImg("assets/icon2.0.png");
    button3 = createImg("assets/icon3.1.png");
    button3.remove();
    button3 = createImg("assets/icon3.2.png");
    button3.remove();
    button3 = createImg("assets/icon3.0.png");

    button1.style('width', '22vmax'); // 28 is 1.75 * 16.
    button1.position(0, height - (12.6* vMax));
    button1.mousePressed(switchToPaint);
    button2.style('width', '12.6vmax');
    button2.position(20.5 * vMax, height - (12.6* vMax));
    button2.mousePressed(switchToTrace);
    button3.style('width', '18.95vmax');
    button3.position(30.5 * vMax, height - (12.6* vMax));
    button3.mousePressed(eraser);

    saveButton = createButton("Save");
    saveButton.class("select");
    saveButton.style('font-size', '1.7vmax');
    saveButton.style('height', '5vmax');
    saveButton.position(width - (16 * vMax), height - (12.6 * vMax));
    saveButton.mousePressed(saveImage);

    resetButton = createButton("New");
    resetButton.class("select");
    resetButton.style('font-size', '1.7vmax');
    resetButton.style('height', '5vmax');
    resetButton.position(width - (16 * vMax), height - (6.5 * vMax));
    resetButton.mousePressed(reset);

  }

  function resetButtons() {
    //reset all buttons// would be nice to replace this at some point
    button3.remove();
    button3 = createImg("assets/icon3.0.png");
    button3.style('width', '18.95vmax');
    button3.position(30.5 * vMax, height - (12.6* vMax));
    button3.mousePressed(eraser);
    button2.remove();
    button2 = createImg("assets/icon2.0.png");
    button2.style('width', '12.6vmax');
    button2.position(20.5 * vMax, height - (12.6* vMax));
    button2.mousePressed(switchToTrace);
    button1.remove();
    button1 = createImg("assets/icon1.0.png");
    button1.style('width', '22vmax'); // 28 is 1.75 * 16.
    button1.position(0, height - (12.6* vMax));
    button1.mousePressed(switchToPaint);
  }

  function switchToPaint() {
    click.play();
    eraseState = 0;
    eraserVersion = 0;
    resetButtons();
    if (bool) {
      colourBool = !colourBool;
    }
    if (!colourBool) {
      button1.remove();
      button1 = createImg("assets/icon1.1.png");
      button1.style('width', '22vmax'); // 28 is 1.75 * 16.
      button1.position(0, height - (12.6* vMax));
      button1.mousePressed(switchToPaint);
    } else {
      button1.remove();
      button1 = createImg("assets/icon1.2.png");
      button1.style('width', '22vmax'); // 28 is 1.75 * 16.
      button1.position(0, height - (12.6* vMax));
      button1.mousePressed(switchToPaint);
    }
    bool = 1;
  }

  function switchToTrace() {
    click.play();
    bool = 0;
    eraseState = 0; // revert to True for erase before passing back to eraser function, which inverts
    eraserVersion = 0;
    resetButtons();
    button2.remove();
    button2 = createImg("assets/icon2.1.png");
    button2.style('width', '12.6vmax');
    button2.position(20.5 * vMax, height - (12.6* vMax));
    button2.mousePressed(switchToTrace);
  }

  function eraser() {
    click.play();
    resetButtons();
    if (eraseState === 1) {
      eraserVersion = !eraserVersion;
      console.log(eraserVersion);
    }
    eraseState = 1;
    if (eraserVersion) {
      button3.remove();
      button3 = createImg("assets/icon3.1.png");
      button3.style('width', '18.95vmax');
      button3.position(30.5 * vMax, height - (12.6* vMax));
      button3.mousePressed(eraser);
    } else {
      button3.remove();
      button3 = createImg("assets/icon3.2.png");
      button3.style('width', '18.95vmax');
      button3.position(30.5 * vMax, height - (12.6* vMax));
      button3.mousePressed(eraser);
    }
  }

  function saveImage() {
    click.play();
    save('colourscape' + month() + day() + hour() + second() + '.jpg');
  }

  function addFS(){
    $('.fsButton').remove();
    fsButton = createImg('assets/enterFS.png', "FULLSCREEN");
    fsButton.style('height', '4.5vMax');
    fsButton.class("fsButton");
    fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
    fsButton.mousePressed(fs);
  }

  function fs(){
    fullscreen(1);
    $('.fsButton').remove();
  }
