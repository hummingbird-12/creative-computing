const uiSketch = (p) => {
  let addBtn;
  let delBtn;
  let lSelect;
  let sSelect;

  let lineOpt = [];
  let stOpt = [];

  const setupUI = () => {
    lineOpt = Array.from(p5main.lineNames);
    lSelect = p.createSelect();
    for (const s of lineOpt.sort()) {
      lSelect.option(s);
    }
    lSelect.changed(updateStations);
    updateStations();

    addBtn = p.createButton('Add');
    addBtn.addClass('btn btn-info');
    addBtn.mousePressed(() => {
      p5main.addSelection(lSelect.value(), sSelect.value());
    });

    delBtn = p.createButton('Delete');
    delBtn.addClass('btn btn-danger');
    delBtn.mousePressed(() => {
      p5main.deleteSelection();
    });
  };

  const updateStations = () => {
    if (sSelect) {
      sSelect.remove();
    }

    stOpt = Array.from(p5main.stNames[lSelect.value()]);

    sSelect = p.createSelect();
    for (const s of stOpt.sort()) {
      sSelect.option(s);
    }

    p.redraw();
  };

  /***** p5.js functions *****/
  p.setup = () => {
    p.createCanvas(720, 100);
    p.noStroke();
    p.noLoop();
    p.textStyle(p.BOLD);
    p.textSize(18);

    setupUI();
  };

  p.draw = () => {
    p.background(255);

    p.text('Line:', 0, 25);
    lSelect.position(0, 35);

    p.text('Station:', 200, 25);
    sSelect.position(200, 35);

    addBtn.position(500, 25);
    delBtn.position(600, 25);
  };
};

const mainSketch = (p) => {
  const CANVAS_WIDTH = 720;
  const CANVAS_HEIGHT = 480;
  const LABEL_WIDTH = 150;

  let jdata;
  p.lineNames = new Set();
  p.stNames = {};
  let data = {};

  let selections = [];

  const getStationData = (line, station) => {
    if (data[line]) {
      return data[line][station];
    }
    return undefined;
  };

  p.addSelection = (line, station) => {
    if (selections.length >= 5) {
      return;
    }
    if (selections.find((s) => s.line === line && s.station === station)) {
      return;
    }

    selections.push({ line, station });
    selections.sort(
      (a, b) =>
        getStationData(b.line, b.station) - getStationData(a.line, a.station)
    );
    p.redraw();
  };

  p.deleteSelection = () => {
    selections.pop();
    p.redraw();
  };

  /***** p5.js functions *****/

  p.preload = () => {
    const API_KEY = '41795463586b696d35376643544e72';
    const API_DATE = '20200613';
    const URL = `https://cors-anywhere.herokuapp.com/http://openapi.seoul.go.kr:8088/${API_KEY}/json/CardSubwayStatsNew/1/1000/${API_DATE}`;
    // jdata = p.loadJSON(URL);

    jdata = p.loadJSON('data.json');
  };

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.noLoop();
    p.textStyle(p.BOLD);
    p.textSize(16);

    jdata.DATA.forEach((d) => {
      if (!data[d.line_num]) {
        data[d.line_num] = {};
        p.lineNames.add(d.line_num);
        p.stNames[d.line_num] = new Set();
      }

      if (!p.stNames[d.line_num].has(d.sub_sta_nm)) {
        data[d.line_num][d.sub_sta_nm] = 0;
      }
      data[d.line_num][d.sub_sta_nm] += d.ride_pasgr_num;
      p.stNames[d.line_num].add(d.sub_sta_nm);
    });

    p5ui = new p5(uiSketch, 'p5-ui');

    p.addSelection('2호선', '신촌');
    p.addSelection('6호선', '대흥(서강대앞)');
    p.addSelection('2호선', '홍대입구');
  };

  p.draw = () => {
    p.background(255);

    const sData = selections.map((s) => getStationData(s.line, s.station));
    const mx = p.max(sData);
    const mn = selections.length > 1 ? p.min(sData) : 0;

    for (const [index, value] of selections.entries()) {
      const c = p.color(0, 255, 0);
      c.setRed(p.map(sData[index], mn, mx, 0, 255, false));
      c.setGreen(p.map(-sData[index], -mx, -mn, 0, 255, false));

      p.fill(0);
      p.text(value.line, 0, 30 + index * 100);
      p.text(value.station, 0, 55 + index * 100);

      p.fill(c);
      p.rect(
        LABEL_WIDTH,
        index * 100,
        p.map(sData[index], mn, mx, 30, p.width - LABEL_WIDTH, false),
        75
      );
    }
  };
};

const p5main = new p5(mainSketch, 'p5-canvas');
let p5ui;
