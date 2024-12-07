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
let timer = 30;
let timerInterval;
let getReadyStartTime = 0;
let maxDrinks = 15;
let agnesDifficultyMultiplier = 1.5;
let beatSpeedBase = 5;  
let drinkScore = 0; 
let beatScore = 0;  
let specialDrinkImage, normalDrinkImage;
let lastBeatColumn = -1; 
let enemyImage;
let paulinaImage;
let paulinaWidthFactor = 6; 
let paulinaHeightFactor = 5;
let agnesImage;
let speedMultiplier = 1;
let agnesSpeed = 5; 


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

  update() {
    // circular motion
    this.angle += this.speed * this.direction;  

    //angle
    this.x = this.centerX + this.radius * cos(this.angle); 
    this.y = this.centerY + this.radius * sin(this.angle);

    // enemy screen bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  show() {
    if (enemyImage) {
      imageMode(CENTER);
      image(enemyImage, this.x, this.y, this.w, this.h);
    } else {
      fill(255, 0, 0, 150);
      rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  }

  collide(player) {
    let playerLeft = player.x - 20;
    let playerRight = player.x + 20;
    let playerTop = player.y - 20;
    let playerBottom = player.y + 20;

    return (
      playerRight > this.x - this.w / 2 &&
      playerLeft < this.x + this.w / 2 &&
      playerBottom > this.y - this.h / 2 &&
      playerTop < this.y + this.h / 2
    );
  }
}

class Player {
  constructor(name, x, y, speed) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed; // This will now reflect either Paulina's or Agnes' speed
  }

  update() {
    if (keyIsDown(65)) this.x -= this.speed; // A key
    if (keyIsDown(68)) this.x += this.speed; // D key
    if (keyIsDown(87)) this.y -= this.speed; // W key
    if (keyIsDown(83)) this.y += this.speed; // S key
    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  }

  show() {
    imageMode(CENTER);
    if (this.name === "Paulina" && paulinaImage) {
      let scaledWidth = 50 * paulinaWidthFactor;
      let scaledHeight = 50 * paulinaHeightFactor;
      image(paulinaImage, this.x, this.y, scaledWidth, scaledHeight); // Scale Paulina's image
    } else if (this.name === "Agnes" && agnesImage) {  // Apply this for Agnes
      let scaledWidth = 50 * paulinaWidthFactor;
      let scaledHeight = 50 * paulinaHeightFactor;
      image(agnesImage, this.x, this.y, scaledWidth, scaledHeight); // Scale Agnes' image
    } else {
      fill(200, 0, 0); // Default red circle for other players
      ellipse(this.x, this.y, 40, 40);
    }
  }
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80;
    this.widthFactor = 1.5;
    this.isSpecial = random() < 0.2;  // 20% chance for special drinks
    console.log(this.isSpecial ? 'Special Drink' : 'Normal Drink'); // Debugging line
  }

  show() {
    let drinkWidth = this.size * this.widthFactor;
    let drinkHeight = this.size;

    imageMode(CENTER); 
    if (this.isSpecial) {
      image(specialDrinkImage, this.x, this.y, drinkWidth, drinkHeight);
    } else {
      image(normalDrinkImage, this.x, this.y, drinkWidth, drinkHeight);
    }
  }

  collect(player) {
    let drinkWidth = this.size * this.widthFactor;
    let drinkHeight = this.size;

    // Collision detection
    let halfDrinkWidth = drinkWidth / 2;
    let halfDrinkHeight = drinkHeight / 2;

    if (
      player.x + 20 > this.x - halfDrinkWidth &&
      player.x - 20 < this.x + halfDrinkWidth &&
      player.y + 20 > this.y - halfDrinkHeight &&
      player.y - 20 < this.y + halfDrinkHeight    
    ) {
      return true;
    }

    return false;
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

  let paulinaSpeed = 0.02; // Slower for Paulina
  let agnesSpeed = 0.05;   // Faster for Agnes

  // Creating enemies with adjusted speeds
  boundaries.push(new Boundary(200, 300, 80, 100, paulinaSpeed, 150, width / 2 + 100, height / 2, 1));  // Enemy 1 for Paulina
  boundaries.push(new Boundary(500, 200, 80, 100, paulinaSpeed, 100, width / 4 + 100, height / 4, -1));  // Enemy 2 for Paulina
}

function draw() {
  background(0);

  if (mode === 2) 
    for (let boundary of boundaries) {
    boundary.update();
    boundary.show();
  }

  if (mode === 2 && player) {
    player.update();
    player.show();
  }

  switch (mode) {
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
      getReadyScreen();
      break;
    case 4:
      danceFloor();
      break;
    case 5:
      gameCompleted();
      break;
    case 6:
      gameOver();
      break;
    case 9:  
    gameOverMan();
    break;
  }

}

function displayCollectDrinksUI() {
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Drinks Collected: ${drinksCollected}`, width - 20, 20);  // Fixed this line
  text(`Time Left: ${timer}s`, width - 20, 50);  // Also wrapped this with backticks
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (mode === 0) {
      mode = 1; // Start the game
    } else if (mode === 5 || mode === 6 || mode === 9) { // After Game Over screens
      mode = 1; // Return to the menu
      resetGame(); // Reset game state for a fresh start
    }
  }

  // Menu mode
  else if (mode === 1) {
    if (key === "2") { // Paulina
      player = new Player("Paulina", width - 50, height / 2, 3); // Start at far right
      mode = 2; // Start drink collection for Paulina
      startDrinkChallenge(); // Start drink challenge for Paulina
      resetGame(); // Reset game state before starting
    } else if (key === "3" && agnesUnlocked) { // Agnes
      player = new Player("Agnes", width - 50, height / 2, agnesSpeed); // Set speed for Agnes
      mode = 2; // Start drink collection for Agnes
      startDrinkChallenge();
      resetGame(); // Reset game state before starting
    }
  }

  // Other modes like Dance Floor mode
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
        beats.splice(i, 1); // Remove matched beat
        triggerFeedback("win"); // Correct beat hit
        match = true;
        break;
      }
    }

    if (!match) {
      triggerFeedback("miss");
    }
  }
}

function startScreen() {
  titleArt();

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


function startDrinkChallenge() {
  drinksCollected = 0;
  score = 0; // Reset score to 0

  if (player.name === "Agnes") {
    timer = 45;  // 45 seconds for Agnes
  } else {
    timer = 60;  // 60 seconds for Paulina
  }

  timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(timerInterval);
      checkChallengeOutcome();
    }
  }, 1000);
}


function checkChallengeOutcome() {
  if (drinksCollected >= 3) {
    clearInterval(timerInterval);  
    mode = 3;  
    getReadyStartTime = millis();  // Start the get ready timer
  } else if (timer <= 0) {
    clearInterval(timerInterval);   
    mode = 6;  
  }
  player = null; //removes the player
}


function getReadyScreen() {
  fill(255);
  textSize(40);
  text("Get Ready to Dance!", width / 2, height / 2);
  textSize(20);
  text("Press SPACE to start!", width / 2, height / 2 + 50);

  if (keyIsPressed && keyCode === 32) { // Space key
    resetDanceFloor(); // Reset the beat game before transitioning
    mode = 4; 
  }
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

function collectDrinks() {
  background(0); // Clear the screen and set background color
  backgroundMap(); // Draw the background map

  // Update and show the player
  if (player) {
    player.update();
    player.show();
  }

  // Update and display all boundaries (enemies)
  for (let boundary of boundaries) {
    boundary.update();  // Update enemy's position
    boundary.show();    // Display enemy

    // If player collides with an enemy, trigger Game Over
    if (player && boundary.collide(player)) {
      mode = 9; // Switch to Game Over mode (man collision)
      clearInterval(timerInterval); // Stop the timer
      return; // Stop further execution (no more game actions)
    }
  }

  // Spawn drinks at a steady interval, limiting the number of drinks to 3
  if (drinks.length < 3 && frameCount % 45 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100))); // Random positions for drinks
  }

  // Loop through drinks and check if they are collected by the player
  for (let i = drinks.length - 1; i >= 0; i--) {
    let drink = drinks[i];
    drink.show(); // Show the drink

    // Check if the player collects the drink
    if (player && drink.collect(player)) {
      drinks.splice(i, 1); // Remove the collected drink
      drinksCollected++; // Increment the drinks collected counter

      // Update score based on drink type
      if (drink.isSpecial) {
        console.log('Special drink collected!'); // Debugging line
        drinkScore += 2; // Special drinks give extra points
      } else {
        drinkScore++; // Regular drinks give 1 point
      }

      // If player collects enough drinks, check challenge outcome
      if (drinksCollected >= 5) {
        checkChallengeOutcome(); // Transition to the next phase
      }
    }
  }

  // Display game UI (drinks collected, time left)
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Drinks Collected: ${drinksCollected}`, width - 20, 20); // Display number of drinks collected
  text(`Time Left: ${timer}s`, width - 20, 50); // Display time left in the challenge
}

function danceFloor() {
  drawGameArea();

  // Set the beat interval based on difficulty
  let beatInterval = agnesUnlocked ? 500 : 1000;

  // Check if it's time to add a new beat
  if (millis() - lastBeatTime > beatInterval) {
    beats.push(new Beat(random([width / 4, (width / 4) * 2, (width / 4) * 3]), random(["UP", "DOWN", "LEFT", "RIGHT"])));
    lastBeatTime = millis();
  }

  // Update and display each beat
  for (let i = beats.length - 1; i >= 0; i--) {
    beats[i].update();
    beats[i].show();

    // Remove the beat if it passes the bottom of the screen
    if (beats[i].y > height) {
      beats.splice(i, 1);
      triggerFeedback("miss"); // Miss if the beat goes off-screen
    }
  }

  // Show feedback for correct or incorrect actions
  if (feedbackAlpha > 0) {
    fill(feedbackState === "win" ? "green" : "red");
    textSize(50);
    text(feedbackState === "win" ? "Good!" : "Miss!", width / 2, height / 2);
    feedbackAlpha -= 5;
  }

  // Display the beat game score
  fill(255);
  textSize(20);
  text(`Score: ${beatScore}`, width - 80, 30);
}


// This function will reset all the necessary variables for the dance game.
function resetDanceFloor() {
  beats = [];       // Clear all existing beats
  lastBeatTime = 0; // Reset beat timing
  beatScore = 0;    // Reset beat score to 0
  feedbackAlpha = 0; // Reset feedback animation
  feedbackState = null; // Clear previous feedback
}

function gameOver() {
  fill(255);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 40); // Game Over text
  textSize(20);
  text("Press ENTER to return to the menu", width / 2, height / 2 + 30); // Prompt to return to the menu
  
  if (keyCode === ENTER) {
    resetGame();  // Reset game before transitioning back to the menu
    mode = 1;  // Return to the menu
  }
}


function gameCompleted() {
  fill(255);
  textSize(30);
  text("You Win!", width / 2, height / 2 - 20); // Display "You Win!" message
  
  if (!agnesUnlocked) {
    agnesUnlocked = true;  // Unlock Agnes if not already unlocked
    text("Agnes is now unlocked!", width / 2, height / 2 + 20);  // Show Agnes unlocked message
  }
  
  textSize(20);
  text("Press ENTER to return to the menu.", width / 2, height / 2 + 60);  // Prompt to return to the menu
}


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
  text("GAME OVER", width / 2, height / 2 - 40); // Game Over text
  textSize(20);
  text("Press 'ENTER' to return to the menu", width / 2, height / 2 + 30);
  
  // Here, when the player presses ENTER, reset the game and return to the menu.
  if (keyCode === ENTER) {
    resetGame(); // Reset game before transitioning back to the menu
    mode = 1; // Return to menu
  }
}


function gameOverMan() {
  // Draw the background image stretched to full screen
  if (enemyImage) {
    imageMode(CORNER);
    image(enemyImage, 0, 0, width, height); // Stretch the boundary image
  } else {
    background(50); // Fallback background color if image fails to load
  }

  // Add the Game Over text
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(25);
  text("A man got you, oh no!", width / 2, height / 2);
  textSize(20);
  text("Press ENTER to return to the menu", width / 2, height / 2 + 40);
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
  