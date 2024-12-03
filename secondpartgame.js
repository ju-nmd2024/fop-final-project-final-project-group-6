/*let beats = [];
let beatSpeed = 5;
let score = 0;
let feedbackColor = null;
let feedbackAlpha = 0;

function danceFloor() {
  background(30);
  drawGameArea();
  drawDancingCharacter();

  if (frameCount % 60 === 0) {
    beats.push(new Beat(random([width / 4, width / 4 * 2, width / 4 * 3, width]), random(['UP', 'DOWN', 'LEFT', 'RIGHT'])));
  }

  for (let i = beats.length - 1; i >= 0; i--) {
    beats[i].update();
    beats[i].show();

    if (beats[i].y > height) {
      beats.splice(i, 1);
      triggerFeedback('lose');
      score = max(0, score - 1);
    }
  }

  displayScore();

  if (feedbackColor) {
    fill(feedbackColor === 'win' ? 'green' : 'red');
    rect(0, 0, width, height);
    feedbackAlpha -= 5;
    if (feedbackAlpha <= 0) feedbackColor = null;
  }
}

function keyPressed() {
  let correctKey = false;

  for (let i = beats.length - 1; i >= 0; i--) {
    if (
      beats[i].y > height - 100 &&
      beats[i].y < height - 50 &&
      ((beats[i].key === 'UP' && keyCode === UP_ARROW) ||
        (beats[i].key === 'DOWN' && keyCode === DOWN_ARROW) ||
        (beats[i].key === 'LEFT' && keyCode === LEFT_ARROW) ||
        (beats[i].key === 'RIGHT' && keyCode === RIGHT_ARROW))
    ) {
      score++;
      beats.splice(i, 1);
      correctKey = true;
      break;
    }
  }

  if (correctKey) {
    triggerFeedback('win');
  } else {
    triggerFeedback('lose');
    score = max(0, score - 1);
  }
}

function drawGameArea() {
  fill(50);
  rect(0, 0, width / 2, height);

  stroke(255);
  for (let i = 0; i < 4; i++) {
    line((width / 4) * i, 0, (width / 4) * i, height);
  }

  fill(200, 200, 200, 100);
  rect(0, height - 100, width / 2, 50);
}

function drawDancingCharacter() {
  push();
  translate(750, 300);
  if (feedbackColor === 'win') {
    rotate(sin(frameCount * 0.1) * PI / 6);
  } else if (feedbackColor === 'lose') {
    rotate(sin(frameCount * 0.2) * PI / 20);
  }
  fill(255, 200, 0);
  ellipse(0, -50, 50, 50);
  rect(-20, -30, 40, 80);
  pop();
}

function triggerFeedback(state) {
  if (state === 'win') {
    feedbackColor = 'win';
  } else {
    feedbackColor = 'lose';
  }
  feedbackAlpha = 100;
}

function displayScore() {
  fill(255);
  textSize(20);
  text(`Score: ${score}`, width / 4, 50);
}

class Beat {
  constructor(x, key) {
    this.x = x;
    this.y = 0;
    this.key = key;
  }

  update() {
    this.y += beatSpeed;
  }

  show() {
    fill(252, 163, 17);
    rect(this.x - 25, this.y - 25, 50, 50);

    fill(255);
    textSize(20);
    if (this.key === 'UP') {
      text('↑', this.x, this.y);
    } else if (this.key === 'DOWN') {
      text('↓', this.x, this.y);
    } else if (this.key === 'LEFT') {
      text('←', this.x, this.y);
    } else if (this.key === 'RIGHT') {
      text('→', this.x, this.y);
    }
  }
}
*/

// variables
/*let mode;
let player;
let drinks = [];
let boundaries = [];
let textSizeAnimation = 15;
let minTextSize = 15;
let maxTextSize = 18;
let sizeSpeedTextSize = 0.03;
let drinkSize = 20;
let agnesUnlocked = false;
let fft;
let beats = [];
let beatThreshold = 0.25;
let lastBeatTime = 0;
let beatInterval = 600;
let feedbackState = null;
let feedbackAlpha = 0;
let danceMove = null;
let score = 0;
let song;
let songPlaying = false;

function setup() {
  createCanvas(1000, 650);
  textAlign(CENTER, CENTER);
  fft = new p5.FFT();
  mode = 0;

  boundaries.push(new Boundary(100, 150, 50, 30));
  boundaries.push(new Boundary(200, 350, 50, 30));
}

function draw() {
  console.log("Current Mode:", mode); // Debugging
  background(0);

  if (mode === 3 && !songPlaying) {
    song.loop();
    song.setVolume(0.5);
    songPlaying = true;
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
      danceFloor();
      break;
    case 4:
      gameCompleted();
      break;
  }

  if (mode === 3 && score >= 10) {
    textSize(30);
    fill(255);
    text("You Win!", width / 2, height / 2);
    noLoop();
    song.stop();
  }
}


function startScreen() {
  titleArt();

  fill(255);
  textSize(textSizeAnimation);
  text("PRESS ENTER TO START", width / 2, height / 2);
  textSizeAnimation = map(sin(frameCount * sizeSpeedTextSize), -1.0, 1.0, minTextSize, maxTextSize);
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
  text("Press 2 for Paulina (Beginner)", width / 2, height / 2 - 20);
  if (agnesUnlocked) {
    text("Press 3 for Agnes (Expert)", width / 2, height / 2 + 20);
  } else {
    fill(150);
    text("Agnes (Expert) - Locked", width / 2, height / 2 + 20);
  }
}

function collectDrinks() {
  player.update();
  player.show();

  for (let boundary of boundaries) {
    boundary.show();
  }

  if (frameCount % 60 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100)));
  }

  for (let i = drinks.length - 1; i >= 0; i--) {
    let drink = drinks[i];
    drink.show();
    if (player.collect(drink)) {
      drinks.splice(i, 1);
    }
  }

  displayDrinkCount();

  if (player.energy >= 3) {
    mode = 3; // Transition to Dance Floor
    beats = [];
    score = 0;
    feedbackAlpha = 0;

    if (!song.isPlaying()) {
      song.loop();
      song.setVolume(0.5);
    }
  }
}

/*function displayDrinkCount() {
  fill(255);
  textSize(18);
  text("Drinks Collected: " + player.energy, width / 2, 50);
}*/

// Player class

/*function gameCompleted() {
  background(50);
  fill(255);
  textSize(30);
  text("Congratulations!", width / 2, height / 2 - 20);
  text("Agnes is now unlocked!", width / 2, height / 2 + 20);
  textSize(20);
  text("Press ENTER to return to the menu.", width / 2, height / 2 + 60);
  if (keyIsDown(ENTER)) {
    mode = 1;
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
    let nextX = this.x;
    let nextY = this.y;

    if (keyIsDown(65)) nextX -= this.speed; // A key
    if (keyIsDown(68)) nextX += this.speed; // D key
    if (keyIsDown(87)) nextY -= this.speed; // W key
    if (keyIsDown(83)) nextY += this.speed; // S key

    if (!this.collides(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    }

    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  }

  show() {
    fill(200, 0, 0);
    ellipse(this.x, this.y, 40, 40);
  }

  collides(nextX, nextY) {
    for (let boundary of boundaries) {
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

    return (
      playerRight > this.x &&
      playerLeft < this.x + this.w &&
      playerBottom > this.y &&
      playerTop < this.y + this.h
    );
  }
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(252, 163, 17);
    rect(this.x, this.y, drinkSize, drinkSize);
  }
}
//second part of the game down here
function preload() {
  song = loadSound('assets/dance-all-night-245747.mp3');
}

/*function setup() {
  createCanvas(1000, 650);
  textAlign(CENTER, CENTER);
  fft = new p5.FFT();
}*/


/*function danceFloor() {
  drawGameArea();
  drawDancingCharacter();

  let spectrum = fft.analyze();
  let energy = fft.getEnergy("bass");

  if (energy > beatThreshold && millis() - lastBeatTime > beatInterval) {
    beats.push(
      new Beat(
        random([width / 4, width / 4 * 2, width / 4 * 3, width]),
        random(["UP", "DOWN", "LEFT", "RIGHT"])
      )
    );
    lastBeatTime = millis();
  }

  for (let i = beats.length - 1; i >= 0; i--) {
    beats[i].update();
    beats[i].show();

    if (beats[i].y > height) {
      beats.splice(i, 1);
      triggerFeedback("lose");
    }
  }

  displayScore();

  if (feedbackState) {
    fill(feedbackState === "win" ? "green" : "red");
    rect(0, 0, width, height);
    feedbackAlpha -= 5;
    if (feedbackAlpha <= 0) feedbackState = null;
  }
}


function keyPressed() {
  if (mode === 0 && keyCode === ENTER) {
    mode = 1;
  } else if (mode === 1) {
    if (key === "2") {
      player = new Player("Paulina", 10, height - 50, 5);
      mode = 2;
    } else if (key === "3" && agnesUnlocked) {
      player = new Player("Agnes", 10, height - 50, 8);
      mode = 2;
    }
  } else if (mode === 3) {
    let validKeys = [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW];
    if (!validKeys.includes(keyCode)) return;

    let correctKey = false;
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
        correctKey = true;
        triggerFeedback("win");
        triggerDanceMove();
        break;
      }
    }
    if (!correctKey) {
      triggerFeedback("lose");
    }
  }
}

function drawGameArea() {
  fill(50);
  rect(0, 0, width / 2, height);

  stroke(255);
  for (let i = 0; i < 5; i++) {
    line((width / 4) * i, 0, (width / 4) * i, height);
  }

  fill(200, 200, 200, 100);
  rect(0, height - 100, width / 2, 50);
}

function drawDancingCharacter() {
  push();
  translate(750, 400);

  if (feedbackState === "win") {
    if (danceMove === "jump") {
      fill(255, 200, 0);
      ellipse(0, sin(frameCount * 0.2) * 20 - 50, 50, 50);
      rect(-20, sin(frameCount * 0.2) * 20 - 30, 40, 80);
    } else if (danceMove === "spin") {
      rotate(frameCount * 0.1);
      fill(255, 200, 0);
      ellipse(0, -50, 50, 50);
      rect(-20, -30, 40, 80);
    } else if (danceMove === "side-step") {
      fill(255, 200, 0);
      ellipse(sin(frameCount * 0.2) * 20, -50, 50, 50);
      rect(sin(frameCount * 0.2) * 20 - 20, -30, 40, 80);
    }
  } else if (feedbackState === "lose") {
    rotate(sin(frameCount * 0.2) * PI / 20);
    fill(255, 50, 50);
    ellipse(0, -50, 50, 50);
    rect(-20, -30, 40, 80);
  } else {
    fill(255, 200, 0);
    ellipse(0, -50, 50, 50);
    rect(-20, -30, 40, 80);
  }

  pop();
}

function triggerFeedback(state) {
  feedbackState = state;
  feedbackAlpha = 100;
}

function triggerDanceMove() {
  const moves = ["jump", "spin", "side-step"];
  danceMove = random(moves);
}

class Beat {
  constructor(x, key) {
    this.x = x;
    this.y = 0;
    this.key = key;
  }

  update() {
    this.y += 5;
  }

  show() {
    fill(252, 163, 17);
    rect(this.x - 25, this.y - 25, 50, 50);

    fill(255);
    textSize(20);
    if (this.key === "UP") {
      text("↑", this.x, this.y);
    } else if (this.key === "DOWN") {
      text("↓", this.x, this.y);
    } else if (this.key === "LEFT") {
      text("←", this.x, this.y);
    } else if (this.key === "RIGHT") {
      text("→", this.x, this.y);
    }
  }
}

function startScreenTextAnimation(){
  textSizeAnimation = map(sin(frameCount * sizeSpeedTextSize), -1.0, 1.0, minTextSize, maxTextSize);
  
line 343 taken from mo.h, George Profenza, 
& Kevin Workman. (2016, February 2). How to make the size of 
ellipse to get smaller and bigger in processing automatically. 
Stack Overflow. 
https://stackoverflow.com/questions/35156661/how-to-make-the-size-of-ellipse-to-get-smaller-and-bigger-in-processing-automati 
, reworked by enickles on p5js https://editor.p5js.org/enickles/sketches/SkDt1quAX
 */


