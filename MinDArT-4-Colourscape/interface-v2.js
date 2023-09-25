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

    saveButton = createButton('Save');
    saveButton.position(windowWidth-170,windowHeight-120);
    saveButton.class('right-buttons');
    saveButton.mousePressed(saveImage);

  }

  function resetButtons() {
    
    var activeButtons = document.querySelectorAll("button.active");
        for (var i = 0; i < activeButtons.length; i++) {
            activeButtons[i].classList.remove("active");
        }

        traceLayer.strokeWeight(5);
        traceLayer.stroke(255, 0, 255, 0.8); // for line work
  }

  function paintWarm() {
    eraseState = 0;
    eraserVersion = 0;
    resetButtons();
    colourBool = false;
    click.play();
    bool = 1;
  }

  function paintCool() {
    eraseState = 0;
    eraserVersion = 0;
    resetButtons();
    colourBool = true;
    click.play();
    bool = 1;
  }
 
  function switchToTrace() {
    click.play();
    bool = 0;
    eraseState = 0; // revert to True for erase before passing back to eraser function, which inverts
    eraserVersion = 0;
    resetButtons();
  }

  function paintErase() {
    resetButtons();
    eraseState = 1;
    eraserVersion = true;
    click.play();
  }

  function drawErase() {
    resetButtons();
    eraseState = 1;
    eraserVersion = false;
    click.play();
  }

  function saveImage() {
    click.play();
    save('colourscape' + month() + day() + hour() + second() + '.jpg');
  }

  