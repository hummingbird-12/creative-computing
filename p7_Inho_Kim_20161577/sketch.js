let centerX;
let centerY;

function drawSpace() {
  background('#0A243E');
  noStroke();
  fill(255, 255, 0);
  for (let i = 0; i < height; i += height / 10) {
    for (let j = 0; j < width; j += width / 25) {
      circle(j + random(0, width / 25), i + random(0, height / 10), 2);
    }
  }
}

function drawAsteroid() {
  if (pmouseX === 0 && pmouseY === 0) {
    return;
  }

  noFill();

  stroke('#F8E9AF88');
  strokeWeight(7);
  beginShape();
  line(pmouseX, pmouseY, mouseX, mouseY);
  endShape();

  stroke('#FF0000AA');
  strokeWeight(3);
  beginShape();
  line(pmouseX, pmouseY, mouseX, mouseY);
  endShape();
}

function drawTwin() {
  newX = centerX + (mouseX - centerX) * 0.1;
  newY = centerY + (mouseY - centerY) * 0.1;

  noFill();

  stroke('#24F7F888');
  strokeWeight(7);
  beginShape();
  line(centerX, centerY, newX, newY);
  endShape();

  stroke('#354f69AA');
  strokeWeight(3);
  beginShape();
  line(centerX, centerY, newX, newY);
  endShape();

  centerX = newX;
  centerY = newY;
}

/***** p5.js functions *****/
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  frameRate(60);

  centerX = width / 2;
  centerY = height / 2;

  drawSpace();
}

function draw() {
  if (dist(mouseX, mouseY, pmouseX, pmouseY) > 40) {
    drawSpace();
  }

  if (pmouseX !== 0 || pmouseY !== 0) {
    drawTwin();
    drawAsteroid();
  }
}
