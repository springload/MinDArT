let newButton, saveButton, fsButton;
let appBg = '#1f2b45';

let button1, button2;

let vW, vMax, vMin;
let multiselectable = 0;

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

  pinButton = createButton("Pins")
  pinButton.class("select");
  pinButton.style('font-size', '1.7vmax');
  pinButton.style('height', '5vmax');
  pinButton.position(width - (32 * vMax), height - (7 * vMax));
  pinButton.mousePressed(dotsToggle);






  fsButton = createImg('assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.position(width-(7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);

  button1 = createImg('assets/icon1.0.png');
  button1.remove();
  button1 = createImg('assets/icon1.1.png');
  button1.style('width', '16vmax');
  button1.position(3 * vMax, height - (10 * vMax));
  button1.mousePressed(switcher);

  button2 = createImg('assets/icon2.1.png');
  button2.remove();
  button2 = createImg('assets/icon2.0.png');
  button2.style('width', '16vmax');
  button2.position(19 * vMax, height - (10 * vMax));
  button2.mousePressed(switcher);



}

function addBut(){
  addButton = createButton("Add")
  addButton.class("add");
  addButton.style('font-size', '1.7vmax');
  addButton.style('height', '5vmax');
  addButton.position(width - (48 * vMax), height - (7 * vMax));
  addButton.mousePressed(addLine);
}

function dotsToggle(){
  dotsActive = !dotsActive;
 render();
}

function addLine(){
initialiseLine(x.length); // init new line, new array
if (x.length > 3){
  $(".add").remove();
}
render();
}

function switcher(){
  click.play();
  multiselectable = !multiselectable;

  $(".add").remove();




  if (!multiselectable){

    button1.remove();
    button1 = createImg('assets/icon1.1.png');
    button1.style('width', '16vmax');
    button1.position(3 * vMax, height - (10 * vMax));
    button1.mousePressed(switcher);


    button2.remove();
    button2 = createImg('assets/icon2.0.png');
    button2.style('width', '16vmax');
    button2.position(19 * vMax, height - (10 * vMax));
    button2.mousePressed(switcher);

      segLength = 18;

  //trim more than one branch
  x.length = 1;
  y.length = 1;

  }

  else {

    addBut();

    button1.remove();
    button1 = createImg('assets/icon1.0.png');
    button1.style('width', '16vmax');
    button1.position(3 * vMax, height - (10 * vMax));
    button1.mousePressed(switcher);


    button2.remove();
    button2 = createImg('assets/icon2.1.png');
    button2.style('width', '16vmax');
    button2.position(19 * vMax, height - (10 * vMax));
    button2.mousePressed(switcher);

      segLength = 18;

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
