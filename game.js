let mode; // game mode: 0 = start screen, 1 = collect drinks, 2 = dance floor
let player; // current player object
let drinks = []; // list of drink objects on the floor
let characterChoice = -1; // -1 means no character selected yet

const drinkSize = 20; // size of the drinks
const floorWidth = 1000;
const floorHeight = 650;

function setup() {
  createCanvas(floorWidth, floorHeight);
  mode = 0; // Start with the start screen
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  switch(mode) {
    case 0:
      startScreen();
      break;
    case 1:
      collectDrinks();
      break;
    case 2:
      danceFloor();
      break;
  }
}

function startScreen() {
  fill(0);
  textSize(40);
  text("Last Night Was a Movie", width / 2, height / 4);
  textSize(20);
  text("Choose your character", width / 2, height / 2);

  textSize(18);
  text("Press 1 for Paulina (Beginner)", width / 2, height / 1.5);
  text("Press 2 for Agnes (Expert)", width / 2, height / 1.3);
}

// Handle character selection and start the game
function keyPressed() {
  if (key === '1') {
    characterChoice = 1; // Paulina (beginner)
    player = new Player("Paulina", 10, floorHeight - 50, 5);
    mode = 1; // Switch to collect drinks
  } else if (key === '2') {
    characterChoice = 2; // Agnes (expert)
    player = new Player("Agnes", 10, floorHeight - 50, 10); // faster movement
    mode = 1; // Switch to collect drinks
  }
}

// Collect the drinks stage
function collectDrinks() {
  // Draw the player character
  player.update();
  player.show();

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
    mode = 2; // Switch to dance floor after collecting enough drinks
  }
}

// Dance floor (Rhythm game) stage
function danceFloor() {
  // Placeholder for rhythm-based mechanics
  fill(0);
  textSize(30);
  text("Time to Dance!", width / 2, height / 4);

  // Implement a simple rhythm placeholder:
  // Draw 'beats' that the player needs to hit
  if (frameCount % 60 === 0) {
    let beatX = random(100, width - 100);
    rect(beatX, 100, 30, 30);
  }
}

// Player class to handle movement and energy
class Player {
  constructor(name, x, y, speed) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = 0; // The number of drinks collected
  }

  // Update player's position based on keys
  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
    
    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  }

  // Show the player
  show() {
    fill(200, 0, 0); // Red color for the player
    ellipse(this.x, this.y, 40, 40); // Draw the player as a circle
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