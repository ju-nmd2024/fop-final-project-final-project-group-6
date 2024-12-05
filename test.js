
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(255);
    image(manEnemy, 10, 10, 100, 100);
}


function preload() {
    manEnemy = loadImage("man_enemy.png");
  }