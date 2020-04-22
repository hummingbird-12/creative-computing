const RANDOM_UPPER_BOUND = 5;
const NEW_STONE = -1;
const BLACK_STONE = 0;
const WHITE_STONE = 1;

let GRID_ROWS;
let GRID_COLS;
let grid = [];
let gridSize = 55;
let whiteTurn = true;

// makes and fills the `grid` array with the given `gridSize`
function makeGrid() {
  GRID_ROWS = ceil(height / gridSize);
  GRID_COLS = ceil(width / gridSize);

  grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    grid.push([]);
    for (let col = 0; col < GRID_COLS; col++) {
      grid[row].push(floor(random(RANDOM_UPPER_BOUND)));
    }
  }
  whiteTurn = true;
  loop();
}

function putStone(row, col) {
  const withinGrid = (_row, _col) => {
    return _row >= 0 && _row < GRID_ROWS && _col >= 0 && _col < GRID_COLS;
  };

  // check if is a valid position and is empty
  if (!withinGrid(row, col) || grid[row][col] < 2) {
    return;
  }

  const DIRECTIONS = [
    [-1, 0], // upwards
    [0, 1], // rightwards
    [1, 0], // downwards
    [0, -1], // leftwards
  ];

  grid[row][col] = whiteTurn ? WHITE_STONE : NEW_STONE;
  for (const direction of DIRECTIONS) {
    const targets = [];
    let newRow = row + direction[0];
    let newCol = col + direction[1];

    // while is a valid position and is opponent stone
    while (
      withinGrid(newRow, newCol) &&
      grid[newRow][newCol] === (whiteTurn ? BLACK_STONE : WHITE_STONE)
    ) {
      targets.push([newRow, newCol]);
      newRow += direction[0];
      newCol += direction[1];
    }

    // if valid position and is current turn's stone
    if (
      withinGrid(newRow, newCol) &&
      grid[newRow][newCol] === (whiteTurn ? WHITE_STONE : BLACK_STONE)
    ) {
      // change the opponent's stones
      for (const target of targets) {
        grid[target[0]][target[1]] = whiteTurn ? WHITE_STONE : BLACK_STONE;
      }
    }
  }
  loop();

  if (whiteTurn) {
    const empty = findEmptySpot();

    // if it was white's turn and there's empty spot, do black's turn after 1 second
    if (empty) {
      setTimeout(() => {
        putStone(empty.row, empty.col);
      }, 1000);
    }
  }
  whiteTurn = !whiteTurn;
}

function findEmptySpot() {
  const spots = [];
  // find all empty spots
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (grid[row][col] >= 2) {
        spots.push([row, col]);
      }
    }
  }

  if (spots.length === 0) {
    return undefined;
  }
  const randomSpot = spots[floor(random(spots.length))];
  return { row: randomSpot[0], col: randomSpot[1] };
}

/***** p5.js functions *****/

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('p5-holder');
  ellipseMode(CORNER);
  randomSeed(second());

  makeGrid();
}

function draw() {
  noLoop();
  background('#DB712A');

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      // vertical line
      line(
        (col + 0.5) * gridSize,
        row * gridSize,
        (col + 0.5) * gridSize,
        (row + 1) * gridSize
      );
      // horizontal line
      line(
        col * gridSize,
        (row + 0.5) * gridSize,
        (col + 1) * gridSize,
        (row + 0.5) * gridSize
      );
      // stones
      switch (grid[row][col]) {
        case BLACK_STONE:
          fill(0);
          circle(col * gridSize, row * gridSize, gridSize);
          break;
        case WHITE_STONE:
          fill(255);
          circle(col * gridSize, row * gridSize, gridSize);
          break;
        case NEW_STONE:
          push();
          stroke('#FFFF00');
          strokeWeight(7);
          fill(0);
          circle(col * gridSize, row * gridSize, gridSize);
          pop();
          grid[row][col] = BLACK_STONE;
          break;
      }
    }
  }
}

function mousePressed(event) {
  // if white's turn and mouse wheel button pressed
  if (whiteTurn && event.button === 1) {
    const col = floor(mouseX / gridSize);
    const row = floor(mouseY / gridSize);
    putStone(row, col);
  }
  return false;
}

function mouseWheel(event) {
  gridSize -= event.delta / 10;
  gridSize = max(gridSize, 25);
  gridSize = min(gridSize, 105);
  makeGrid();

  return false;
}
