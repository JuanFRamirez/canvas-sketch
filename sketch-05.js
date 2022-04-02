const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

let text = "A";
let skull = new Image();
skull.src = 'https://images.unsplash.com/photo-1553610074-8c838fa2e56e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2674&q=80'
let fontStyle = "serif";
let fontSize = 1200;

let manager;
const settings = {
  dimensions: [1080, 1080],
};

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px ${fontStyle}`;
    typeContext.textBaseline = "top";

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    //context.textAlign = 'center';
    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;


    context.fillStyle="black";
    context.fillRect(0,0,width,height);

    context.textBaseline='middle';
    context.textAlign = 'center';

    context.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cell;
      const y = row * cell;

      const rValueOfRGBA = typeData[i * 4];
      const gValueOfRGBA = typeData[i * 4 + 1];
      const bValueOfRGBA = typeData[i * 4 + 2];
      const aValueOfRGBA = typeData[i * 4 + 3];

      const glyph = getGlyph(rValueOfRGBA);

      context.font = `${cell*2}px ${fontStyle}`;
      if(Math.random() < 0.1)context.font = `${cell*6}px ${fontStyle}`;

      context.fillStyle = 'white';

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      //context.fillRect(0, 0, cell, cell);
     context.fillText(glyph,0,0)
      context.restore();
    }
  };
};
const getGlyph = (value)=>{
if(value < 50) return'';
if(value < 100) return '.';
if(value < 150) return '-';
if(value < 200) return'+';

const glyps = '_= /'.split('');

return random.pick(glyps);


}
const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
};

document.addEventListener("keyup", onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
