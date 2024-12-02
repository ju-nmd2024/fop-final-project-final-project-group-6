//variables

let mode; // game mode: 0 = start screen, 1 = menu, 2 = collect drinks, 3 = dance floor
let player; // current player 
let drinks = []; // list of drinks on the dance floor
let characterChoice = -1; // -1 no character selected yet
let boundries = [];

const drinkSize = 20; // size of the drinks
const width = 1000;
const height = 650;

function setup() {
  createCanvas(width, height);
  mode = 0; 
  textAlign(CENTER, CENTER);

  player = new Player(100, 100);

  boundries.push(new Boundary(100, 150, 50, 30));
  boundries.push(new Boundary(100, 150, 50, 30));
}

function draw() {
  background(0);

  switch(mode) {
    case 0:
      startScreen();
      break;
    case 1:
      menu();
      break;
    case 2:
      collectDrinks();
      break;
    case 3:
      danceFloor();
  }
}

function startScreen() {
  titleArt();

  fill(255);
  textSize(20);
  text("Choose your character", width / 2, 400);
}

function titleArt(){
  noStroke();
  translate(50, 50);
  scale(0.85, 0.8, 2);

  push();
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

  pop();
}

function menu(){
  textSize(18);
  text("Press 1 for Paulina (Beginner)", width / 2, 580);
  text("Press 2 for Agnes (Expert)", width / 2, 620);

} //close menu

// Handle character selection and start the game    change to buttons
function keyPressed() {
  if (keyCode === ENTER)
    mode = 1;

  if (key === '1') {
    characterChoice = 1; // (beginner)
    player = new Player("Paulina", 10, height - 50, 5);
    mode = 2; 
  } else if (key === '2') {
    characterChoice = 2; // (expert)
    player = new Player("Agnes", 10, height - 50, 20); // faster movement
    mode = 2; 
  }
}

function collectDrinks() {
  // Draw the player character
  player.update();
  player.show();

  for (let boundary of boundries) {
    boundary.show();
  }

  // Spawn drinks randomly
  if (frameCount % 60 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100)));
  }

  // Draw all drinks
  for (let drink of drinks) {
    drink.show();
    if (player.collect(drink)) {
      drinks = drinks.filter(d => d !== drink); // Remove collected drink
    }
  }

  // Next stage after collecting drinks
  if (player.energy >= 3) {
    mode = 3; // Switch to dance floor after collecting enough drinks
  }
}

// Dance floor 
function danceFloor() {
  // Placeholder for rhythm-based mechanics
  fill(0);
  textSize(30);
  text("Time to Dance!", width / 2, height / 4);
}

// Player class, handles movement and energy
class Player {
  constructor(name, x, y, speed) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = 0; // number of drinks collected
  }
  

  // player pos
  update() {
    if (keyIsDown(65) && !this.collides()) this.x -= this.speed;  //left
    if (keyIsDown(68) && !this.collides()) this.x += this.speed;  //right
    if (keyIsDown(87) && !this.collides()) this.y -= this.speed;  //up
    if (keyIsDown(83) && !this.collides()) this.y += this.speed;  //down 
    
    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  }

  // actualy show the player
  show() {
    fill(200, 0, 0); // Red color for the player
    ellipse(this.x, this.y, 40, 40); // Draw the player as a circle
  }

  collides() {  //collision
    for (let boundary of boundries) {
      if (boundary.collide(this)) {
        return true; //if collide w boundary, stop movement
      }
    }
    return false;
  }

  // Check if the player collected a drink
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
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show(){
    fill(255, 0, 0, 150); 
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  collide(player) {
    let playerLeft = player.x;
    let playerRight = player.x + 40; // Assuming player is a 40x40 circle
    let playerTop = player.y;
    let playerBottom = player.y + 40;

    let boundaryLeft = this.x;
    let boundaryRight = this.x + this.w;
    let boundaryTop = this.y;
    let boundaryBottom = this.y + this.h

    if (
      playerRight > boundaryLeft &&
      playerLeft < boundaryRight &&
      playerBottom > boundaryTop &&
      playerTop < boundaryBottom
    ) {
      return true; // Colliding
    }
    return false; // No collision
  }
}

// Drink class to spawn drinks on the dance floor
class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Show the drink
  show() {
    fill(252, 163, 17); // Orange color for the drink
    rect(this.x, this.y, drinkSize, drinkSize);
  }
}