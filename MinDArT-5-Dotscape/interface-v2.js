function writeTextUI() {

  $(".interface").remove();
  $(".select").remove();

  textSize(vMax*2);
  fill(0);
  noStroke
  colH1 = color(355, 0, 20);

  // Buttons on the right..
homeButton = createButton('Main Menu');
homeButton.position(windowWidth-170,windowHeight-290);
homeButton.class('right-buttons');
homeButton.mousePressed(menu);  

resetButton = createButton('New');
resetButton.position(windowWidth-170,windowHeight-205);
resetButton.class('right-buttons');
resetButton.mousePressed(nextDrawing);

saveButton = createButton('Save');
saveButton.position(windowWidth-170,windowHeight-120);
saveButton.class('right-buttons');
saveButton.mousePressed(saveImg);



}

function writeRestartUI() {
  textSize(vMax*2);
  fill(0);
  noStroke();
  nextButton.remove();
  nextButton = createButton("Restart")
  nextButton.class("select");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.style('background-color', 'indianred');
  nextButton.mousePressed(restart);
}

function restart() {
  stage = 0;
  dimensionCalc();
  writeTextUI();
  nextDrawing();
}


function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}

function checkFS(){
  if (!fullscreen()){
  addFS();
}
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
