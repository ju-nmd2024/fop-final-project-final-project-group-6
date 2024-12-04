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
let beatSpeedBase = 5;  // Base speed for beats

class Boundary {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;  // Speed of movement
    this.initialX = x;  // Store the initial position
  }

  update() {
    // Horizontal movement using a sine wave (back and forth)
    this.x = this.initialX + Math.sin(frameCount * this.speed) * 200; // Moves 200 pixels back and forth
  }

  show() {
    fill(255, 0, 0, 150);  // Red color with some transparency
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  collide(player) {
    let playerLeft = player.x - 20;
    let playerRight = player.x + 20;
    let playerTop = player.y - 20;
    let playerBottom = player.y + 20;

    // Collision detection (if player overlaps with boundary)
    return (
      playerRight > this.x &&
      playerLeft < this.x + this.w &&
      playerBottom > this.y &&
      playerTop < this.y + this.h
    );
  }
}
class Player {
  constructor(name, x, y, speed) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = 0;
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
    fill(200, 0, 0);
    ellipse(this.x, this.y, 40, 40);
  }

  collect(drink) {
    return dist(this.x, this.y, drink.x, drink.y) < 25;  // Check if within 25 pixels
  }
  
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20; // Default size of the drink
    this.isSpecial = random() < 0.1;  // 10% chance for a special drink
  }

  show() {
    if (this.isSpecial) {
      fill(255, 0, 255); // Purple for special drinks
    } else {
      fill(252, 163, 17); // Orange for regular drinks
    }
    rect(this.x, this.y, this.size, this.size); // Draw the drink
  }

  collect(player) {
    return dist(player.x, player.y, this.x, this.y) < 25;  // Check if the player is close enough to collect it
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
    this.y += this.speed;  // Apply speed to beat
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
  boundaries.push(new Boundary(100, 150, 50, 30));
  boundaries.push(new Boundary(200, 350, 50, 30));
}

function draw() {
  background(0);

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
  }

  // Only update and show the player in mode 2
  if (mode === 2 && player) {
    player.update();
    player.show();
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
      mode = 1;
    } else if (mode === 5 || mode === 6) {  // Game completed or Game Over
      mode = 1;  // Return to menu
    }
  } else if (mode === 1) {
    if (key === "2") {
      player = new Player("Paulina", 10, height - 50, 4);
      mode = 2;
      startDrinkChallenge();
    } else if (key === "3" && agnesUnlocked) {
      player = new Player("Agnes", 10, height - 50, 7);
      mode = 2;
      startDrinkChallenge();
    }
  } else if (mode === 3 && keyCode === 32) {  // Space key
    mode = 4;  // Transition to dance floor stage
  } else if (mode === 4) {
    let matched = false;
    for (let i = beats.length - 1; i >= 0; i--) {
      if (
        beats[i].y > height - 100 &&
        beats[i].y < height - 50 &&
        ((beats[i].key === "UP" && keyCode === UP_ARROW) ||
          (beats[i].key === "DOWN" && keyCode === DOWN_ARROW) ||
          (beats[i].key === "LEFT" && keyCode === LEFT_ARROW) ||
          (beats[i].key === "RIGHT" && keyCode === RIGHT_ARROW))
      ) {
        beats.splice(i, 1);
        triggerFeedback("win");
        matched = true;
        score++;
        break;
      }
    }
    if (!matched) {
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

  // Set the timer based on the player (Agnes vs. Paulina)
  if (player.name === "Agnes") {
    timer = 45;  // 45 seconds for Agnes to collect 30 drinks
  } else {
    timer = 60;  // 60 seconds for Paulina to collect 30 drinks
  }

  // Set interval for timer
  timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(timerInterval);
      checkChallengeOutcome();
    }
  }, 1000);
}

function checkChallengeOutcome() {
  if (drinksCollected >= 30) {
    clearInterval(timerInterval);  // Stop the timer
    player = null;  // Remove the player when transitioning
    mode = 3;  // Transition to the Get Ready Screen
    getReadyStartTime = millis();  // Start the get ready timer
  } else if (timer <= 0) {
    clearInterval(timerInterval);  // Stop the timer
    player = null;  // Remove the player when transitioning
    mode = 6;  // Transition to Game Over screen
  }
}


function getReadyScreen() {
  fill(255);
  textSize(40);
  text("Get Ready to Dance!", width / 2, height / 2);
  textSize(20);
  text("Press SPACE to start!", width / 2, height / 2 + 50);
}

function collectDrinks() {
  background(0);  // Background reset

  player.update();  // Update player position
  player.show();    // Show player character

  // Loop through boundaries and check collisions with the player
  for (let boundary of boundaries) {
    boundary.update();  // Update boundary position
    boundary.show();    // Display the boundary

    if (boundary.collide(player)) {
      mode = 6;  // Game Over if player collides with boundary
      clearInterval(timerInterval);  // Stop timer
      break;  // Stop checking other boundaries
    }
  }

  // Only spawn new drinks if there are less than 3 drinks on the screen (increased spawn rate for Agnes)
  if (drinks.length < 3 && frameCount % 45 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100)));
  }

  // Loop through the drinks and check if the player collects any
  for (let i = drinks.length - 1; i >= 0; i--) {
    let drink = drinks[i];
    drink.show();  // Display the drink

    if (player.collect(drink)) {
      drinks.splice(i, 1);  // Remove the drink from the array when collected
      drinksCollected++;

      if (drink.isSpecial) {
        score += 3;  // Special (purple) drink gives 3 points for Agnes
      } else {
        score++;  // Regular drink gives 1 point
      }

      if (drinksCollected >= 30) {
        checkChallengeOutcome();
      }
    }
  }

  // Display UI elements (score, time left, etc.)
  displayCollectDrinksUI();
}

function danceFloor() {
  drawGameArea();

  let beatInterval = agnesUnlocked ? 500 : 1000; // faster beats if Agnes is unlocked
  fill(feedbackState === "win" ? "green" : "red");

  if (millis() - lastBeatTime > beatInterval) {
    beats.push(
      new Beat(
        random([width / 4, (width / 4) * 2, (width / 4) * 3]),
        random(["UP", "DOWN", "LEFT", "RIGHT"])
      )
    );

    if (agnesUnlocked && random() > 0.5) {
      beats.push(new Beat(random([width / 4, (width / 4) * 2, (width / 4) * 3]), random(["UP", "DOWN", "LEFT", "RIGHT"])));
    }

    lastBeatTime = millis();
  }

  for (let i = beats.length - 1; i >= 0; i--) {
    beats[i].update();
    beats[i].show();
    if (beats[i].y > height) {
      beats.splice(i, 1);
    }
  }

  if (feedbackAlpha > 0) {
    fill(feedbackState === "win" ? "green" : "red");
    textSize(50);
    text(feedbackState === "win" ? "Good!" : "Miss!", width / 2, height / 2);
    feedbackAlpha -= 5;
  }

  fill(255);
  textSize(20);
  text(`Score: ${score}`, width - 80, 30);
}

function triggerFeedback(state) {
  feedbackState = state;
  feedbackAlpha = 255;
  if (state === "miss") {
    score = max(0, score - (player.name === "Agnes" ? 2 : 1));
  }
  if (state === "win") {
    score++;
  }
}

function gameCompleted() {
  fill(255);
  textSize(30);
  text("You Win!", width / 2, height / 2 - 20);
  if (!agnesUnlocked) {
    text("Agnes is now unlocked!", width / 2, height / 2 + 20);
  }
  textSize(20);
  text("Press ENTER to return to the menu.", width / 2, height / 2 + 60);
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
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(20);
  text("Press ENTER to return to the menu", width / 2, height / 2 + 20);
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

function drink(){
  translate(this.x, this.y, this.size, this.size);
  noStroke();
  // color for the glass
  fill(151, 157, 172);
  rect(180, 120, 170, 100);
  rect(200, 110, 120, 10);
  rect(190, 220, 140, 140);

  fill(125, 133, 151);
  rect(190, 270, 140, 90);
  rect(210, 360, 100, 10);

  //drink color
  fill(201, 24, 74);
  rect(210, 310, 100, 40);
  rect(200, 220, 120, 90);

  fill(255, 117, 143);
  rect(200, 220, 120, 90);
  rect(260, 310, 40, 10);

  fill(255, 179, 193);
  rect(190, 160, 140, 60);
  rect(210, 220, 50, 10);
  rect(290, 220, 10, 10);
  rect(205, 150, 40, 10);
  rect(310, 150, 20, 10);

  fill(201, 24, 74);
  rect(220, 300, 20, 10);
  rect(300, 290, 10, 10);

  //outline
  fill(0, 18, 31);
  rect(200, 100, 120, 10);
  rect(180, 110, 20, 10);
  rect(320, 110, 20, 10);
  rect(170, 120, 10, 100);
  rect(340, 120, 10, 100);
  rect(180, 220, 10, 90);
  rect(330, 220, 10, 90);
  rect(190, 310, 10, 50);
  rect(320, 310, 10, 50);
  rect(200, 360, 10, 10);
  rect(310, 360, 10, 10);
  rect(210, 370, 100, 10);

  rect(280, 140, 30, 10);
  rect(210, 140, 10, 10);

  //bubble
  fill(255, 240, 243);
  rect(290, 110, 10, 10);
  rect(280, 100, 10, 10);
  rect(300, 100, 10, 10);
  rect(290, 90, 10, 10);
  rect(270, 60, 10, 10);

  fill(255, 204, 213);
  rect(220, 120, 10, 10);

  //glass
  fill(255, 240, 243, 210);
  rect(210, 160, 40, 60);
  rect(260, 220, 30, 70);
}
