const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;
const UI_HEIGHT = 200;

const uiSketch = (p) => {
  const FIRST_COL = 20;
  const SECOND_COL = 250;
  const THIRD_COL = 555;

  const SENS_MIN = 10;
  const SENS_MAX = 130;
  const SENS_DEFAULT = 75;

  let rowSlider;
  let colSlider;
  let applyBtn;

  let edgeColorPicker;
  let bckColorPicker;
  let sensSlider;

  let undoBtn;
  let clearBtn;
  let captureBtn;
  let saveBtn;

  const createUI = () => {
    rowSlider = p.createSlider(1, 4, 2);
    rowSlider.position(FIRST_COL, 45);

    colSlider = p.createSlider(2, 4, 2);
    colSlider.position(FIRST_COL, 110);

    applyBtn = p.createButton('Apply');
    applyBtn.class('btn btn-info');
    applyBtn.mousePressed(() => {
      p5main.rows = rowSlider.value();
      p5main.cols = colSlider.value();
      p5main.resetCanvas();
    });
    applyBtn.position(FIRST_COL + 70, 150);

    edgeColorPicker = p.createColorPicker(p.color('black'));
    edgeColorPicker.input(() => {
      p5main.edgeColor = edgeColorPicker.color();
    });
    edgeColorPicker.position(SECOND_COL + 175, 15);

    bckColorPicker = p.createColorPicker(p.color('white'));
    bckColorPicker.input(() => {
      p5main.bckColor = bckColorPicker.color();
    });
    bckColorPicker.position(SECOND_COL + 175, 45);

    sensSlider = p.createSlider(SENS_MIN, SENS_MAX, SENS_DEFAULT);
    sensSlider.input(() => {
      p5main.sensitivity = SENS_MAX - sensSlider.value() + SENS_MIN;
    });
    sensSlider.position(SECOND_COL, 110);

    undoBtn = p.createButton('Undo');
    undoBtn.class('btn btn-secondary');
    undoBtn.mousePressed(() => {
      p5main.undoCapture();
    });
    undoBtn.position(THIRD_COL, 15);

    clearBtn = p.createButton('Clear');
    clearBtn.class('btn btn-danger');
    clearBtn.mousePressed(() => {
      p5main.resetCanvas();
    });
    clearBtn.position(THIRD_COL + 75, 15);

    captureBtn = p.createButton('Capture!');
    captureBtn.class('btn btn-info');
    captureBtn.mousePressed(() => {
      p5main.captureImage();
    });
    captureBtn.position(THIRD_COL, 65);

    saveBtn = p.createButton('Save Image');
    saveBtn.class('btn btn-primary');
    saveBtn.mousePressed(() => {
      p5main.saveImage();
    });
    saveBtn.position(THIRD_COL, 150);
  };

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, UI_HEIGHT);
    p.noStroke();
    p.frameRate(5);
    p.textStyle(p.BOLD);
    p.textSize(18);

    createUI();
  };

  p.draw = () => {
    p.clear();
    p.background(255, 255, 255, 150);

    p.text(`Rows: ${rowSlider.value()}`, FIRST_COL, 35);
    p.text(`Columns: ${colSlider.value()}`, FIRST_COL, 100);
    p.text(`Edge color:`, SECOND_COL, 35);
    p.text(`Background color:`, SECOND_COL, 65);
    p.text(`Sensitivity: ${sensSlider.value()}`, SECOND_COL, 100);
    p.text(`Or press space`, THIRD_COL, 125);
  };
};

const mainSketch = (p) => {
  const SOBEL_X = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const SOBEL_Y = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
  ];

  let captureCount = 0;
  let cam;
  let timer = 0;

  p.rows;
  p.cols;
  p.edgeColor;
  p.bckColor;
  p.sensitivity;

  const gradientMagnitude = (grayScale) => {
    const EDGE_THRESHOLD = p.sensitivity;
    const KERNEL_RADIUS = p.floor(SOBEL_X.length / 2);

    const G = new Array(grayScale.length);
    const Gx = new Array(grayScale.length);
    const Gy = new Array(grayScale.length);

    const convolution = (row, col) => {
      const i = row * cam.width + col;

      for (let k = -KERNEL_RADIUS; k <= KERNEL_RADIUS; k++) {
        if (row < -k || row + k >= cam.height) {
          continue;
        }
        for (let l = -KERNEL_RADIUS; l <= KERNEL_RADIUS; l++)
          if (col >= -l && col + l < cam.width) {
            Gx[i] +=
              grayScale[(row + k) * cam.width + (col + l)] *
              SOBEL_X[k + KERNEL_RADIUS][l + KERNEL_RADIUS];
            Gy[i] +=
              grayScale[(row + k) * cam.width + (col + l)] *
              SOBEL_Y[k + KERNEL_RADIUS][l + KERNEL_RADIUS];
          }
      }
    };

    for (let i = 0; i < grayScale.length; i++) {
      Gx[i] = Gy[i] = 0;
    }

    for (let r = 0; r < cam.height; r++) {
      for (let c = 0; c < cam.width; c++) {
        const i = r * cam.width + c;
        const j = i * 4;

        // Convolution for pixel at position (r, c)
        convolution(r, c);

        // Gradient magnitude
        G[i] = p.sqrt(Gx[i] * Gx[i] + Gy[i] * Gy[i]);

        // If edge detected
        if (G[i] > EDGE_THRESHOLD) {
          // Set pixel to the color set by the sliders
          cam.pixels[j] = p.red(p.edgeColor);
          cam.pixels[j + 1] = p.green(p.edgeColor);
          cam.pixels[j + 2] = p.blue(p.edgeColor);
          cam.pixels[j + 3] = p.alpha(p.edgeColor);
        }
        // If edge NOT detected
        else {
          // Make the pixel transparent
          cam.pixels[j + 3] = 0;
        }
      }
    }
  };

  const makeGrayScale = () => {
    const R_WEIGHT = 0.299;
    const G_WEIGHT = 0.587;
    const B_WEIGHT = 0.114;

    const grayScale = [];

    for (let i = 0; i < cam.pixels.length; i += 4) {
      const R = cam.pixels[i];
      const G = cam.pixels[i + 1];
      const B = cam.pixels[i + 2];

      grayScale.push(R * R_WEIGHT + G * G_WEIGHT + B * B_WEIGHT);
    }

    return grayScale;
  };

  const detectEdges = () => {
    cam.loadPixels();
    const grayScale = makeGrayScale();
    gradientMagnitude(grayScale);
    cam.updatePixels();
  };

  const currentRow = () => {
    return p.floor(captureCount / p.cols);
  };

  const currentCol = () => {
    return p.floor(captureCount % p.cols);
  };

  const pieceWidth = () => {
    return p.width / p.cols;
  };

  const pieceHeight = () => {
    return p.height / p.rows;
  };

  p.resetCanvas = () => {
    p.noLoop();

    p.background(255);
    captureCount = 0;

    p.loop();
  };

  p.captureImage = () => {
    const TIMEOUT = 3;

    const countDown = (i) => {
      setTimeout(() => {
        timer--;
        if (i > 1) {
          countDown(i - 1);
        } else {
          setTimeout(() => {
            p.noLoop();
            captureCount++;

            if (captureCount < p.rows * p.cols) {
              p.loop();
            }
          }, 100);
        }
      }, 1000);
    };
    timer = TIMEOUT;
    countDown(TIMEOUT);
  };

  p.undoCapture = () => {
    p.noLoop();
    p.push();
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.fill('white');
    p.rect(
      currentCol() * pieceWidth(),
      currentRow() * pieceHeight(),
      pieceWidth(),
      pieceHeight()
    );
    p.pop();
    captureCount = p.max(0, captureCount - 1);
    p.loop();
  };

  p.saveImage = () => {
    p.saveCanvas('canvas', 'png');
  };

  /***** p5.js functions *****/
  p.preload = () => {
    cam = p.createCapture(p.VIDEO);
  };

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.noStroke();
    p.textStyle(p.BOLD);
    p.textSize(16);
    p.fill(255);
    p.frameRate(12);
    p.background(255);

    cam.hide();

    p.rows = 2;
    p.cols = 2;
    p.edgeColor = p.color('black');
    p.bckColor = p.color('white');
    p.sensitivity = 65;
  };

  p.draw = () => {
    detectEdges();

    p.push();
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.fill(p.bckColor);
    p.rect(
      currentCol() * pieceWidth(),
      currentRow() * pieceHeight(),
      pieceWidth(),
      pieceHeight()
    );
    p.image(
      cam,
      currentCol() * pieceWidth(),
      currentRow() * pieceHeight(),
      pieceWidth(),
      pieceHeight()
    );

    if (timer > 0) {
      let num = '';
      for (let i = 0; i < timer; i++) {
        num += 'I';
      }
      p.push();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(255, 0, 0);
      p.text(
        `${num}`,
        currentCol() * pieceWidth(),
        currentRow() * pieceHeight(),
        pieceWidth(),
        pieceHeight()
      );
      p.pop();
    }
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === ' ') {
      p.captureImage();
    }
  };
};

const p5main = new p5(mainSketch, 'p5-canvas');
const p5ui = new p5(uiSketch, 'p5-ui');
