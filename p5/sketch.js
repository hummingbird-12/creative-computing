let fftSound;
let fftMic;
let mic;
let sound;

const RED = '#FF0000';
const ORANGE = '#FF7F00';
const YELLOW = '#FFFF00';
const GREEN = '#33CC33';
const LIGHT_BLUE = '#C3F2FF';
const WHITISH_BLUE = '#8EC9FF';
const DARK_RED = '#AB0034';

const _A = 0;
const _B = 1;
const _C = 2;
const _D = 3;
const _E = 4;
const _F = 5;
const _G = 6;
let noteFrequencies = [[], [], [], [], [], [], []];
const noteColors = [
  GREEN,
  WHITISH_BLUE,
  RED,
  YELLOW,
  LIGHT_BLUE,
  DARK_RED,
  ORANGE,
];
const noteLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
let notePositions = [];
let noteStarted = [];

let micStarted = false;
let showNoteLetter = true;

function calculateFreq() {
  const startingFreqs = [55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0];
  for (const freq of startingFreqs) {
    noteFrequencies[_A].push(freq * pow(2, 0 / 12));
    noteFrequencies[_B].push(freq * pow(2, 2 / 12));
    noteFrequencies[_C].push(freq * pow(2, 3 / 12));
    noteFrequencies[_D].push(freq * pow(2, 5 / 12));
    noteFrequencies[_E].push(freq * pow(2, 7 / 12));
    noteFrequencies[_F].push(freq * pow(2, 8 / 12));
    noteFrequencies[_G].push(freq * pow(2, 10 / 12));
  }
}

function intializePositions() {
  notePositions = [];
  noteStarted = [];
  for (let note = 0; note < 7; note++) {
    notePositions.push([]);
    notePositions[note].push(floor(random(width * 0.2, width * 0.8)));
    notePositions[note].push(floor(random(height * 0.2, height * 0.8)));
    noteStarted.push(false);
  }
}

function toggleSound() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}

function draw_splash(x, y, size) {
  size /= 1.5;
  circle(x, y, size);
  circle(x + size * 0.4, y + size * 0.4, size * 0.5);
  circle(x - size * 0.4, y - size * 0.2, size * 0.6);
  circle(x - size * 0.6, y + size * 0.3, size * 0.3);
}

function draw_star(x, y, size) {
  size /= 12;
  push();
  translate(0, -15);
  triangle(
    x - size * 5,
    y + size * 5,
    x + size * 5,
    y + size * 5,
    x,
    y - size * 4
  );
  triangle(x - size * 5, y - size, x + size * 5, y - size, x, y + size * 8);
  pop();
}

function draw_flower(x, y, size) {
  size /= 13;
  push();
  translate(0, -3);
  bezier(
    x - size * 5,
    y - size * 5,
    x + size * 5,
    y - size * 5,
    x - size * 5,
    y + size * 5,
    x + size * 5,
    y + size * 5
  );
  bezier(
    x + size * 5,
    y - size * 5,
    x - size * 5,
    y - size * 5,
    x + size * 5,
    y + size * 5,
    x - size * 5,
    y + size * 5
  );
  bezier(
    x + size * 5,
    y - size * 5,
    x + size * 5,
    y + size * 5,
    x - size * 5,
    y - size * 5,
    x - size * 5,
    y + size * 5
  );
  bezier(
    x - size * 5,
    y - size * 5,
    x - size * 5,
    y + size * 5,
    x + size * 5,
    y - size * 5,
    x + size * 5,
    y + size * 5
  );
  circle(x, y, size * 6);
  pop();
}

function draw_guitar(x, y, size) {
  size /= 17;
  push();
  translate(0, 15);
  circle(x, y, size * 10);
  circle(x, y - size * 5, size * 8);
  rect(x - size, y, 2 * size, size * -20);
  rect(x - 1.5 * size, y - size * 18, size * 3, size * -4);
  circle(x - 1.8 * size, y - size * 19, size * 0.8);
  circle(x - 1.8 * size, y - size * 20, size * 0.8);
  circle(x - 1.8 * size, y - size * 21, size * 0.8);
  circle(x + 1.8 * size, y - size * 19, size * 0.8);
  circle(x + 1.8 * size, y - size * 20, size * 0.8);
  circle(x + 1.8 * size, y - size * 21, size * 0.8);
  pop();
}

function draw_bear(x, y, size) {
  circle(x, y, size * 0.8);
  circle(x - size * 0.25, y - size * 0.28, size * 0.35);
  circle(x + size * 0.25, y - size * 0.28, size * 0.35);
}

function draw_note(x, y, size) {
  size /= 3;
  push();
  translate(-2, 12);
  rect(x - size * 0.5, y - size * 1.5, size * 0.16, size * 1.5);
  rect(x - size * 0.5, y - size * 1.5, size * 1, size * 0.16);
  rect(x + size * 0.5, y - size * 1.5, size * 0.16, size * 1.5);

  ellipse(x - size * 0.6, y, size / 2, size / 4);
  ellipse(x + size * 0.43, y, size / 2, size / 4);
  pop();
}

function draw_speaker(x, y, size) {
  size /= 2.5;
  push();
  translate(-15, 0);
  rect(x - size * 0.5, y - size * 0.27, size / 2, size / 2);
  triangle(x - size * 0.5, y, x + size, y + size, x + size, y - size);
  pop();
}

const noteDrawFncts = [
  draw_splash,
  draw_star,
  draw_flower,
  draw_guitar,
  draw_bear,
  draw_note,
  draw_speaker,
];

/***** p5.js functions *****/

function preload() {
  soundFormats('mp3');
  sound = loadSound('buddy.mp3');
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('p5-holder');
  canvas.doubleClicked(toggleSound);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  textStyle(BOLD);
  frameRate(24);
  randomSeed(8192);
  background(0);

  calculateFreq();
  intializePositions();

  mic = new p5.AudioIn();
  mic.amp(1);
  mic.connect();

  fftSound = new p5.FFT();
  fftSound.setInput(sound);

  fftMic = new p5.FFT();
  fftMic.setInput(mic);
}

function draw() {
  // background(0);

  fftSound.analyze();
  fftMic.analyze();

  // Calculate average amplitude per note
  let avgAmps = [];
  for (let note = 0; note < 7; note++) {
    let avg = 0;
    let count = 0;
    // Per each octave of the note
    for (const [index, freq] of noteFrequencies[note].entries()) {
      const energySound = fftSound.getEnergy(freq * 0.997, freq * 1.003);
      const energyMic = fftMic.getEnergy(freq * 0.999, freq * 1.001);

      if (energySound > 240 - index * 20) {
        avg += map(
          energySound,
          240 - index * 20,
          255 - index * 7,
          0,
          100,
          true
        );
        count++;
      }

      if (energyMic > 100) {
        avg += map(energyMic, 100, 125, 0, 100, true);
        count++;
      }
    }
    if (count > 0) {
      avg /= count;
    }

    avgAmps.push(map(avg, 25, 100, 0, 100, true));
  }

  // Draw in respect to each note's average amplitude
  for (let note = 0; note < 7; note++) {
    let vec = [0, 0];
    if (avgAmps[note] > 0) {
      vec[0] =
        random(5, map(avgAmps[note], 0, 100, 10, 20, true)) *
        (floor(random(0, 2)) == 0 ? -1 : 1);
      vec[1] =
        random(5, map(avgAmps[note], 0, 100, 10, 20, true)) *
        (floor(random(0, 2)) == 0 ? -1 : 1);
    }

    notePositions[note][0] += vec[0];
    notePositions[note][1] += vec[1];

    if (notePositions[note][0] < 0 || notePositions[note][0] >= width) {
      notePositions[note][0] -= vec[0] * 2;
    }
    if (notePositions[note][1] < 0 || notePositions[note][1] >= height) {
      notePositions[note][1] -= vec[1] * 2;
    }

    const x = notePositions[note][0];
    const y = notePositions[note][1];
    let size = max(70, 70 + avgAmps[note]);

    if (avgAmps[note] > 0) {
      noteStarted[note] = true;
      fill(noteColors[note] + '77');
      noteDrawFncts[note](x, y, size);
    }

    if (noteStarted[note] && showNoteLetter) {
      fill(100, 100, 100, 100);
      textSize(min(20, size * 0.3));
      text(noteLetters[note], x, y);
    }
  }
}

function keyPressed() {
  switch (key) {
    case 'm':
    case 'M':
      if (micStarted) {
        mic.stop();
      } else {
        mic.start();
      }
      micStarted = !micStarted;
      break;
    case 'c':
    case 'C':
      sound.stop();
      setTimeout(() => {
        intializePositions();
        background(0);
        showNoteLetter = true;
      }, 400);
      break;
    case 'n':
    case 'N':
      showNoteLetter = !showNoteLetter;
      break;
    default:
      break;
  }
}
