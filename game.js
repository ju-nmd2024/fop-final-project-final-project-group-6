// variables
let mapImage;
let mode; 
let player; 
let drinks = []; 
let characterChoice = -1; // -1: no character selected yet
let boundries = []; //obstacles


let textSizeAnimation = 15; //text animation 
let minTextSize = 15;
let maxTextSize = 18;
let sizeSpeedTextSize = 0.03;

function preload() {
  // Load the map image
  mapImage = loadImage('./images/game_friendly_map_1000x650.png');
}

function setup() {
  createCanvas(width, height);
  mode = 0; 
  textAlign(CENTER, CENTER);

  player = new Player("Player1", 100, 100, 5);

  boundries.push(new Boundary(100, 150, 50, 30));
  boundries.push(new Boundary(200, 350, 50, 30));
}

function draw() {
  background(0);

  switch (mode) {
    case 0:
      startScreen();
      startScreenTextAnimation();
      break;
    case 1:
      menu();
      break;
    case 2:
      collectDrinks();
      break;
    case 3:
      danceFloor();
      break;
  }

}

function startScreen() {
  titleArt();

  fill(255);
  textSize(textSizeAnimation);
  text("PRESS ENTER TO START", width / 2, 430);
}

function titleArt() {
  noStroke();

  //

  fill(252, 163, 17);
  rect(100, 100, 10, 50); 
  rect(110, 150, 20, 10);

  rect(160, 110, 20, 10);
  rect(150, 120, 10, 40); 
  rect(180, 120, 10, 40); 
  rect(160, 130, 20, 10);

  rect(220, 110, 20, 10);
  rect(210, 120, 10, 10);
  rect(220, 130, 20, 10);
  rect(240, 140, 10, 10);
  rect(210, 150, 30, 10);

  rect(270, 110, 10, 50); 
  rect(260, 110, 30, 10);

  //

  rect(360, 110, 10, 50);
  rect(370, 120, 10, 10);
  rect(380, 130, 10, 10);
  rect(390, 110, 10, 50);

  rect(420, 110, 10, 50);

  rect(450, 120, 10, 30);
  rect(460, 110, 20, 10);
  rect(460, 150, 20, 10);
  rect(480, 130, 10, 20);
  rect(470, 130, 10, 10);

  rect(510, 110, 10, 50);
  rect(520, 130, 20, 10);
  rect(540, 110, 10, 50);

  rect(580, 110, 10, 50); 
  rect(570, 110, 30, 10);

  //

  rect(670, 110, 10, 40);
  rect(680, 150, 10, 10);
  rect(690, 140, 10, 10);
  rect(700, 150, 10, 10);
  rect(710, 110, 10, 40);

  rect(750, 110, 20, 10);
  rect(740, 120, 10, 40); 
  rect(770, 120, 10, 40); 
  rect(750, 130, 20, 10);

  rect(810, 110, 20, 10);
  rect(800, 120, 10, 10);
  rect(810, 130, 20, 10);
  rect(830, 140, 10, 10);
  rect(800, 150, 30, 10);

  //

  rect(910, 110, 20, 10);
  rect(900, 120, 10, 40); 
  rect(930, 120, 10, 40); 
  rect(910, 130, 20, 10);

  //

  rect(260, 290, 10, 50);
  rect(270, 240, 10, 120);
  rect(280, 230, 10, 130);
  rect(290, 230, 10, 120);
  rect(300, 240, 10, 70);
  rect(310, 260, 10, 40);
  rect(320, 270, 10, 40);
  rect(330, 280, 10, 40);
  rect(340, 270, 10, 40);
  rect(350, 250, 10, 40);
  rect(360, 240, 10, 40);
  rect(370, 240, 10, 70);
  rect(380, 230, 10, 120);
  rect(390, 220, 20, 120);
  rect(410, 230, 10, 70);

  rect(460, 250, 10, 40);
  rect(470, 240, 20, 70);
  rect(490, 230, 20, 90);
  rect(510, 240, 20, 70);
  rect(530, 250, 10, 40);

  rect(570, 230, 10, 40);
  rect(580, 220, 10, 70);
  rect(590, 240, 10, 70);
  rect(600, 260, 20, 70);
  rect(620, 250, 10, 70);
  rect(630, 240, 10, 60);
  rect(640, 220, 10, 60);
  rect(650, 210, 10, 40);

  rect(690, 240, 10, 50);
  rect(700, 230, 20, 80);
  rect(720, 260, 10, 40);

  rect(770, 240, 10, 70);
  rect(780, 230, 10, 100);
  rect(790, 220, 10, 30);
  rect(800, 220, 20, 20);
  rect(820, 230, 10, 10);
  rect(790, 310, 20, 30);
  rect(810, 320, 10, 20);
  rect(790, 270, 30, 20);
  rect(820, 320, 10, 10);
}

function menu() {
  textSize(18);
  fill(255);
  text("Press 2 for Paulina (Beginner)", width / 2, 580);
  text("Press 3 for Agnes (Expert)", width / 2, 620);
}

// character selection and start the game
function keyPressed() {
  if (keyCode === ENTER) mode = 1;

  if (key === '2') {
    characterChoice = 1; // Beginner
    player = new Player("Paulina", 10, height - 50, 5);
    mode = 2; 
  } else if (key === '3') {
    characterChoice = 2; // Expert
    player = new Player("Agnes", 10, height - 50, 8); // Faster movement
    mode = 2; 
  }
}

function collectDrinks() {
  // draw the player character
  player.update();
  player.show();

  for (let boundary of boundries) {
    boundary.show();
  }

  // spawn drinks randomly
  if (frameCount % 60 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100)));
  }

  // draw all drinks
  for (let i = drinks.length - 1; i >= 0; i--) {
    let drink = drinks[i];
    drink.show();
    if (player.collect(drink)) {
      drinks.splice(i, 1); // remove collected drink
    }
  }

  displayDrinkCount();

  // call for if next stage after collecting drinks
  if (player.energy >= 3) {
    mode = 3; // dance floor
  }
}

function displayDrinkCount() {
  fill(255);
  textSize(18);
  text("Drinks Collected: " + player.energy, width / 2, 50);
}

function danceFloor() {
  // Placeholder for rhythm-based mechanics
  fill(255);
  textSize(30);
  text("Time to Dance!", width / 2, height / 4);
}

// Player class
class Player {
  constructor(name, x, y, speed) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = 0; // Drinks collected
  }

  update() {
    let nextX = this.x;
    let nextY = this.y;

    if (keyIsDown(65)) nextX -= this.speed; // A key (left)
    if (keyIsDown(68)) nextX += this.speed; // D key (right)
    if (keyIsDown(87)) nextY -= this.speed; // W key (up)
    if (keyIsDown(83)) nextY += this.speed; // S key (down)

    if (!this.collides(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    }

    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  }

  show() {
    fill(200, 0, 0); 
    ellipse(this.x, this.y, 40, 40); // player as a circle
  }

  collides(nextX, nextY) {
    for (let boundary of boundries) {
      if (boundary.collide({ x: nextX, y: nextY })) {
        return true;
      }
    }
    return false;
  }

  collect(drink) {
    let d = dist(this.x, this.y, drink.x, drink.y);
    if (d < 25) {
      this.energy += 1;
      return true;
    }
    return false;
  }
}


class Boundary {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(255, 0, 0, 150); 
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  collide(player) {
    let playerLeft = player.x - 20; 
    let playerRight = player.x + 20; 
    let playerTop = player.y - 20; 
    let playerBottom = player.y + 20;

    let boundaryLeft = this.x;
    let boundaryRight = this.x + this.w;
    let boundaryTop = this.y;
    let boundaryBottom = this.y + this.h;

    return (
      playerRight > boundaryLeft &&
      playerLeft < boundaryRight &&
      playerBottom > boundaryTop &&
      playerTop < boundaryBottom 
    ) ;
  }
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(252, 163, 17); // drink color
    rect(this.x, this.y, drinkSize, drinkSize);
  }
}

function startScreenTextAnimation(){
  textSizeAnimation = map(sin(frameCount * sizeSpeedTextSize), -1.0, 1.0, minTextSize, maxTextSize);
  /*
line 343 taken from mo.h, George Profenza, 
& Kevin Workman. (2016, February 2). How to make the size of 
ellipse to get smaller and bigger in processing automatically. 
Stack Overflow. 
https://stackoverflow.com/questions/35156661/how-to-make-the-size-of-ellipse-to-get-smaller-and-bigger-in-processing-automati 
, reworked by enickles on p5js https://editor.p5js.org/enickles/sketches/SkDt1quAX
 */
}