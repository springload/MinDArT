let newButton, saveButton, fsButton;
let appBg = '#1f2b45';

let button1, button2;

let vW, vMax, vMin;
let multiselectable = 1;

let dotsActive = 0;


function calcDimensions() {
  vW = width / 100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
}


function saveNext(){

  newButton = createButton("Reset")
  newButton.class("select");
  newButton.style('font-size', '1.7vmax');
  newButton.style('height', '5vmax');
  newButton.position(width - (16 * vMax), height - (7 * vMax));
  newButton.mousePressed(reset);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);

  pinButton = createButton("Pin")
  pinButton.class("select");
  pinButton.style('font-size', '1.7vmax');
  pinButton.style('height', '5vmax');
  pinButton.position((3 * vMax), height - (7 * vMax));
  pinButton.mousePressed(dotsToggle);






  fsButton = createImg('assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.position(width-(7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);


  addButton = createButton("Add one more string")
  addButton.class("select");
  addButton.id("add");
  addButton.style('font-size', '1.7vmax');
  addButton.style('height', '5vmax');
  addButton.position(18 * vMax, height - (7 * vMax));
  addButton.mousePressed(addLine);



}



function dotsToggle(){
  dotsActive = !dotsActive;
 render();
}

function addLine(){
initialiseLine(x.length); // init new line, new array
if (x.length > 3){
  $("#add").remove();
}
render();
}



function fs(){
  click.play();
  let fs = fullscreen();
 fullscreen(!fs);
}




function saveImg() {
  click.play();

save('stringscape' + month() + day() + hour() + second() + '.jpg');
}
