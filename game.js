//variables

function setup() {
  mode = 0;
  createCanvas(1000, 650);
  textAlign(CENTER);
  noStroke();
}

function startState(){
clear();
  if (mode==0)
    startScreen();
  if (mode==1){
    chooseCharacter();
  }
  if (mode==2){

  }
}

function keyPressed(){
  if (keyCode===ENTER)
    mode = 1;
}

function draw() {
  startScreen();
}

function startScreen(){
  fill(0);
  rect(0, 0, 1000, 650);
}

function chooseCharacter(){
  
}

function gamelvl1(){
}

function gameOver(){
}

function resetGame(){
}

function lvl1AkademienMapA() {
  fill(0);
  // rect(850, 100, 5, 5);

  fill(0);
  rect(80, 60, 820, 5); //top
  rect(80, 60, 5, 520); //left side
  rect(80, 580, 850, 5); //bottom
  rect(900, 60, 5, 200); //right side

  rect(925, 260, 5, 320); //right side
  rect(900, 260, 30, 5); //bottom

  rect(240, 530, 460, 50); //tables
  rect(150, 60, 80, 300); //bar
  rect(270, 480, 30, 30); //bar stools
  rect(370, 480, 30, 30); //bar stools 2
  rect(470, 480, 30, 30); //bar stools 3
  rect(560, 480, 30, 30); //bar stools 4
  rect(650, 480, 30, 30); //bar stools 5

  rect(400, 390, 340, 5); //fence
  rect(735, 345, 5, 50); //fence

  fill(73, 80, 87);
  rect(230, 60, 300, 100); //standing platform against bar
  rect(800, 60, 100, 200); //standing platform against bathrooms

  fill(186, 24, 27); //exits
  rect(80, 400, 5, 150); //to next dancefloor
  rect(590, 60, 150, 5); //to outside
  rect(925, 265, 5, 90); //entrance

  rect(925, 370, 5, 70); //nugget entrance

}

function lvl1AkademienMapB()  {

}
