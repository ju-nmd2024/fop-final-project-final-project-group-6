
function setup() {
    createCanvas(1000, 650);
}

let x = 100;
let y = 100;
let speed = -1.7;

drawAgnesUnlocked();

function drawAgnesUnlocked(){
    noStroke();
    translate(x, y);

    //face color
    fill(96, 73, 90);
    rect(90, 120, 130, 80);

    //eyes
    fill(47, 34, 53);
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
    fill(47, 34, 53);
    rect(155, 175, 5, 5);
    rect(160, 180, 10, 5);
    rect(170, 175, 5, 5);

    //hair
    fill(47, 34, 53);
    rect(110, 50, 90, 80);
    rect(100, 60, 10, 90);
    rect(90, 70, 10, 110);
    rect(200, 60, 10, 70);
    rect(80, 70, 10, 110);
    rect(70, 90, 10, 80);
    rect(230, 90, 10, 70);
    rect(210, 70, 20, 110);


    //skin color
    fill(63, 50, 68);
    rect(150, 120, 20, 10);
    rect(110, 130, 40, 10);
    rect(170, 130, 30, 10);
    rect(100, 150, 10, 10);

    rect(130, 180, 10, 10);
    rect(190, 180, 10, 10);

    //face outline
    fill(41, 32, 58);
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


    fill(63, 50, 68);
    rect(200, 130, 10, 10);
}

function movingAgnesLocked(){
    drawAgnesUnlocked();
    clear();
    drawAgnesUnlocked();

    y+=speed;

  if (y > 130 || y < 100) {
  speed = speed * -1;
  }
}

function draw() {
    movingAgnesLocked();
}