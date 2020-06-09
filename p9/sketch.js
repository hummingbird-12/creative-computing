const uiSketch = (p) => {
  const SENS_MIN = 10;
  const SENS_MAX = 130;
  const SENS_DEFAULT = 75;

  const CHALK_ALPHA = 200;
  const CHALK_DEF_R = 248;
  const CHALK_DEF_G = 180;
  const CHALK_DEF_B = 131;

  let sliderS;
  let sliderR;
  let sliderG;
  let sliderB;

  let buttonS;

  const setupUI = () => {
    sliderS = p.createSlider(SENS_MIN, SENS_MAX, SENS_DEFAULT);
    sliderS.id('sens-slider');
    sliderS.position(15, 35);

    sliderR = p.createSlider(0, 255, CHALK_DEF_R);
    sliderR.id('r-slider');
    sliderR.position(200, 35);

    sliderG = p.createSlider(0, 255, CHALK_DEF_G);
    sliderG.id('g-slider');
    sliderG.position(200, 55);

    sliderB = p.createSlider(0, 255, CHALK_DEF_B);
    sliderB.id('b-slider');
    sliderB.position(200, 75);

    buttonS = p.createButton('Save');
    buttonS.position(400, 30);
    buttonS.addClass('btn btn-info btn-sm');
    buttonS.mousePressed(() => {
      p5main.saveCanvas('blackboard.png');
    });
  };

  const drawUI = () => {
    p.textStyle(p.BOLD);
    p.fill(0);
    p.text(`Sensitivity: ${sliderS.value()}`, 15, 20);
    p.text('Chalk color (RGB)', 180, 20);
    p.fill(255, 0, 0);
    p.text('R', 180, 45);
    p.fill(0, 255, 0);
    p.text('G', 180, 65);
    p.fill(0, 0, 255);
    p.text('B', 180, 85);
  };

  p.getSensitivity = () => {
    return SENS_MAX - sliderS.value() + SENS_MIN;
  };

  p.getChalkColor = () => {
    return p.color(
      sliderR.value(),
      sliderG.value(),
      sliderB.value(),
      CHALK_ALPHA
    );
  };

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(720, 125);
    p.frameRate(12);
    p.noStroke();
    p.background(255);

    setupUI();
  };

  p.draw = () => {
    p.background(255);
    drawUI();
  };
};

const mainSketch = (p) => {
  const CANVAS_WIDTH = 720;
  const CANVAS_HEIGHT = 480;

  const BORDER_WIDTH = 20;

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

  let cam;
  let camConnected = false;
  let grayScale = [];

  const gradientMagnitude = (chalkColor) => {
    const EDGE_THRESHOLD = p5ui.getSensitivity();
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
          cam.pixels[j] = p.red(chalkColor);
          cam.pixels[j + 1] = p.green(chalkColor);
          cam.pixels[j + 2] = p.blue(chalkColor);
          cam.pixels[j + 3] = p.alpha(chalkColor);
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

    grayScale = [];

    for (let i = 0; i < cam.pixels.length; i += 4) {
      const R = cam.pixels[i];
      const G = cam.pixels[i + 1];
      const B = cam.pixels[i + 2];

      grayScale.push(R * R_WEIGHT + G * G_WEIGHT + B * B_WEIGHT);
    }
  };

  const drawBackground = () => {
    p.background('#77471f');
    p.fill('#41634b');
    p.rect(
      BORDER_WIDTH,
      BORDER_WIDTH,
      p.width - BORDER_WIDTH * 2,
      p.height - BORDER_WIDTH * 2
    );
  };

  /***** p5.js functions *****/

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.frameRate(4);
    p.noLoop();
    p.textStyle(p.BOLD);
    p.textSize(14);

    cam = p.createCapture(p.VIDEO, () => {
      camConnected = true;
      p.loop();
    });
    cam.hide();
  };

  p.draw = () => {
    if (!camConnected) {
      return;
    }
    cam.loadPixels();
    makeGrayScale();
    gradientMagnitude(p5ui.getChalkColor());
    cam.updatePixels();

    drawBackground();
    p.image(
      cam,
      BORDER_WIDTH,
      BORDER_WIDTH,
      p.width - BORDER_WIDTH * 2,
      p.height - BORDER_WIDTH * 2
    );
  };
};

const p5main = new p5(mainSketch, 'p5-canvas');
const p5ui = new p5(uiSketch, 'p5-ui');
