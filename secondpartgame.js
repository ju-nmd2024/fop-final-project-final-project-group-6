let player;
let beats = [];
let beatSpeed = 5;
let score = 0;
let hitZoneY;
let feedbackColor = null;
let feedbackAlpha = 0;
let mode = 2;

function setup() {
    createCanvas(1000, 650);
    hitZoneY = height - 200;
    player = {
        x: 150,
        y: height / 2,
        size: 150,
        armAction: "neutral"
    };
}

function draw() {
    background(30);

    if (feedbackColor) {
        fill(feedbackColor[0], feedbackColor[1], feedbackColor[2], feedbackAlpha);
        rect(0, 0, width, height);
        feedbackAlpha -= 5;
        if (feedbackAlpha <= 0) feedbackColor = null;
    }

    if (mode === 2) {
        drawGameArea();
        drawPlayer();
    }
}

function drawGameArea() {
    fill(0, 50, 100);
    rect(width / 2, 0, width / 2, height);

    stroke(255, 100);
    for (let i = 0; i < 5; i++) {
        line(width / 2 + (i * 100), 0, width / 2 + (i * 100), height);
    }

    fill(100, 200, 100, 100);
    rect(width / 2, hitZoneY - 10, width / 2, 30);

    fill(255);
    textSize(30);
    text(`Score: ${score}`, width / 1.25, 50);

    if (frameCount % 60 === 0) {
        beats.push(new Beat(random(width / 2 + 50, width - 50)));
    }

    for (let i = beats.length - 1; i >= 0; i--) {
        beats[i].update();
        beats[i].show();

        if (beats[i].y > height) {
            beats.splice(i, 1);
            triggerFeedback([255, 0, 0]);
        }
    }
}

function drawPlayer() {
    drawStylizedCharacter(player.x, player.y, player.armAction);
}

function drawStylizedCharacter(x, y, armAction) {
    fill(255);
    ellipse(x, y - 80, 50, 50);

    fill(255, 200, 0);
    rect(x - 20, y - 30, 40, 80);

    if (armAction === "up") {
        line(x - 50, y - 60, x + 50, y - 60);
    } else if (armAction === "down") {
        line(x - 50, y + 60, x + 50, y + 60);
    } else if (armAction === "left") {
        line(x - 50, y, x - 80, y + 30);
    } else if (armAction === "right") {
        line(x + 50, y, x + 80, y + 30);
    }

    line(x, y + 80, x - 40, y + 120);
    line(x, y + 80, x + 40, y + 120);
}

function keyPressed() {
    let actions = ["up", "down", "left", "right"];
    
    if (key === 'W' || key === 'w') {
        player.armAction = "up";
    } else if (key === 'S' || key === 's') {
        player.armAction = "down";
    } else if (key === 'A' || key === 'a') {
        player.armAction = "left";
    } else if (key === 'D' || key === 'd') {
        player.armAction = "right";
    }

    let correctKey = false;
    for (let i = beats.length - 1; i >= 0; i--) {
        if (
            beats[i].y > hitZoneY - 10 &&
            beats[i].y < hitZoneY + 10 &&
            beats[i].key === key
        ) {
            score++;
            beats.splice(i, 1);
            correctKey = true;
            break;
        }
    }

    if (correctKey) {
        triggerFeedback([0, 255, 0]);
    } else {
        triggerFeedback([255, 0, 0]);
    }
}

function triggerFeedback(color) {
    feedbackColor = color;
    feedbackAlpha = 100;
}

class Beat {
    constructor(x) {
        this.x = x;
        this.y = 0;
        this.key = ['W', 'S', 'A', 'D'][Math.floor(random(4))].toUpperCase();
    }

    update() {
        this.y += beatSpeed;
    }

    show() {
        fill(252, 160, 17);
        ellipse(this.x + 25, this.y + 25, 50, 50);

        fill(255);
        textSize(30);
        text(this.getKeyName(), this.x + 25, this.y + 25);
    }

    getKeyName() {
        if (this.key === 'W') return "W";
        if (this.key === 'S') return "S";
        if (this.key === 'A') return "A";
        if (this.key === 'D') return "D";
    }
}
