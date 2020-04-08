// Constants
const BLACK = 0;
const WHITE = 255;
const textSequence = [
  'Scratch the canvas',
  "to paint with what's behind it.",
  'Try it out!',
];
const SCRATCH_SIZE = 5;

// Flags
let loopTriggable = false;
let onLoop = false;
let DEL = false;
let LEFT_MOUSE = false;
let RIGHT_MOUSE = false;

function showTextSequence(interval = 3000) {
  const showText = (index) => {
    background(BLACK);
    text(textSequence[index], width / 2, height / 2);

    setTimeout(() => {
      if (index + 1 < textSequence.length) {
        showText(index + 1);
      } else {
        background(BLACK);
        loopTriggable = true;
      }
    }, interval);
  };

  fill(WHITE);
  textAlign(CENTER);
  textSize(26);

  showText(0);
}

function resetCanvas() {
  background(BLACK);
}

// Listen to click event of the button
function listenDOM() {
  document.getElementById('save-button').onclick = () => {
    if (!onLoop) {
      return;
    }
    saveCanvas('myCanvas', 'png');
  };
}

function scratchCanvas() {
  erase();
  fill(BLACK);
  circle(mouseX, mouseY, SCRATCH_SIZE);
  noErase();
}

function unscratchCanvas() {
  fill(BLACK);
  circle(mouseX, mouseY, SCRATCH_SIZE * 3);
}

/***** p5.js functions *****/

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('p5-holder');
  noStroke();
  frameRate(120);
  noLoop();
  showTextSequence(3000);
  listenDOM();
}

function draw() {
  if (!onLoop) {
    return;
  }

  if (mouseIsPressed) {
    if (LEFT_MOUSE) {
      scratchCanvas();
    } else if (RIGHT_MOUSE) {
      unscratchCanvas();
    }
  }

  if (keyIsPressed) {
    if (DEL) {
      resetCanvas();
      DEL = false;
    }
  }
}

function keyPressed() {
  if (!onLoop) {
    return;
  }

  switch (keyCode) {
    case DELETE:
      DEL = true;
      break;
  }
}

function mousePressed() {
  if (loopTriggable) {
    loop();
    resetCanvas();
    loopTriggable = false;
    onLoop = true;
    return;
  }

  switch (mouseButton) {
    case LEFT:
      LEFT_MOUSE = true;
      break;
    case RIGHT:
      RIGHT_MOUSE = true;
      break;
    default:
      break;
  }
}

function mouseReleased() {
  switch (mouseButton) {
    case LEFT:
      LEFT_MOUSE = false;
      break;
    case RIGHT:
      RIGHT_MOUSE = false;
      break;
    default:
      break;
  }
  return false;
}
