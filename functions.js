function Programme_AppRelease(){

    // set programme start date (mm/dd/yyyy)
    var date = new Date("01/26/2023");

    // Calculate the number of elapsed days since programme start
    var today = new Date();
    var elapsedDays = Math.floor((today - date) / 86400000);


    var wk1 = '<div class="grid-Active"><a href="MinDArT-1-Touchscape/index.html"><img class="session" src="assets/touch scape icon.png" alt="Week 1 - Touchscape"></a></div>';
    var wk2 = '<div class="grid-Active"><a href="MinDArT-2-Linescape/index.html"><img class="session" src="assets/line scape icon.png" alt="Week 2 - Linescape"><p></p></a></div>';
    var wk3 = '<div class="grid-Active"><a href="MinDArT-3-Circlescape/index.html"><img class="session" src="assets/circle scape icon.png" alt="Week 3 - Circlescape"><p></a></p></div>';
    var wk4 = '<div class="grid-Active"><a href="MinDArT-4-Colourscape/index.html"><img class="session" src="assets/colour scape icon.png" alt="Week 4 - Colourscape"></a></div>';
    var wk5 = '<div class="grid-Active"><a href="MinDArT-5-Dotscape/index.html"><img class="session" src="assets/dot scape icon.png" alt="Week 5 - Dotscape"></a></div>';
    var wk6 = '<div class="grid-Active"><a href="MinDArT-6-Linkscape/index.html"><img class="session" src="assets/link scape icon.png" alt="Week 6 - Linkscape"><p></a></p></div>';
    var wk7 = '<div class="grid-Active"><a href="MinDArT-7-Rotationscape/index.html"><img class="session" src="assets/rotation scape icon.png" alt="Week 7 - Rotationscape"><p></a></p></div>';
    var wk8 = '<div class="grid-Active"><a href="MinDArT-8-Symmetryscape/index.html"><img class="session" src="assets/symmetry scape icon.png" alt="Week 8 - Symmetryscape"></a></div>';

        // determine apps to display
        if (elapsedDays < 7) {
            document.querySelector('.grid').innerHTML = wk1;
        } 
        else if (elapsedDays < 14){
            document.querySelector('.grid').innerHTML = wk1 + wk2;
        } 
        else if (elapsedDays < 21){
            document.querySelector('.grid').innerHTML = wk1 + wk2 + wk3;
        }
        else if (elapsedDays < 28){
            document.querySelector('.grid').innerHTML = wk1 + wk2 + wk3 + wk4;
        }
        else if (elapsedDays < 35){
            document.querySelector('.grid').innerHTML = wk1 + wk2 + wk3 + wk4 + wk5;
        }
        else if (elapsedDays < 42){
            document.querySelector('.grid').innerHTML = wk1 + wk2 + wk3 + wk4 + wk5 + wk6;
        }
        else if (elapsedDays < 49){
            document.querySelector('.grid').innerHTML = wk1 + wk2 + wk3 + wk4 + wk5 + wk6 + wk7;
        } 
        else{
            document.querySelector('.grid').innerHTML = wk1 + wk2 + wk3 + wk4 + wk5 + wk6 + wk7 + wk8;
        }
}


// Common interface functions
function menu() {
    window.location.href = "https://jameswilce.github.io/DevMinDArT";
    //window.location.href = "/";
}

function show_btns() {
    var getBtns = document.getElementsByClassName("btn");
    for (var i = 0; i < getBtns.length; i++) {
      getBtns[i].style.display = "inline";
    }
  }

  function resetButtons() {
    
    var activeButtons = document.querySelectorAll("button.active");
        for (var i = 0; i < activeButtons.length; i++) {
            activeButtons[i].classList.remove("active");
        }
  }
  
  function setActive (id1, id2) {
    resetButtons();
    document.getElementById(id1).classList.add("active");
    document.getElementById(id2).classList.add("active");
  }


  function setActiveElementById(id) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('active');
    }
  }


  