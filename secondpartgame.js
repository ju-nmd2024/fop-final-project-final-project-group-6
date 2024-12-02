let player;
let beats = [];
let beatSpeed = 5;
let score = 0;
let hitZoneY;
let lastKey = '';
let rightColor = color(0, 255, 0, 100);  // Transparent green
let wrongColor = color(255, 0, 0, 100);  // Transparent red

function setup() {
    createCanvas(1000, 650);
    hitZoneY = height - 100;
    textAlign(CENTER, CENTER);
    player = new Player();
}

function draw() {
    background(30);
    fill(255);

    if (frameCount % 60 === 0) {
        let keyPressed = random([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
        beats.push(new Beat(keyPressed, random(width / 2 - 150, width / 2 - 50)));
    }

    for (let i = beats.length - 1; i >= 0; i--) {
        beats[i].update();
        beats[i].show();

        if (beats[i].y > height) {
            beats.splice(i, 1);
        }
    }

    fill(255);
    textSize(30);
    text('Score: ' + score, width / 2, 50);

    player.show();
    player.update();

    if (lastKey !== '') {
        fill(lastKey === 'correct' ? rightColor : wrongColor);
        rect(width / 2, hitZoneY - 40, width / 2, 50);
        lastKey = '';
    }
}

function keyPressed() {
    for (let i = beats.length - 1; i >= 0; i--) {
        if (beats[i].y > hitZoneY - 10 && beats[i].y < hitZoneY + 10) {
            if (beats[i].key === keyCode) {
                score++;
                lastKey = 'correct';
            } else {
                lastKey = 'wrong';
            }
            beats.splice(i, 1);
            break;
        }
    }
}

class Player {
    constructor() {
        this.x = width - 200;
        this.y = height - 200;
        this.size = 50;
    }

    show() {
        fill(200, 0, 0);
        ellipse(this.x, this.y, this.size);
    }

    update() {
        if (keyIsDown(UP_ARROW)) {
            // Show up arms gesture
            fill(200, 0, 0);
            ellipse(this.x, this.y - 20, this.size / 2); // Arms up
        } else if (keyIsDown(DOWN_ARROW)) {
            // Show down arms gesture
            fill(200, 0, 0);
            ellipse(this.x, this.y + 20, this.size / 2); // Arms down
        } else if (keyIsDown(LEFT_ARROW)) {
            // Show left arms gesture
            fill(200, 0, 0);
            ellipse(this.x - 20, this.y, this.size / 2); // Arms left
        } else if (keyIsDown(RIGHT_ARROW)) {
            // Show right arms gesture
            fill(200, 0, 0);
            ellipse(this.x + 20, this.y, this.size / 2); // Arms right
        }
    }
}

class Beat {
    constructor(key, x) {
        this.key = key;
        this.x = x;
        this.y = 0;
    }

    update() {
        this.y += beatSpeed;
    }

    show() {
        fill(252, 160, 17);
        rect(this.x, this.y, 50, 50);
        fill(255);
        textSize(20);
        text(this.getKeyName(), this.x + 25, this.y + 25);
    }

    getKeyName() {
        switch (this.key) {
            case UP_ARROW: return "↑";
            case DOWN_ARROW: return "↓";
            case LEFT_ARROW: return "←";
            case RIGHT_ARROW: return "→";
        }
    }
}
