const TEXT_SIZE = 100;
const LINE_BREAK = 13;
const NEON = '#FDDFFE';
const FLICKER_CHANCE = 0.2;
const STROKE_ALPHA = 130;

const isValidChar = (c) => /^[ A-Za-z0-9?!',.]{1,1}$/.test(c);

/***** p5.js functions *****/
let font;
let background;
let text = "Don't worry, be happy";

let neonColor;

function preload() {
  font = loadFont('5ident.ttf');

  background = loadImage('brick.jpg');
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  frameRate(60);

  fill(NEON);
  strokeWeight(10);

  neonColor = color('#F00596');
}

function draw() {
  image(background, 0, 0, width, height);

  for (let i = 0; i < text.length; i++) {
    const x = 200 + (i % LINE_BREAK) * TEXT_SIZE * 1.1;
    const y = height / 2 + (i < LINE_BREAK ? -TEXT_SIZE / 2 : TEXT_SIZE);
    const pnts = font.textToPoints(text[i], x, y, TEXT_SIZE, {
      sampleFactor: 0.3,
    });

    neonColor.setAlpha(
      random(0, 1) < FLICKER_CHANCE
        ? floor(random(STROKE_ALPHA * 0.5, STROKE_ALPHA))
        : STROKE_ALPHA
    );
    stroke(neonColor);

    beginShape();
    for (const p of pnts) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (isValidChar(key)) {
    if (text.length < LINE_BREAK * 2) {
      text += key;
    }
  } else if (keyCode === BACKSPACE) {
    print('BACK');
    text = text.substr(0, text.length - 1);
  } else if (keyCode === DELETE) {
    text = '';
  } else if (keyCode === ENTER) {
    saveCanvas('my-neon');
  }
  return false;
}
