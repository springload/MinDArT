let resetButton, saveButton, fsButton;
let buttons = [];
let currentRake = 1;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function writeTextUI() {

  // TODO: REMOVE ELEMENTS

$(".interface").remove();
$(".select").remove();


  for (let i = 0; i < 4; i++) {
    buttons[i] = createImg('assets/icon' + (1 + i) + '.png');
    buttons[i].class("interface");
    buttons[i].id("interface"+i);
    buttons[i].style('width', '13vMax');
    // buttons[i].mousePressed(function() {
    //   rake(i);
    //   return false;
    // });


  //  $( "#interface"+i).wrap( "<div class='imgButton' id='imgButton"+i+"'></div>" );

    $('#interface'+i).on("touchstart", function(event){
      rake(i);
      event.preventDefault();
    })
    $('#interface'+i).on("click", function(event){
      rake(i);
      event.preventDefault();
    })

    // important - removes save image, open in new tab etc. Needs to be attached to the buttons.
    // note this is not an issue on actual button UI.
      $('#interface'+i).on('contextmenu', event => event.preventDefault());

    buttons[i].position(vMax * (11 * i), windowHeight - vMax * 13);
  }

  selector = createImg('assets/selector.png');
  selector.class("interface");
  selector.style('width', '13vMax');
  selector.position(vMax * 11, windowHeight - vMax * 13);

  resetButton = createButton('New');
  resetButton.position(windowWidth - (10 * vMax) - (vMax * 5), windowHeight - vMax * 6);
  resetButton.class("select");
  resetButton.position(width - (16 * vMax), height - (7 * vMax));
  resetButton.mousePressed(resetTimeout);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);


}

function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('../assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}

function rake(version) {

  currentRake = version;

  if (version == 0) {
    change(1, 200, 1);
    eraseActive = 1;
  }
  if (version == 1) {
    change(5, 60, 100);
    eraseActive = 0;
  }
  if (version == 2) {
    change(15, 100, 100);
    eraseActive = 0;
  }
  if (version == 3) {
    change(60, 150, 100);
    eraseActive = 0;
  }
  selector.position(vMax*(version*11), windowHeight - vMax * 13);
  click.play();
}

function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}
