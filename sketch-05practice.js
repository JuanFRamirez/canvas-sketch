const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
};
let manager;

let imageHolder;

const url = "assets/kardashev.jpg";

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = url;
    imageHolder = image;
  });
};

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = async ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.drawImage(imageHolder, 0, 0, cols, rows);

    fontSize = cols * 1.2;
    //typeContext.fillStyle = 'white';
    //typeContext.font = `${fontSize}px serif`;
    //typeContext.textBaseline = 'top';

    const metrics = typeContext.measureText(imageHolder);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";
    context.drawImage(typeCanvas, 0, 0);

    console.log(numCells);
    console.log(typeData);

    for (let i = 0; i < typeData.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);
      const glyph2 = getGlyph(g);
      const glyph3 = getGlyph(b);

      context.font = `${cell * 2}px serif`;
      if (Math.random() < 0.1) context.font = `${cell * 1.2}px serif`;

      const grd = context.createLinearGradient(140,100,200,0);
      grd.addColorStop(0,"yellow");
      grd.addColorStop(1,"red");

      context.fillStyle = grd;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      // context.fillRect(0, 0, cell, cell);

      context.fillText(glyph, 0, 0);
      context.fillText(glyph2, 0, 0);

      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return "";
  if (v < 100) return ".";
  if (v < 150) return "-";
  if (v < 200) return "+";

  const glyphs = "□■l o".split("");

  return random.pick(glyphs);
};

const start = async () => {
  const img = await loadImage(url);
  console.log(img + imageHolder);
  manager = await canvasSketch(sketch, settings);
};

start();
