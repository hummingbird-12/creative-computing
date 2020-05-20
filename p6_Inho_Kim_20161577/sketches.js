import { KeyFrame, Shape } from './models.js';

const keyFrameSketch = (p) => {
  p.draft;
  p.draftAdded = false;

  p.clearDraft = () => {
    p.draftAdded = false;
  };

  p.commitDraft = () => {
    p.keyFrame.addShape(p.draft);
    p.clearDraft();
  };

  p.setBackground = (color) => {
    p.keyFrame.setBackground(color);
    p.keyFrame.render(p);
  };

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    p.noStroke();

    p.keyFrame = new KeyFrame(p.color('#FFFFFF'));
  };

  p.draw = () => {
    p.keyFrame.render(p);

    if (p.draftAdded) {
      p.draft.render(p);
    } else {
      const cursor = p5ui.getCursorState();
      p.fill(cursor.fill);
      switch (cursor.type) {
        case 'Circle':
          p.circle(p.mouseX, p.mouseY, cursor.size);
          break;
        case 'Square':
          p.square(p.mouseX, p.mouseY, cursor.size);
          break;
      }
    }
  };

  p.mouseClicked = () => {
    if (
      p.mouseX < 0 ||
      p.width <= p.mouseX ||
      p.mouseY < 0 ||
      p.height <= p.mouseY ||
      p.draftAdded
    ) {
      return;
    }
    const cursor = p5ui.getCursorState();
    let renderer;
    switch (cursor.type) {
      case 'Circle':
        renderer = (p, x, y, size) => {
          p.circle(x, y, size);
        };
        break;
      case 'Square':
        renderer = (p, x, y, size) => {
          p.square(x, y, size);
        };
        break;
    }
    p.draft = new Shape(p.mouseX, p.mouseY, cursor.size, cursor.fill, renderer);
    p.draftAdded = true;

    return false;
  };
};

const uiSketch = (p) => {
  const backgroundLabel = 'Background color';
  const backgroundPrompt = 'Select canvas';
  const frameRateLabel = 'Frame rate';
  const shapePrompt = 'Add shape';
  const shapeColorLabel = 'Shape color';
  const shapeSizeLabel = 'Shape size';
  const shapeTypeLabel = 'Shape type';
  const stepLabel = 'Step size';

  let backgroundPicker;
  let backgroundRadio;
  let frameRateSlider;
  let loopCheck;
  let shapeAddButton;
  let shapeCancelButton;
  let shapeColorPicker;
  let shapeSizeSlider;
  let shapeTypeSelect;
  let stepSlider;

  const domSetup = () => {
    const container = document.getElementById('canvas-container');
    container.setAttribute('style', `height: calc(100% - ${uiHeight}px);`);
  };

  const frameUI = () => {
    stepSlider = p.createSlider(1, 30, 15, 1);
    stepSlider.addClass('form-control-range');
    stepSlider.position(20, 40);

    frameRateSlider = p.createSlider(1, 20, 10, 1);
    frameRateSlider.addClass('form-control-range');
    frameRateSlider.position(20, 110);
  };

  const backgroundUI = () => {
    backgroundPicker = p.createColorPicker('#FFFFFF');
    backgroundPicker.position(200, 40);

    backgroundRadio = p.createRadio();
    const option1 = new p5.Element(backgroundRadio.option('from'));
    const option2 = new p5.Element(backgroundRadio.option('to'));
    option1.style('margin-right', '0.5rem');
    option2.style('margin-right', '0.5rem');
    option2.style('margin-left', '1.5rem');
    backgroundRadio.selected('from');
    backgroundRadio.position(200, 110);

    const bckBtn = p.createButton('Apply');
    bckBtn.mouseReleased(() => {
      const c = backgroundPicker.color();
      if (backgroundRadio.value() === 'from') {
        p5from.setBackground(c);
      } else if (backgroundRadio.value() === 'to') {
        p5to.setBackground(c);
      }
    });
    bckBtn.addClass('btn btn-info btn-sm');
    bckBtn.position(340, 110);
  };

  const shapeUI = () => {
    shapeTypeSelect = p.createSelect();
    shapeTypeSelect.option('Circle');
    shapeTypeSelect.option('Square');
    shapeTypeSelect.selected('Circle');
    shapeTypeSelect.addClass('form-control');
    shapeTypeSelect.position(600, 40);

    shapeColorPicker = p.createColorPicker('#000000');
    shapeColorPicker.position(600, 110);

    shapeSizeSlider = p.createSlider(5, 100, 25, 1);
    shapeSizeSlider.addClass('form-control-range');
    shapeSizeSlider.position(800, 40);

    shapeAddButton = p.createButton('Add');
    shapeAddButton.mouseReleased(() => {
      p5from.commitDraft();
      p5to.commitDraft();
      shapeAddButton.attribute('disabled', '');
      shapeCancelButton.attribute('disabled', '');
      shapeTypeSelect.removeAttribute('disabled');
    });
    shapeAddButton.addClass('btn btn-info btn-sm');
    shapeAddButton.attribute('disabled', '');
    shapeAddButton.position(800, 90);

    shapeCancelButton = p.createButton('Cancel');
    shapeCancelButton.mouseReleased(() => {
      p5from.clearDraft();
      p5to.clearDraft();
      shapeAddButton.attribute('disabled', '');
      shapeCancelButton.attribute('disabled', '');
      shapeTypeSelect.removeAttribute('disabled');
    });
    shapeCancelButton.addClass('btn btn-danger btn-sm');
    shapeCancelButton.attribute('disabled', '');
    shapeCancelButton.position(850, 90);
  };

  const renderUI = () => {
    p.background(255);
    p.fill(0);
    p.textSize(16);

    frameUI();
    backgroundUI();
    shapeUI();

    loopCheck = p.createCheckbox('Loop', false);
    loopCheck.position(1000, 50);

    const renderBtn = p.createButton('Render');
    renderBtn.mouseReleased(() => {
      p5result.startRender({
        frameRate: frameRateSlider.value(),
        stepSize: stepSlider.value(),
      });
    });
    renderBtn.addClass('btn btn-primary');
    renderBtn.position(1000, p.height / 2);
  };

  p.getCursorState = () => ({
    fill: shapeColorPicker.color(),
    size: shapeSizeSlider.value(),
    type: shapeTypeSelect.value(),
  });

  p.isLoop = () => {
    return loopCheck.checked();
  };

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(uiWdith, uiHeight);
    p.frameRate(10);
    p.noStroke();

    domSetup();
    renderUI();
  };

  p.draw = () => {
    p.background(255);
    p.text(`${stepLabel}: ${stepSlider.value()}`, 20, 30);
    p.text(`${frameRateLabel}: ${frameRateSlider.value()}`, 20, 100);

    p.text(
      `${backgroundLabel}: ${backgroundPicker.value().toUpperCase()}`,
      200,
      30
    );
    p.text(`${backgroundPrompt}:`, 200, 100);

    p.text(`${shapePrompt}:`, 450, p.height / 2);

    p.text(`${shapeTypeLabel}:`, 600, 30);
    p.text(
      `${shapeColorLabel}: ${shapeColorPicker.value().toUpperCase()}`,
      600,
      100
    );

    p.text(`${shapeSizeLabel}: ${shapeSizeSlider.value()}`, 800, 30);

    if (p5from.draftAdded || p5to.draftAdded) {
      shapeCancelButton.removeAttribute('disabled');
      shapeTypeSelect.attribute('disabled', '');
      if (p5from.draftAdded && p5to.draftAdded) {
        shapeAddButton.removeAttribute('disabled');
      }
    }
  };
};

const resultSketch = (p) => {
  let frames = [];
  let framesSave = [];

  p.startRender = (state) => {
    p.frameRate(state.frameRate);

    p.background(255);
    frames = KeyFrame.getDifference(
      p,
      p5from.keyFrame,
      p5to.keyFrame,
      state.stepSize
    );
    framesSave = [];
    p.loop();
  };

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    p.noLoop();
    p.frameRate(5);
    p.noStroke();
    p.background(255);
  };

  p.draw = () => {
    if (frames.length === 0) {
      if (p5ui.isLoop()) {
        while (framesSave.length > 0) {
          frames.push(framesSave.shift());
        }
        return;
      }
      p.noLoop();
      return;
    }
    frames[0].render(p);
    framesSave.push(frames.shift());
  };
};

const p5from = new p5(keyFrameSketch, 'p5-from');
const p5to = new p5(keyFrameSketch, 'p5-to');
const p5ui = new p5(uiSketch, 'p5-ui');
const p5result = new p5(resultSketch, 'p5-result');
