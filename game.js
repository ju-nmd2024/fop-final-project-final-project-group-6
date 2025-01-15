let player;
let drinks = [];
let boundaries = []; 
let textSizeAnimation = 15;
let minTextSize = 15;
let maxTextSize = 18;
let sizeSpeedTextSize = 0.03;
let drinkSize = 20;
let beats = [];
let lastBeatTime = 0;
let feedbackState = null;
let feedbackAlpha = 0;
let score = 0;
let agnesUnlocked = false;
let drinksCollected = 0;
let timerInterval;
let getReadyStartTime = 0;
let beatSpeedBase = 5;  
let drinkScore = 0; 
let beatScore = 0;  
let specialDrinkImage;
let normalDrinkImage;
let enemyImage;
let paulinaImage;
let paulinaWidthFactor = 6; 
let paulinaHeightFactor = 5;
let agnesImage;
let speedMultiplier = 1;
let agnesSpeed = 5; 
let gameOverMessage = "GAME OVER";
let drinkWidth = this.size * this.widthFactor;
let drinkHeight = this.size;
let playerRadius = 25;   
let beatInterval = agnesUnlocked ? 500 : 1000;

//enemy
class Boundary {
  constructor(x, y, w, h, speed, radius, centerX, centerY, direction) {
    this.x = x;          
    this.y = y;           
    this.w = w;          
    this.h = h;          
    this.speed = speed; 
    this.radius = radius; 
    this.centerX = centerX; 
    this.centerY = centerY; 
    this.angle = 0;       
    this.direction = direction; 
  }

  // Update method to calculate movement (circular motion or fixed)
  update() {
    this.angle += this.speed * this.direction;  

    this.x = this.centerX + this.radius * cos(this.angle); 
    this.y = this.centerY + this.radius * sin(this.angle);
    
    // Constrain boundary to canvas to prevent going out of bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  // Display the boundary (enemy) using an image if available
  show() {
    if (enemyImage) {
      imageMode(CENTER);
      image(enemyImage, this.x, this.y, this.w, this.h); 
    } else {
      // If the image isn't loaded, draw a simple red rectangle for testing
      fill(255, 0, 0);
      rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  }

  // Check for collision between the player and the boundary
  collide(player) {
    let playerLeft = player.x - 20;
    let playerRight = player.x + 20;
    let playerTop = player.y - 20;
    let playerBottom = player.y + 20;

    // Collision detection using the player's bounding box and the boundary's bounding box
    return (
      playerRight > this.x - this.w / 2 &&
      playerLeft < this.x + this.w / 2 &&
      playerBottom > this.y - this.h / 2 &&
      playerTop < this.y + this.h / 2
    );
  }
}

//agnes and paulina
class Player {
  constructor(name, x, y, speed) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed; 
  }

  update() {
    if (keyIsDown(65)) this.x -= this.speed; // A 
    if (keyIsDown(68)) this.x += this.speed; // D 
    if (keyIsDown(87)) this.y -= this.speed; // W 
    if (keyIsDown(83)) this.y += this.speed; // S 
    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  }

  //paulina and agnes images with scales up
  show() {
    imageMode(CENTER);
    if (this.name === "Paulina" && paulinaImage) {
      let scaledWidth = 50 * paulinaWidthFactor;
      let scaledHeight = 50 * paulinaHeightFactor;
      image(paulinaImage, this.x, this.y, scaledWidth, scaledHeight); 

    } else if (this.name === "Agnes" && agnesImage) {  
      let scaledWidth = 50 * paulinaWidthFactor;
      let scaledHeight = 50 * paulinaHeightFactor;
      image(agnesImage, this.x, this.y, scaledWidth, scaledHeight); 
    } else {
      fill(200, 0, 0); 
      ellipse(this.x, this.y, 40, 40);
    }
  }
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80; // Drink size
    this.widthFactor = 1.5; // Scale factor for width
    this.isSpecial = random() < 0.2; // 20% chance for special drink
  }

  show() {
    imageMode(CENTER);
    let drinkWidth = this.size * this.widthFactor; // Calculate drink width
    let drinkHeight = this.size; // Drink height is the base size

    if (this.isSpecial) {
      // Display special drink
      if (specialDrinkImage) {
        image(specialDrinkImage, this.x, this.y, drinkWidth, drinkHeight);
      }
    } else {
      // Display normal drink
      if (normalDrinkImage) {
        image(normalDrinkImage, this.x, this.y, drinkWidth, drinkHeight);
      }
    }
  }

  collect(player) {
    if (!player) return 0; // Avoid errors if player is undefined

    let distance = dist(this.x, this.y, player.x, player.y);
    let drinkRadius = this.size / 2;

    // Check if the player collects the drink
    if (distance < (drinkRadius + playerRadius)) {
      return this.isSpecial ? 2 : 1; // 2 points for special drink, 1 for normal
    }

    return 0; // No points if not collected
  }
}


class Beat {
  constructor(x, key) {
    this.x = x;
    this.y = 0;
    this.key = key;
    this.arrowSymbols = {
      UP: "↑",
      DOWN: "↓",
      LEFT: "←",
      RIGHT: "→",
    };
    this.symbol = this.arrowSymbols[key];
    this.speed = beatSpeedBase;
  }

  update() {
    this.y += this.speed;  
  }

  //falling beats look
  show() {
    fill(252, 163, 17);
    rect(this.x - 25, this.y - 25, 50, 50);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.symbol, this.x, this.y);
  }
}

function setup() {
  createCanvas(1000, 650);
  textAlign(CENTER, CENTER);
  mode = 0;

  // Initialize player
  player = new Player("Paulina", width / 2, height / 2, 5); // Example: Paulina starts in the middle

  // Initialize drinks
  for (let i = 0; i < 5; i++) {
    drinks.push(new Drink(random(50, width - 50), random(50, height - 50)));
  }

  // Initialize boundaries (enemies)
  boundaries.push(new Boundary(200, 300, 80, 100, 0.02, 150, width / 2 + 100, height / 2, 1));
  boundaries.push(new Boundary(500, 200, 80, 100, 0.02, 100, width / 4 + 100, height / 4, -1));
}


function draw() {
  background(0);

  // show boundaries if mode is 2
  if (mode === 2) {
    for (let boundary of boundaries) {
      boundary.show();
      boundary.update();
    }

  }
  // show player if mode is 2
  if (mode === 2 && player) {
    player.update();
    player.show();
  }
  if (mode === 0) {
    startScreen();
  } else if (mode === 1) {
    menu();
  } else if (mode === 2) {
    collectDrinks();
  } else if (mode === 3) {
    getReadyScreen();
  } else if (mode === 4) {
    danceFloor();
  } else if (mode === 5) {
    gameCompleted();
  } else if (mode === 6) {
    gameOver();
  } else if (mode === 9) {
    gameOverMan();
  }
}

function displayCollectDrinksUI() {
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Drinks Collected: ${drinksCollected}`, width - 20, 20);  
  text(`Time Left: ${timer}s`, width - 20, 50);  
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (mode === 9) { // (caught by the man)
      resetGame(); 
      mode = 1; // menu
    }
    else if (mode === 0) {
      mode = 1; // start game from menu
    } else if (mode === 5) {  // sucessful game compliction
      mode = 1; 
      resetGame(); 
    }
  }
  // selection player
  else if (mode === 1) {
    if (key === "2") { // paulina 
      player = new Player("Paulina", width - 50, height / 2, 3); 
      mode = 2; 
      startDrinkChallenge();
      resetGame(); 
    } else if (key === "3" && agnesUnlocked) { // agnes 
      player = new Player("Agnes", width - 50, height / 2, agnesSpeed);
      mode = 2; 
      startDrinkChallenge();
      resetGame(); 
    }
  }

  //  get ready screen
  else if (mode === 3 && keyCode === 32) { // space 
    mode = 4;
    resetDanceFloor(); 
  }
  // beats game (dancefloor)
  else if (mode === 4) {
    let match = false;
    for (let i = beats.length - 1; i >= 0; i--) {
      if (
        beats[i].y > height - 100 &&
        beats[i].y < height - 50 &&
        ((beats[i].key === "UP" && keyCode === UP_ARROW) ||
          (beats[i].key === "DOWN" && keyCode === DOWN_ARROW) ||
          (beats[i].key === "LEFT" && keyCode === LEFT_ARROW) ||
          (beats[i].key === "RIGHT" && keyCode === RIGHT_ARROW))
      ) {
        beats.splice(i, 1); // remove beat
        triggerFeedback("win"); 
        match = true;
        break;
      }
    }

    if (!match) {
      triggerFeedback("miss");
    }
  }

  // game over (Man Screen)
  else if (mode === 9 && keyCode === ENTER) {
    mode = 1; 
    resetGame(); 
  }
}

//good or miss beats
function triggerFeedback(state) {
  feedbackState = state;
  feedbackAlpha = 255;

  if (state === "miss") {
    beatScore = max(0, beatScore - 1); // score cant go bellow 0
    if (beatScore <= 0) {
      mode = 6; // game over 
      clearInterval(timerInterval); //stops timer
      resetDanceFloor(); 
      gameOverMessage = "Go home, your bad at dancing";
    }
  } else if (state === "win") {
    beatScore++;  // 1 point
    if (beatScore >= 20) {  
      gameCompleted(); 
    }
  }
}

function startScreen() {
  titleArt();

  //agnes animation
  fill(255);
  textSize(textSizeAnimation);
  text("PRESS ENTER TO START", width / 2, 450);
  textSizeAnimation = map(
    sin(frameCount * sizeSpeedTextSize),
    -1.0,
    1.0,
    minTextSize,
    maxTextSize
  );
}
/*
sequence of lines 342 to 348 taken from mo.h, George Profenza, 
& Kevin Workman. (2016, February 2). How to make the size of 
ellipse to get smaller and bigger in processing automatically. 
Stack Overflow. https://stackoverflow.com/questions/35156661/how-to-make-the-size-of-ellipse-to-get-smaller-and-bigger-in-processing-automati 
, reworked by enickles on p5js https://editor.p5js.org/enickles/sketches/SkDt1quAX
 */

function menu() {
  drinkScore = 0;
  beatScore = 0;
  textSize(18);
  fill(255);
  text("Press 2 for Paulina (Beginner)", width / 2, height / 2 - 20);
  if (agnesUnlocked) {
    text("Press 3 for Agnes (Expert)", width / 2, height / 2 + 20);
  } else {
    fill(150);
    text("Agnes (Expert) - Locked", width / 2, height / 2 + 20);
  }
}


function resetGame() {
  // reset variables
  drinks = [];
  beats = [];
  score = 0;
  drinkScore = 0;
  beatScore = 0;
  drinksCollected = 0;
  boundaries = [];

  resetGameUI();
}

function resetGameUI() {
  // reset timer and etc. score
  drinksCollected = 0;
  drinkScore = 0;
  beatScore = 0;
}

function startDrinkChallenge() {

  if (player.name === "Paulina") {
    timer = 60;  
  } else if (player.name === "Agnes") {
    timer = 40;  
  }

  // countdown
  timerInterval = setInterval(() => {
    if (--timer <= 0) {
      clearInterval(timerInterval);
      checkChallengeOutcome();
    }
  }, 1000);  
}

//seeing if you won or failed drinking game
function checkChallengeOutcome() {
  if (drinksCollected >= 5) {
    clearInterval(timerInterval);  
    mode = 3;  
  } else if (timer <= 0) {
    clearInterval(timerInterval);   
    mode = 6;  
  }
  player = null; 
}

function getReadyScreen() {
  fill(255);
  textSize(40);
  text("Get Ready to Dance!", width / 2, height / 2);
  textSize(20);
  text("Press SPACE to start!", width / 2, height / 2 + 50);

  if (keyIsPressed && keyCode === 32) { // space key
    resetDanceFloor(); // reset the beat game before transitioning
    mode = 4; 
  }
}

function collectDrinks() {
  background(0); 
  backgroundMap(); 

  if (player) {
    player.update();
    player.show();
  }

  for (let boundary of boundaries) {
    boundary.update();  
    boundary.show();    

    if (player && boundary.collide(player)) {
      mode = 9; 
      clearInterval(timerInterval); 
      return; 
    }
  }

  // spawn limit
  if (drinks.length < 3 && frameCount % 45 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100))); 
  }
  for (let i = drinks.length - 1; i >= 0; i--) {
    let drink = drinks[i];
    drink.show(); 

    //  if the player collects the drink
    let points = drink.collect(player);
    if (points > 0) {
      drinks.splice(i, 1); // remove 
      drinksCollected++; 
      score += points; 

      if (drinksCollected >= 5) {
        checkChallengeOutcome(); 
      }
    }
  }

  // game display
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Drinks Collected: ${drinksCollected}`, width - 20, 20);
  text(`Time Left: ${timer}s`, width - 20, 50);
}

//beats level
function danceFloor() {
  drawGameArea();
  // add a new beat
  if (millis() - lastBeatTime > beatInterval) {
    beats.push(new Beat(random([width / 4, (width / 4) * 2, (width / 4) * 3]), random(["UP", "DOWN", "LEFT", "RIGHT"])));
    lastBeatTime = millis();
  }
  // update, display each beat
  for (let i = beats.length - 1; i >= 0; i--) {
    beats[i].update();
    beats[i].show();

    // remove beat
    if (beats[i].y > height) {
      beats.splice(i, 1);
      triggerFeedback("miss"); //off screen
    }
  }
  if (feedbackAlpha > 0) {
    fill(feedbackState === "win" ? "green" : "red");
    textSize(50);
    text(feedbackState === "win" ? "Good!" : "Miss!", width / 2, height / 2);
    feedbackAlpha -= 5;
  }

  // display beat score
  fill(255);
  textSize(20);
  text(`Score: ${beatScore}`, width - 80, 30);
}

function resetDanceFloor() {
  beats = [];       
  lastBeatTime = 0;  
  beatScore = 0;    
  feedbackAlpha = 0; 
  feedbackState = null; 
}

function gameOver() {
  fill(255);
  textSize(40);
  text(gameOverMessage, width / 2, height / 2 - 40); 
  textSize(20);
  text("Press ENTER to return to the menu", width / 2, height / 2 + 30); 
  
  // reset the game and return to the menu.
  if (keyCode === ENTER) {
    resetGame(); 
    mode = 1; 
  }
}
function gameCompleted() {
  fill(255);
  textSize(30);
  text("You Win!", width / 2, height / 2 - 20); 

  // unlock Agnes if not already unlocked
  if (!agnesUnlocked) {
    agnesUnlocked = true;  
    text("Agnes is now unlocked!", width / 2, height / 2 + 20);  
  }

  textSize(20);
  text("Press ENTER to return to the menu.", width / 2, height / 2 + 60);  
  if (keyIsPressed && keyCode === ENTER) {
    mode = 1; 
    resetGame(); 
  }
  mode = 5; 
}

//game bounderis 
function drawGameArea() {
  fill(50);
  rect(0, 0, width, height);
  stroke(255);
  for (let i = 0; i < 5; i++) {
    line((width / 4) * i, 0, (width / 4) * i, height);
  }
  fill(200, 200, 200, 100);
  rect(0, height - 100, width, 50);
}

function gameOver() {
  fill(255);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 40); 
  textSize(20);
  text("Press 'ENTER' to return to the menu", width / 2, height / 2 + 30);
  
  if (keyCode === ENTER) {
    resetGame(); 
    mode = 1;
  }
}

function gameOverMan() {
  if (enemyImage) {
    imageMode(CORNER);
    image(enemyImage, 0, 0, width, height); // stretch 
  } else {
    background(50); // if image fails to load
  }
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(25);
  text("A man got you, oh no!", width / 2, height / 2);
  textSize(20);
  text("Press ENTER to return to the menu", width / 2, height / 2 + 40);
}

function backgroundMap(){
  push();
  background (0);

  noStroke();

  //floor
  fill(60);
  rect(60, 60, 900, 550);
  
  fill(73, 80, 87);
  rect(150, 100, 5, 10);
  rect(250, 150, 5, 10);
  rect(110, 230, 5, 10);
  rect(310, 290, 5, 10);
  rect(210, 500, 5, 10);
  rect(610, 200, 5, 10);
  rect(710, 130, 5, 10);
  rect(540, 330, 5, 10);
  rect(800, 430, 5, 10);
  rect(890, 530, 5, 10);
  
  //bar disk
  fill(100);
  rect(50, 120, 50, 320);
  
  fill(25, 140);
  rect(150, 120, 50, 320);
  
  //drinks on the bar
  fill(35);
  rect(80, 140, 10, 5);
  rect(75, 145, 20, 10);
  rect(80, 155, 10, 5);
  
  fill(25);
  rect(75, 170, 15, 5);
  rect(70, 175, 25, 10);
  rect(75, 185, 15, 5);
  
  fill(71);
  rect(80, 390, 10, 5);
  rect(75, 395, 20, 10);
  rect(80, 405, 10, 5);
  
  //stadning close to bar
  fill(100, 110);
  rect(290, 120, 200, 50);
  fill(100);
  rect(240, 60, 300, 70);
  
  //standing close to exit
  fill(100);
  rect(870, 60, 80, 250);
  
  fill(100, 110);
  rect(830, 140, 40, 100);
  
  //pillar
  fill(0);
  rect(300, 335, 70, 70);
  
  //table
  fill(100);
  rect(250, 550, 420, 50);
  
  //chairs
  rect(300, 500, 20, 10);
  rect(290, 510, 40, 20);
  rect(300, 530, 20, 10);
  rect(320, 505, 5, 5);
  rect(295, 505, 5, 5);
  rect(295, 530, 5, 5);
  rect(320, 530, 5, 5);
  
  rect(400, 500, 20, 10);
  rect(390, 510, 40, 20);
  rect(400, 530, 20, 10);
  rect(420, 505, 5, 5);
  rect(395, 505, 5, 5);
  rect(395, 530, 5, 5);
  rect(420, 530, 5, 5);
  
  
  rect(500, 500, 20, 10);
  rect(490, 510, 40, 20);
  rect(500, 530, 20, 10);
  rect(520, 505, 5, 5);
  rect(495, 505, 5, 5);
  rect(495, 530, 5, 5);
  rect(520, 530, 5, 5);
  
  rect(600, 500, 20, 10);
  rect(590, 510, 40, 20);
  rect(600, 530, 20, 10);
  rect(620, 505, 5, 5);
  rect(595, 505, 5, 5);
  rect(595, 530, 5, 5);
  rect(620, 530, 5, 5);
  
  
  //bar spegel
  fill(0);
  rect(60, 130, 10, 300);
  
  //doors
  rect(600, 60, 10, 5);
  rect(800, 60, 10, 5);
  
  rect(945, 310, 5, 5);
  rect(945, 410, 5, 5);
  
  rect(945, 430, 5, 5);
  rect(945, 500, 5, 5);
  
  //outline club
  fill(0);
  rect(50, 50, 10, 550);
  rect(950, 50, 10, 550);
  rect(50, 600, 910, 10);
  rect(50, 50, 910, 10);
  
  fill(144, 103, 198, 50);
  rect(0,0,1000, 650);
  
  fill(144, 103, 198);
  rect(50, 30, 10, 90);
  rect(45, 35, 5, 90);
  rect(40, 45, 5, 80);
  rect(35, 55, 5, 70);
  rect(5, 65, 100, 10);
  rect(0, 70, 100, 5);
  rect(5, 75, 100, 5);
  rect(10, 80, 90, 5);
  rect(15, 85, 80, 5);
  rect(20, 90, 70, 5);
  rect(25, 95, 60, 10);
  rect(20, 105, 70, 10);
  rect(15, 115, 80, 10);
  rect(10, 125, 20, 10);
  rect(10, 135, 15, 5);
  rect(25, 130, 10, 5);
  rect(35, 125, 10, 5);
  rect(45, 120, 20, 5);
  rect(65, 125, 30, 5);
  rect(75, 130, 20, 5);
  rect(85, 135, 15, 5);
  rect(95, 125, 5, 10);
  rect(90, 115, 5, 10);
  rect(85, 105, 5, 10);
  rect(80, 95, 5, 10);
  rect(85, 90, 5, 5);
  rect(90, 85, 5, 5);
  rect(95, 80, 5, 5);
  rect(100, 75, 5, 5);
  rect(105, 70, 5, 5);
  rect(60, 35, 5, 30);
  rect(65, 45, 5, 20);
  rect(70, 55, 5, 10);
  rect(75, 65, 30, 5);
  rect(30, 125, 5, 5);
  
  translate(880, 460);
  fill(144, 103, 198);
  rect(50, 30, 10, 90);
  rect(45, 35, 5, 90);
  rect(40, 45, 5, 80);
  rect(35, 55, 5, 70);
  rect(5, 65, 100, 10);
  rect(0, 70, 100, 5);
  rect(5, 75, 100, 5);
  rect(10, 80, 90, 5);
  rect(15, 85, 80, 5);
  rect(20, 90, 70, 5);
  rect(25, 95, 60, 10);
  rect(20, 105, 70, 10);
  rect(15, 115, 80, 10);
  rect(10, 125, 20, 10);
  rect(10, 135, 15, 5);
  rect(25, 130, 10, 5);
  rect(35, 125, 10, 5);
  rect(45, 120, 20, 5);
  rect(65, 125, 30, 5);
  rect(75, 130, 20, 5);
  rect(85, 135, 15, 5);
  rect(95, 125, 5, 10);
  rect(90, 115, 5, 10);
  rect(85, 105, 5, 10);
  rect(80, 95, 5, 10);
  rect(85, 90, 5, 5);
  rect(90, 85, 5, 5);
  rect(95, 80, 5, 5);
  rect(100, 75, 5, 5);
  rect(105, 70, 5, 5);
  rect(60, 35, 5, 30);
  rect(65, 45, 5, 20);
  rect(70, 55, 5, 10);
  rect(75, 65, 30, 5);
  rect(30, 125, 5, 5);
  pop();
}
function titleArt(){
  noStroke();
  //
  
  fill(123, 44, 191);
  rect(100, 100, 10, 50); 
  rect(110, 150, 20, 10);
  rect(105, 150, 5, 5);
  rect(110, 145, 5, 5);
  
  rect(160, 110, 20, 10);
  rect(150, 120, 10, 40); 
  rect(180, 120, 10, 40); 
  rect(160, 130, 20, 10);
  rect(155, 115, 5, 5);
  rect(180, 115, 5, 5);
  
  rect(220, 110, 20, 10);
  rect(210, 120, 10, 10);
  rect(220, 130, 20, 10);
  rect(240, 140, 10, 10);
  rect(210, 150, 30, 10);
  rect(215, 115, 5, 5);
  rect(215, 130, 5, 5);
  rect(220, 120, 5, 5);
  rect(240, 135, 5, 5);
  rect(235, 145, 5, 5);
  rect(240, 150, 5, 5);
  
  rect(270, 110, 10, 50); 
  rect(260, 110, 30, 10);
  
  //
  
  rect(360, 110, 10, 50);
  rect(370, 120, 10, 10);
  rect(380, 130, 10, 10);
  rect(390, 110, 10, 50);
  rect(375, 130, 5, 5);
  rect(385, 140, 5, 5);
  rect(370, 115, 5, 5);
  rect(380, 125, 5, 5);
  
  rect(420, 110, 10, 50);
  
  rect(450, 120, 10, 30);
  rect(460, 110, 20, 10);
  rect(460, 150, 20, 10);
  rect(480, 130, 10, 20);
  rect(470, 130, 10, 10);
  rect(455, 115, 5, 5);
  rect(460, 120, 5, 5);
  rect(460, 145, 5, 5);
  rect(455, 150, 5, 5);
  rect(480, 150, 5, 5);
  
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
  rect(675, 150, 5, 5);
  rect(700, 145, 5, 5);
  rect(685, 145, 5, 5);
  rect(710, 150, 5, 5);
  
  rect(750, 110, 20, 10);
  rect(740, 120, 10, 40); 
  rect(770, 120, 10, 40); 
  rect(750, 130, 20, 10);
  rect(745, 115, 5, 5);
  rect(770, 115, 5, 5);
  
  rect(810, 110, 20, 10);
  rect(800, 120, 10, 10);
  rect(810, 130, 20, 10);
  rect(830, 140, 10, 10);
  rect(800, 150, 30, 10);
  rect(805, 115, 5, 5);
  rect(805, 130, 5, 5);
  rect(810, 120, 5, 5);
  rect(830, 135, 5, 5);
  rect(825, 145, 5, 5);
  rect(830, 150, 5, 5);
  
  //
  
  rect(910, 110, 20, 10);
  rect(900, 120, 10, 40); 
  rect(930, 120, 10, 40); 
  rect(910, 130, 20, 10);
  rect(905, 115, 5, 5);
  rect(930, 115, 5, 5);
  
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
  rect(275, 235, 5, 5);
  rect(300, 235, 5, 5);
  rect(310, 255, 5, 5);
  rect(320, 265, 5, 5);
  rect(355, 245, 5, 5);
  rect(345, 265, 5, 5);
  rect(375, 235, 5, 5);
  rect(385, 225, 5, 5);
  rect(410, 225, 5, 5);
  rect(410, 300, 5, 5);
  rect(390, 340, 10, 5);
  rect(375, 310, 5, 5);
  rect(365, 280, 5, 5);
  rect(350, 290, 5, 5);
  rect(340, 310, 5, 5);
  rect(325, 310, 5, 5);
  rect(315, 300, 5, 5);
  rect(300, 310, 5, 5);
  rect(290, 350, 5, 5);
  rect(265, 340, 5, 5);
  rect(265, 285, 5, 5);
  
  rect(460, 250, 10, 40);
  rect(470, 240, 20, 70);
  rect(490, 230, 20, 90);
  rect(510, 240, 20, 70);
  rect(530, 250, 10, 40);
  rect(480, 235, 10, 5);
  rect(510, 235, 10, 5);
  rect(480, 310, 10, 5);
  rect(510, 310, 10, 5);
  rect(465, 245, 5, 5);
  rect(530, 245, 5, 5);
  rect(465, 290, 5, 5);
  rect(530, 290, 5, 5);
  
  rect(570, 230, 10, 40);
  rect(580, 220, 10, 70);
  rect(590, 240, 10, 70);
  rect(600, 260, 20, 70);
  rect(620, 250, 10, 70);
  rect(630, 240, 10, 60);
  rect(640, 220, 10, 60);
  rect(650, 210, 10, 40);
  rect(575, 225, 5, 5);
  rect(575, 270, 5, 5);
  rect(585, 290, 5, 5);
  rect(590, 235, 5, 5);
  rect(595, 310, 5, 10);
  rect(610, 330, 5, 15);
  rect(620, 320, 5, 5);
  rect(630, 300, 5, 5);
  rect(640, 280, 5, 5);
  rect(650, 250, 5, 5);
  rect(645, 215, 5, 5);
  rect(635, 235, 5, 5);
  rect(615, 255, 5, 5);
  rect(600, 255, 5, 5);
  
  rect(690, 240, 10, 50);
  rect(700, 230, 20, 80);
  rect(720, 260, 10, 40);
  rect(695, 235, 5, 5);
  rect(720, 255, 5, 5);
  rect(720, 300, 5, 5);
  rect(695, 290, 5, 10);
  
  rect(770, 240, 10, 70);
  rect(780, 230, 10, 100);
  rect(790, 220, 10, 30);
  rect(800, 220, 20, 20);
  rect(820, 230, 10, 10);
  rect(790, 310, 20, 30);
  rect(810, 320, 10, 20);
  rect(790, 270, 30, 20);
  rect(820, 320, 10, 10);
  rect(785, 225, 5, 5);
  rect(775, 235, 5, 5);
  rect(775, 310, 5, 10);
  rect(785, 330, 5, 15);
  rect(820, 330, 5, 5);
  rect(810, 315, 5, 5);
  rect(790, 305, 5, 5);
  rect(820, 275, 5, 10);
  rect(790, 265, 5, 5);
  rect(790, 260, 5, 5);
  rect(800, 240, 10, 5);
  rect(820, 225, 5, 5);
  }

  function preload() {
    specialDrinkImage = loadImage("special.png");
    normalDrinkImage = loadImage("drink.png");
    enemyImage = loadImage("man_enemy.png"); 
    paulinaImage = loadImage("paulina.png");
    agnesImage = loadImage("agnes.png");
  }
  
/*  references
https://chatgpt.com/share/67596d8a-79f0-8009-8959-93677412e7dd
Issues with drawing the correct artworks in the correct places
https://www.youtube.com/watch?v=S1jMxo4QI44
guitar hero mechanic ideas
https://p5js.org/reference/p5/alpha/
aplha explained
https://www.youtube.com/watch?v=_MyPLZSGS3s
collision detection
*/