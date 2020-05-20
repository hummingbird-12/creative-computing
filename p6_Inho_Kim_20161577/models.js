class Shape {
  constructor(x, y, size, fill, renderer) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fill = fill;
    this.renderer = renderer;
  }

  render(p) {
    p.fill(this.fill);
    this.renderer(p, this.x, this.y, this.size);
  }

  static getDifference(p, from, to) {
    const diff = {
      x: to.x - from.x,
      y: to.y - from.y,
      size: to.size - from.size,
      fill: {
        red: p.red(to.fill) - p.red(from.fill),
        green: p.green(to.fill) - p.green(from.fill),
        blue: p.blue(to.fill) - p.blue(from.fill),
        alpha: p.alpha(to.fill) - p.alpha(from.fill),
      },
    };

    return diff;
  }
}

class Frame {
  constructor(background) {
    this.background = background;
    this.shapes = [];
  }

  addShape(shape) {
    this.shapes.push(shape);
  }

  render(p) {
    p.background(this.background);
    this.shapes.forEach((s) => s.render(p));
  }

  setBackground(color) {
    this.background = color;
  }
}

class KeyFrame extends Frame {
  constructor(background) {
    super(background);
  }

  static getDifference(p, from, to, steps) {
    const bckDiff = {
      red: p.red(to.background) - p.red(from.background),
      green: p.green(to.background) - p.green(from.background),
      blue: p.blue(to.background) - p.blue(from.background),
      alpha: p.alpha(to.background) - p.alpha(from.background),
    };
    const shapeDiffs = from.shapes.map((s, i) =>
      Shape.getDifference(p, s, to.shapes[i])
    );

    const frames = [];
    frames.push(from);
    for (let step = 1; step < steps; step++) {
      const background = p.color(0);
      background.setRed(
        p.map(
          step,
          0,
          steps,
          p.red(from.background),
          p.red(from.background) + bckDiff.red
        )
      );
      background.setGreen(
        p.map(
          step,
          0,
          steps,
          p.green(from.background),
          p.green(from.background) + bckDiff.green
        )
      );
      background.setBlue(
        p.map(
          step,
          0,
          steps,
          p.blue(from.background),
          p.blue(from.background) + bckDiff.blue
        )
      );
      background.setAlpha(
        p.map(
          step,
          0,
          steps,
          p.alpha(from.background),
          p.alpha(from.background) + bckDiff.alpha
        )
      );

      const frame = new Frame(background);
      for (let i = 0; i < from.shapes.length; i++) {
        const x = p.map(
          step,
          0,
          steps,
          from.shapes[i].x,
          from.shapes[i].x + shapeDiffs[i].x
        );
        const y = p.map(
          step,
          0,
          steps,
          from.shapes[i].y,
          from.shapes[i].y + shapeDiffs[i].y
        );
        const size = p.map(
          step,
          0,
          steps,
          from.shapes[i].size,
          from.shapes[i].size + shapeDiffs[i].size
        );
        const fill = p.color(0);
        fill.setRed(
          p.map(
            step,
            0,
            steps,
            p.red(from.shapes[i].fill),
            p.red(from.shapes[i].fill) + shapeDiffs[i].fill.red
          )
        );
        fill.setGreen(
          p.map(
            step,
            0,
            steps,
            p.green(from.shapes[i].fill),
            p.green(from.shapes[i].fill) + shapeDiffs[i].fill.green
          )
        );
        fill.setBlue(
          p.map(
            step,
            0,
            steps,
            p.blue(from.shapes[i].fill),
            p.blue(from.shapes[i].fill) + shapeDiffs[i].fill.blue
          )
        );
        fill.setAlpha(
          p.map(
            step,
            0,
            steps,
            p.alpha(from.shapes[i].fill),
            p.alpha(from.shapes[i].fill) + shapeDiffs[i].fill.alpha
          )
        );

        const shape = new Shape(x, y, size, fill, from.shapes[i].renderer);
        frame.addShape(shape);
      }
      frames.push(frame);
    }
    frames.push(to);

    return frames;
  }
}

export { Shape, Frame, KeyFrame };
