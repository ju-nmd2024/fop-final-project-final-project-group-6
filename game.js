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
let beatSpeedBase = 5;  // base speed for beats
let paused = false;
var mode;
let xPaulina = 100; 
let yPaulina = 100; 
let speedPaulina = -1.7; 
let xAgnes = 300; 
let yAgnes = 200; 
let speedAgnes = 2.5; 

class Boundary {
  constructor(x, y, w, h, speed = 0.02) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;  
    this.initialX = x;  // initial position
  }

  update() {
    // side to side movement using a sine wave (back and forth)
    this.x = this.initialX + Math.sin(frameCount * this.speed) * 200; // Moves 200 pixels back and forth
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

    // collision detection boundary
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
    //this.energy = 0;
  }

  update() {
    if (keyIsDown(65)) this.x -= this.speed; // A key
    if (keyIsDown(68)) this.x += this.speed; // D key
    if (keyIsDown(87)) this.y -= this.speed; // W key
    if (keyIsDown(83)) this.y += this.speed; // S key
    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, 0, height - 50);
  
 
    this.x = constrain(this.x, 0, width - 50);
  
    this.y = constrain(this.y, 0, height - 50);

}

  show() {
    push();
    translate(this.x, this.y);
    if (this.name === "Paulina") {
    noStroke();
    //face color
    fill(255, 209, 173);
    rect(90, 120, 130, 80);

    //eyes
    fill(87, 64, 46);
    rect(180, 150, 15, 5);
    rect(175, 155, 5, 15);
    rect(195, 155, 5, 15);
    rect(180, 170, 15, 5);
    rect(190, 155, 5, 15);
    rect(200, 150, 5, 5);
    rect(120, 150, 5, 5);

    rect(130, 150, 15, 5);
    rect(125, 155, 5, 15);
    rect(145, 155, 5, 15);
    rect(130, 170, 15, 5);
    rect(140, 155, 5, 15);

    fill(255, 220);
    rect(180, 155, 10, 15);
    rect(130, 155, 10, 15);

    //mouth
    fill(87, 64, 46);
    rect(155, 175, 5, 5);
    rect(160, 180, 10, 5);
    rect(170, 175, 5, 5);

    //hair
    fill(211, 189, 160);
    rect(110, 80, 90, 50);
    rect(100, 90, 10, 60);
    rect(90, 110, 10, 100);
    rect(200, 90, 10, 50);
    rect(210, 110, 10, 100);

    fill(168, 146, 121);
    rect(100, 190, 10, 20);
    rect(200, 190, 10, 20);

    //skin color
    fill(251, 196, 171);
    rect(150, 120, 20, 10);
    rect(110, 130, 40, 10);
    rect(170, 130, 30, 10);
    rect(100, 150, 10, 10);

    rect(130, 180, 10, 10);
    rect(190, 180, 10, 10);

    //face outline
    fill(255);
    rect(110, 70, 90, 10);
    rect(100, 80, 10, 10);
    rect(90, 90, 10, 20);
    rect(100, 80, 10, 10);
    rect(80, 110, 10, 100);
    rect(90, 210, 20, 10);
    rect(110, 200, 90, 10);
    rect(200, 210, 20, 10);
    rect(220, 110, 10, 100);
    rect(200, 80, 10, 10);
    rect(210, 90, 10, 20);
    } else if (this.name === "Agnes") {
    noStroke();

    //face color
    fill(214, 159, 126);
    rect(90, 120, 130, 80);

    //eyes
    fill(87, 64, 46);
    rect(180, 150, 15, 5);
    rect(175, 155, 5, 15);
    rect(195, 155, 5, 15);
    rect(180, 170, 15, 5);
    rect(190, 155, 5, 15);
    rect(200, 150, 5, 5);
    rect(120, 150, 5, 5);

    rect(130, 150, 15, 5);
    rect(125, 155, 5, 15);
    rect(145, 155, 5, 15);
    rect(130, 170, 15, 5);
    rect(140, 155, 5, 15);

    fill(255, 220);
    rect(180, 155, 10, 15);
    rect(130, 155, 10, 15);

    //mouth
    fill(87, 64, 46);
    rect(155, 175, 5, 5);
    rect(160, 180, 10, 5);
    rect(170, 175, 5, 5);

    //hair
    fill(119, 73, 54);
    rect(110, 50, 90, 80);
    rect(100, 60, 10, 90);
    rect(90, 70, 10, 110);
    rect(200, 60, 10, 70);
    rect(80, 70, 10, 110);
    rect(70, 90, 10, 80);
    rect(230, 90, 10, 70);
    rect(210, 70, 20, 110);


    //skin color
    fill(195, 142, 112);
    rect(150, 120, 20, 10);
    rect(110, 130, 40, 10);
    rect(170, 130, 30, 10);
    rect(100, 150, 10, 10);

    rect(130, 180, 10, 10);
    rect(190, 180, 10, 10);

    //face outline
    fill(255);
    rect(110, 40, 90, 10);
    rect(100, 50, 10, 10);
    rect(80, 60, 20, 10);
    rect(70, 70, 10, 20);
    rect(60, 90, 10, 80);
    rect(70, 170, 10, 10);
    rect(80, 180, 10, 10);
    rect(90, 190, 20, 10);
    rect(110, 200, 90, 10);
    rect(200, 190, 20, 10);
    rect(220, 180, 10, 10);
    rect(240, 90, 10, 70);
    rect(230, 160, 10, 20);
    rect(230, 70, 10, 20);
    rect(210, 60, 20, 10);
    rect(200, 50, 10, 10);


    fill(195, 142, 112);
    rect(200, 130, 10, 10);

    fill(214, 159, 126);
    rect(210, 160, 10, 0);
    }
    pop();
  }

  collect(drink) {
    return dist(this.x, this.y, drink.x, drink.y) < 25;  
  }

  //this.frameCounter++;
  
}

class Drink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20; // size default
    this.isSpecial = random() < 0.1;  
  }

  show() {
    if (this.isSpecial) {
      fill(255, 0, 255); 
    } else {
      fill(252, 163, 17); // reg drinks
    }
    rect(this.x, this.y, this.size, this.size); 
  }

  collect(player) {
    return dist(player.x, player.y, this.x, this.y) < 25;  // if player collect enough
  }
}

class Beat {
  constructor(x, key, isAgnes) {
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
    //this.speed = beatSpeedBase;
    this.speed = isAgnes? beatSpeedBase * agnesDifficultyMultiplier : beatSpeedBase;
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


function displayCollectDrinks() {
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
    } else if (mode === 5 || mode === 6) {  // end game, win lose
      mode = 1;  // menu return
    }
  } else if (mode === 1) {
    if (key === "2") {
      player = new Player("Paulina", width/2, height - 50, 4);
      mode = 2;
      startDrinkChallenge();
    } else if (key === "3" && agnesUnlocked) {
      player = new Player("Agnes", width/2, height - 50, 7);
      mode = 2;
      startDrinkChallenge();
    }
  } else if (mode === 3 && keyCode === 32) {  // space key
    mode = 4;  
    score = 0;
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
  background(0);
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
  background (50);
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

  if (player.name === "Agnes") {
    timer = 45;  
  } else {
    timer = 60;  
  }

  //interval set for timer
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
    clearInterval(timerInterval);  
    player = null;  // removes player
    mode = 3;  
    getReadyStartTime = millis(); 
  } else if (timer <= 0) {
    clearInterval(timerInterval); 
    player = null;  
    mode = 6; 
  }
}


function getReadyScreen() {
  fill(255);
  textSize(40);
  text("Get Ready to Dance!", width / 2, height / 2);
  textSize(20);
  text("Press SPACE to start!", width / 2, height / 2 + 50);
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
  background(30);
  clear();  
  backgroundMap();

  if (player) { //making sure it spawns
  player.update();  
  player.show();  
  }  

  for (let boundary of boundaries) {
    boundary.update();  
    boundary.show();   

    if (boundary.collide(player)) {
      mode = 6;  
      clearInterval(timerInterval); 
      return;  
    }
  }

  if (drinks.length < 3 && frameCount % 45 === 0) {
    drinks.push(new Drink(random(100, width - 100), random(100, height - 100)));
  }


  for (let i = drinks.length - 1; i >= 0; i--) {  //array interaction w index
    let drink = drinks[i];
    drink.show();  

    if (player.collect(drink)) {
      drinks.splice(i, 1);  
      drinksCollected++;

      if (drink.isSpecial) {
        score += 2; 
      } else {
        score++;  
      }

      if (drinksCollected >= 30) {
        checkChallengeOutcome();
      }
    }
  }
  displayCollectDrinks();
}

function danceFloor() {
  drawGameArea();

  let beatInterval = player.name === "Agnes" ? 500 : 1000;
  if (millis() - lastBeatTime > beatInterval) {
    // new beat generation
    beats.push(
      new Beat(
        random([width / 4, (width / 4) * 2, (width / 4) * 3]),
        random(["UP", "DOWN", "LEFT", "RIGHT"]),
        player.name === "Agnes"
      )
    );

    // difficulty logic, agnes
    if (player.name === "Agnes" && random() > 0.6) {
      beats.push(
        new Beat(
          random([width / 4, (width / 4) * 2, (width / 4) * 3]),
          random(["UP", "DOWN", "LEFT", "RIGHT"]),
          true
        )
      );
    }

    lastBeatTime = millis();
  }


  /*if (millis() - lastBeatTime > beatInterval) {
    beats.push(
      new Beat(
        random([width / 4, (width / 4) * 2, (width / 4) * 3]),
        random(["UP", "DOWN", "LEFT", "RIGHT"])
      )
    );*/

    if (millis() - lastBeatTime > beatInterval) {
      beats.push(new Beat(random([width / 4, (width / 4) * 2, (width / 4) * 3]), random(["UP", "DOWN", "LEFT", "RIGHT"])));
  
      if (player.name === "Agnes" && random() > 0.6) {
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

  if (score >= 25) {
    mode = 5;  
  } else if (score < 0) {
    mode = 6;  
  }

  fill(255);
  textSize(20);
  text(`Score: ${score}`, width - 80, 30); }


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
    agnesUnlocked = true;
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

function drawMap() {
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
    
}


function draw() {
  clear();
  background(30);

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
  } else {
    fill(255, 0, 0);
    textSize(40);
    text("Error: Invalid Mode", width / 2, height / 2);
  }

 /* if (mode === 2 && player) {
    player.update();
    player.show();
  }*/
}
