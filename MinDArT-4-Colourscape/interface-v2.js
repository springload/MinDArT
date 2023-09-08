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

    show_btns();

    // Add active class to the current button (highlight it)
    var header = document.getElementById("myDIV");
    var btns = header.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
            if (current.length > 0) { 
                current[0].className = current[0].className.replace(" active", "");
            }
        this.className += " active";
        });
    }

    // Buttons on the right..
    homeButton = createButton('Main Menu');
    homeButton.position(windowWidth-170,windowHeight-290);
    homeButton.class('right-buttons');
    homeButton.mousePressed(menu);  

    resetButton = createButton('New');
    resetButton.position(windowWidth-170,windowHeight-205);
    resetButton.class('right-buttons');
    resetButton.mousePressed(reset);

    saveButton = createButton('Reset Btns');
    saveButton.position(windowWidth-170,windowHeight-120);
    saveButton.class('right-buttons');
    saveButton.mousePressed(resetButtons);

  }

  function resetButtons() {
    
    var activeButtons = document.querySelectorAll("button.active");
        for (var i = 0; i < activeButtons.length; i++) {
            activeButtons[i].classList.remove("active");
        }
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
        resetButtons();
        setActive("id-paint", "id-warm");

    } else {
        resetButtons();
        setActive("id-paint", "id-cool");
    }
    bool = 1;
  }

  function paintWarm() {
    resetButtons();
    setActive("id-paint", "id-warm");
    click.play();
    eraseState = 0;
    eraserVersion = 0;
    colourBool = !colourBool;


  }

  function paintCool() {
    click.play();
    eraseState = 0;
    eraserVersion = 0;
    resetButtons();
    colourBool = colourBool;
    setActive('id-paint', 'id-cool');
  }

  function switchToTrace() {
    click.play();
    bool = 0;
    eraseState = 0; // revert to True for erase before passing back to eraser function, which inverts
    eraserVersion = 0;
    resetButtons();
   // button2.remove();
   // button2 = createImg("assets/icon2.1.png"); // Draw selected
   // button2.style('width', '12.6vmax');
   // button2.position(20.5 * vMax, height - (12.6* vMax));
   // button2.mousePressed(switchToTrace);
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
      resetButtons();
      activeButtons("id-erase", "id-paint");

    } else {
        resetButtons();
        activeButtons("id-erase", "id-draw");
    }
  }

  function saveImage() {
    click.play();
    save('colourscape' + month() + day() + hour() + second() + '.jpg');
  }

  function addFS(){
    $('.fsButton').remove();
    fsButton = createImg("../assets/enterFS.png", "FULLSCREEN");
    fsButton.style('height', '4.5vMax');
    fsButton.class("fsButton");
    fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
    fsButton.mousePressed(fs);
  }

  function fs(){
    fullscreen(1);
    $('.fsButton').remove();
  }

  function setActive (id1, id2) {
    resetButtons();
    document.getElementById(id1).classList.add("active");
    document.getElementById(id2).classList.add("active");
  }
  