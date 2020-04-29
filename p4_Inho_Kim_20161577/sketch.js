const SPAWN_START = 0.05;
const SPAWN_END = 0.95;

const PERSON_SPEED = 5;
const PERSON_SIZE = 30;
const PERSON_HIGHLIGHT = 3;

const STATUS_CHANGE_MIN = 2000;
const STATUS_CHANGE_MAX = 5000;

const HEALTHY = '#00AA00'; // Green
const INFECTED = '#FF0000'; // Red
const CURED = '#0000AA'; // Blue
const DEAD = '#888888'; // Gray
const HIGHLIGHT = '#FFFF00'; // Yellow
const DISTANCED = '#222222'; // Black

var people = [];
var stopFlag = true;

class Person {
  x;
  y;

  #headAngle;
  #highlightCount;
  socialDistanced;
  #status;
  get status() {
    return this.#status;
  }
  set status(newStatus) {
    if ([HEALTHY, INFECTED, CURED, DEAD].includes(newStatus)) {
      this.#status = newStatus;
    }
  }

  // Detect collision between two Person objects
  static collided(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return sqrt(dx * dx + dy * dy) < PERSON_SIZE;
  }

  constructor(socialDistancing = false, status = HEALTHY) {
    const sx = width * SPAWN_START;
    const ex = width * SPAWN_END;
    const sy = height * SPAWN_START;
    const ey = height * SPAWN_END;

    // Attempt assigning a position with no collision with others
    let attempt = 100;
    while (attempt-- > 0) {
      const tmpX = random(sx, ex);
      const tmpY = random(sy, ey);
      const tmp = { x: tmpX, y: tmpY };
      let noCollision = true;

      for (const p of people) {
        if (Person.collided(p, tmp)) {
          noCollision = false;
          break;
        }
      }

      if (noCollision) {
        this.x = tmpX;
        this.y = tmpY;
        break;
      }
    }

    this.status = status;

    this.#headAngle = random(0, 360);
    this.#highlightCount = 0;
    this.socialDistanced = socialDistancing;
  }

  advance() {
    if (this.socialDistanced || this.status === DEAD) {
      return;
    }

    // Check for border
    if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height) {
      this.#headAngle = (this.#headAngle + random(90, 110)) % 360;
    }

    this.x += PERSON_SPEED * cos(this.#headAngle);
    this.y += PERSON_SPEED * sin(this.#headAngle);
  }

  render() {
    // Render person
    fill(this.#status);
    circle(this.x, this.y, PERSON_SIZE);

    // Highlight people in yellow
    if (this.#highlightCount > 0) {
      noFill();
      stroke(HIGHLIGHT);
      strokeWeight(5);
      circle(this.x, this.y, PERSON_SIZE);
      noStroke();

      this.#highlightCount--;
    }
    // Mark people socially distanced
    else if (this.socialDistanced) {
      noFill();
      stroke(DISTANCED);
      strokeWeight(5);
      circle(this.x, this.y, PERSON_SIZE);
      noStroke();
    }
  }

  infect() {
    this.status = INFECTED;
    // An infected person will randomly be changed to `DEAD` or `CURED`
    setTimeout(() => {
      this.status = random(0, 1) < FATALITY ? DEAD : CURED;
    }, random(STATUS_CHANGE_MIN, STATUS_CHANGE_MAX));
  }

  startHighlight() {
    if (!this.socialDistanced) {
      this.#highlightCount = PERSON_HIGHLIGHT;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startAnimation() {
  const form = document.getElementById('initial-state-form');
  let i;
  for (i = 0; i < 6; i++) {
    if (form.elements[i].checked) {
      switch (i) {
        case 0:
          INITIALLY_INFECTED = 1;
          break;
        case 1:
          INITIALLY_INFECTED = 5;
          break;
        case 2:
          INITIALLY_INFECTED = 10;
          break;
        case 3:
          INITIALLY_DISTANCED = 0;
          break;
        case 4:
          INITIALLY_DISTANCED = 10;
          break;
        case 5:
          INITIALLY_DISTANCED = 50;
          break;
        case 6:
          FATALITY = 0.05;
          break;
        case 7:
          FATALITY = 0.1;
          break;
        case 8:
          FATALITY = 0.2;
          break;
      }
    }
    form.elements[i].disabled = true;
  }
  INITIALLY_HEALTHY = 50 - INITIALLY_DISTANCED;

  people = [];
  // Instantiate initial Person objects
  for (let i = 0; i < INITIALLY_DISTANCED; i++) {
    people.push(new Person(true, HEALTHY));
  }
  for (let i = 0; i < INITIALLY_HEALTHY + INITIALLY_INFECTED; i++) {
    people.push(new Person(false, HEALTHY));
  }

  // Initially infected people
  for (
    let i = INITIALLY_DISTANCED;
    i < INITIALLY_DISTANCED + INITIALLY_INFECTED;
    i++
  ) {
    people[i].infect();
  }

  form.disabled = true;

  stopFlag = false;
  redraw();
}

/***** p5.js functions *****/
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('p5-holder');
  randomSeed(second());
  angleMode(DEGREES);
  noStroke();
  noLoop();

  document.getElementById('initial-state-form').onsubmit = (event) => {
    noLoop();
    stopFlag = true;
    event.preventDefault();
    event.stopPropagation();
    const button = document.getElementById('start-button');
    button.disabled = true;
    startAnimation();
  };
}

async function draw() {
  while (true) {
    if (stopFlag) {
      return;
    }
    background(255);

    for (let i = 0; i < people.length; i++) {
      // Any `DEAD` person will remain fixed
      if (people[i].status !== DEAD) {
        people[i].advance();

        for (let j = 0; j < i; j++) {
          if (people[j].status === DEAD) {
            continue;
          }
          // Detect collision with previously rendered people
          if (Person.collided(people[i], people[j])) {
            people[i].startHighlight();
            people[j].startHighlight();

            if (people[i].status === HEALTHY && people[j].status === INFECTED) {
              people[i].infect();
            }

            if (people[i].status === INFECTED && people[j].status === HEALTHY) {
              people[j].infect();
            }
          }
        }
      }
      people[i].render();
    }
    await sleep(20);
  }
}
