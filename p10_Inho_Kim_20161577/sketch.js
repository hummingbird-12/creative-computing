const uiSketch = (p) => {
  const setupUI = () => {};

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(720, 125);
    p.frameRate(12);
    p.noStroke();
    p.background(255);
    p.noLoop();

    setupUI();
  };

  p.draw = () => {};
};

const mainSketch = (p) => {
  const CANVAS_WIDTH = 720;
  const CANVAS_HEIGHT = 480;

  const API_KEY = '41795463586b696d35376643544e72';
  const QUERY = '?GIGAN=2015';
  const URL = `http://openapi.seoul.go.kr:8088/${API_KEY}/xml/octastatapi262/1/5${QUERY}`;
  let data;

  /***** p5.js functions *****/

  p.preload = () => {
    data = p.loadJSON(URL);
    console.log(data);
  };

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.frameRate(4);
    p.noLoop();
    p.textStyle(p.BOLD);
    p.textSize(14);
  };

  p.draw = () => {};
};

const p5main = new p5(mainSketch, 'p5-canvas');
const p5ui = new p5(uiSketch, 'p5-ui');
