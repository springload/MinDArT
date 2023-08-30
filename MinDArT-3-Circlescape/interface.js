let resetButton, saveButton, fsButton, toggleBut, vMin;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
        vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
}

function writeTextUI() {

$(".interface").remove();
$(".select").remove();

  eraseButton = createButton('Erase');
  eraseButton.position(10, windowHeight-120);
  eraseButton.class('button-white', 'select');
  eraseButton.mousePressed(eraseToggle);

  drawSmlBtn = createButton('Draw Small');
  drawSmlBtn.position(175,windowHeight-120);
  drawSmlBtn.class('button-white-leftsplit');
  drawSmlBtn.mousePressed(drawSml);

  drawBigBtn = createButton('Draw Big');
  drawBigBtn.position(320,windowHeight-120);
  drawBigBtn.class('button-white-rightsplit');
  drawBigBtn.mousePressed(drawBig);

  // Buttons on the right..
  homeButton = createButton('Main Menu');
  homeButton.position(windowWidth-170,windowHeight-290);
  homeButton.class('right-buttons');
  homeButton.mousePressed(menu);  

  resetButton = createButton('New');
  resetButton.position(windowWidth-170,windowHeight-205);
  resetButton.class('right-buttons');
  resetButton.mousePressed(restart);

  saveButton = createButton('Save');
  saveButton.position(windowWidth-170,windowHeight-120);
  saveButton.class('right-buttons');
  saveButton.mousePressed(saveImg);
  /**
  eraseBtn = createButton('Erase');
  eraseBtn.position(2 * vMax, height - (6 * vMax));
  eraseBtn.class("select");
  eraseBtn.style('font-size', '1.3vmax');
  eraseBtn.style('height', '5vmax');
  eraseBtn.style('width', '8vmax');
  eraseBtn.mousePressed(eraseToggle);
   
  //invert
  drawSmlBtn = createButton('Draw Small');
  drawSmlBtn.position(11 * vMax, height - (6 * vMax));
  drawSmlBtn.class("select");
  drawSmlBtn.style('font-size', '1.3vmax');
  drawSmlBtn.style('height', '5vmax');
  drawSmlBtn.style('width', '8vmax');
  drawSmlBtn.mousePressed(drawSml);

  //invert
  drawBigBtn = createButton('Draw Big');
  drawBigBtn.position(20 * vMax, height - (6 * vMax));
  drawBigBtn.class("select");
  drawBigBtn.style('font-size', '1.3vmax');
  drawBigBtn.style('height', '5vmax');
  drawBigBtn.style('width', '8vmax');
  drawBigBtn.mousePressed(drawBig);
 */ 
}

function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('../assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}

function checkFS(){
  if (!fullscreen()){
  addFS();
  }
}

function saveImg() {

  save('touchscape' + month() + day() + hour() + second() + '.jpg');

}
