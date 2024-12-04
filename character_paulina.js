function setup(){
    createCanvas(1000, 650);
}

let x = 100;
let y = 100;
let speed = -1.7;

drawPaulina();

function drawPaulina() {
    noStroke();
    translate(x,y);

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
}

function movingPaulina(){
    clear();
    drawPaulina();

    y+=speed;

  if (y > 130 || y < 100) {
  speed = speed * -1;
  }
}

function draw(){
    movingPaulina();
}
