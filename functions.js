function Programme_AppRelease(){

    // set programme start date (mm/dd/yyyy)
    var date = new Date("07/01/2023");

    // Calculate the number of elapsed days since programme start
    var today = new Date();
    var elapsedDays = Math.floor((today - date) / 86400000);

    var wk1 = '<div class="grid-Active"><a href="MindArt-1-Touchscape-v3/index.html"><img class="session" src="assets/1.jpg" alt="Week 1 - Touchscape"></a></div>';
    var wk2 = '<div class="grid-Active"><a href="MindArt-2-Linescape-v7/index.html"><img class="session" src="assets/2.jpg" alt="Week 2 - Linescape"><p></p></a></div>';
    var wk3 = '<div class="grid-Active"><a href="MindArt-3-Circlescape-v3/index.html"><img class="session" src="assets/3.jpg" alt="Week 3 - Circlescape"><p></a></p></div>';
    var wk4 = '<div class="grid-Active"><a href="MindArt-4-Colourscape-v2/index.html"><img class="session" src="assets/4.jpg" alt="Week 4 - Colourscape"></a></div>';
    var wk5 = '<div class="grid-Active"><a href="MindArt-5-Dotscape-v2/index.html"><img class="session" src="assets/5.jpg" alt="Week 5 - Dotscape"></a></div>';
    var wk6 = '<div class="grid-Active"><a href="MindArt-6-Linkscape-v5/index.html"><img class="session" src="assets/6.jpg" alt="Week 6 - Linkscape"><p></a></p></div>';
    var wk7 = '<div class="grid-Active"><a href="MindArt-8-RotationScape-v01/index.html"><img class="session" src="assets/7.jpg" alt=""><p></a></p></div>';
    var wk8 = '<div class="grid-Active"><a href="MindArt-7-Symmetryscape/index.html"><img class="session" src="assets/8.jpg" alt=""></a></div>';

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
   