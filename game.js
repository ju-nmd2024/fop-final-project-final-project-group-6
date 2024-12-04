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
      gameOver();  // Game over state
      break;
  }

  if (mode === 2 && player) {
    displayCollectDrinksUI();
  }

  // Ensure `player` is initialized before trying to update or show
  if (player) {
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
      player = new Player("Paulina", 10, height - 50, 5);
      mode = 2;
      startDrinkChallenge();
    } else if (key === "3" && agnesUnlocked) {
      player = new Player("Agnes", 10, height - 50, 8);
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
  fill(255);
  textSize(textSizeAnimation);
  text("PRESS ENTER TO START", width / 2, height / 2);
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
    // Player successfully collected 30 drinks, move to next stage
    clearInterval(timerInterval);
    mode = 3; // Transition to "Get Ready to Dance!" screen
    getReadyStartTime = millis();
  } else if (timer <= 0) {
    // Time ran out, s
    clearInterval(timerInterval);
    mode = 6;  // Transition to "Game Over" screen
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