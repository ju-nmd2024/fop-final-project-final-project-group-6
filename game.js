let mode;
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
const maxDrinks = 15;
const agnesDifficultyMultiplier = 1.5;
const agnesBeatInterval = 600;
const defaultBeatInterval = 1000;

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
    return dist(this.x, this.y, drink.x, drink.y) < 25;
  }
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = player.name === "Agnes" ? 15 : 20; // Smaller drinks for Agnes
    this.isSpecial = random() < 0.1;  // 10% chance for a special drink
  }

  show() {
    if (this.isSpecial) {
      fill(255, 0, 255); // Special drink color (purple)
    } else {
      fill(252, 163, 17); // Regular drink color (orange)
    }
    rect(this.x, this.y, this.size, this.size);
  }

  // Return true if the player clicks on the special drink
  clicked(mouseX, mouseY) {
    return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
  }
}

class Beat {
  constructor(x, key) {
    this.x = x;
    this.y = 0;
    this.key = key;
    this.speed = player.name === "Agnes" ? 5 * agnesDifficultyMultiplier : 5; // Faster beats for Agnes

    this.arrowSymbols = {
      UP: "↑",
      DOWN: "↓",
      LEFT: "←",
      RIGHT: "→",
    };

    this.symbol = this.arrowSymbols[key];
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
  }

  if (mode === 2) {
    displayCollectDrinksUI();
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
    if (mode === 0) {
      mode = 1;
    } else if (mode === 5) {
      mode = 1;
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
  } else if (mode === 3 && keyCode === 32) {
    mode = 4; 
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
  timer = player.name === "Agnes" ? 20 : 30;

  timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(timerInterval);
      checkChallengeOutcome();
    }
  }, 1000);
}

function checkChallengeOutcome() {
  if (drinksCollected >= 10) {
    clearInterval(timerInterval);
    mode = 3; // Transition to "Get Ready to Dance!" screen
    getReadyStartTime = millis();
  } else if (timer <= 0) {
    clearInterval(timerInterval);
    mode = 5;
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
  background(0);
  player.update();
  player.show();

  for (let boundary of boundaries) boundary.show();

  if (drinks.length < maxDrinks && frameCount % 60 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100)));
  }

  for (let i = drinks.length - 1; i >= 0; i--) {
    let drink = drinks[i];
    drink.show();

    if (player.collect(drink)) {
      drinks.splice(i, 1);
      drinksCollected++;
      if (drinksCollected >= 10) {
        checkChallengeOutcome();
      }
    }

    // If the player clicks on a special drink, collect it
    if (drink.isSpecial && mouseIsPressed && drink.clicked(mouseX, mouseY)) {
      drinks.splice(i, 1);
      drinksCollected++;
      if (drinksCollected >= 10) {
        checkChallengeOutcome();
      }
    }
  }
}

function danceFloor() {
  drawGameArea();

  const beatInterval = player.name === "Agnes" ? agnesBeatInterval : defaultBeatInterval;

  if (millis() - lastBeatTime > beatInterval) {
    beats.push(
      new Beat(
        random([width / 4, (width / 4) * 2, (width / 4) * 3]),
        random(["UP", "DOWN", "LEFT", "RIGHT"])
      )
    );

    if (player.name === "Agnes" && random() > 0.5) {
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

  const winScore = player.name === "Agnes" ? 20 : 10;
  if (score >= winScore) {
    mode = 5;
    agnesUnlocked = true;
  }
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
