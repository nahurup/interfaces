//parametros del juego
const GRID_CIRCLE = 0.7; //fraccion de la celda
const GRID_COLS = 7;
const GRID_ROWS = 6;
const MARGIN = 0.02; //fraccion de el tamaño mas corto de pantalla

const COLOR_BACKGROUND = "mintcream";
const COLOR_FRAME = "dodgerblue";

class Cell {
  constructor(left, top, w, h, row, col) {
      this.bot = top + h;
      this.left = left;
      this.right = left + w;
      this.top = top;
      this.w = w;
      this.h = h;
      this.row = row;
      this.col = col;
      this.cx = left + w / 2;
      this.cy = top + h / 2;
      this.r = w * GRID_CIRCLE / 2;
      this.highlight = null;
      this.owner = null;
      this.winner = false;
  }

  contains(x, y) {
      return x > this.left && x < this.right && y > this.top && y < this.bot;
  }

  // draw the circle or hole
  draw(/** @type {CanvasRenderingContext2D} */ ctx) {

      // owner colour
      let color = this.owner == null ? COLOR_BACKGROUND : this.owner ? COLOR_PLAY : COLOR_COMP;

      // draw the circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
      ctx.fill();

      // draw highlighting
      if (this.winner || this.highlight != null) {
          
          // colour
          color = this.winner ? COLOR_WIN : this.highlight ? COLOR_PLAY : COLOR_COMP;

          // draw a circle around the perimeter
          ctx.lineWidth = this.r / 4;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
          ctx.stroke();
      }
  }
}

let canv = document.getElementById("canvasMain");
let ctx = canv.getContext("2d");

let grid = [];

let height, width, margin;
setDimensions();

window.addEventListener("resize", setDimensions);

//loop
let timeDelta, timeLast;
requestAnimationFrame(loop);

function loop(timeNow) {
  if(!timeLast) {
    timeLast = timeNow;
  }

  timeDelta = (timeNow - timeLast) / 1000; //segundos
  timeLast = timeNow;

  //update

  //
  drawBackground();

  //call the next frame
  requestAnimationFrame(loop);
}

function createGrid() {
  grid = [];

  // set up cell size and margins
  let cell, marginX, marginY;

  // portrait
  if ((width - margin * 2) * GRID_ROWS / GRID_COLS < height - margin * 2) {
      cell = (width - margin * 2) / GRID_COLS;
      marginX = margin;
      marginY = (height - cell * GRID_ROWS) / 2;
  }

  // landscape
  else {
      cell = (height - margin * 2) / GRID_ROWS;
      marginX = (width - cell * GRID_COLS) / 2;
      marginY = margin;
  }

  // populate the grid
  for (let i = 0; i < GRID_ROWS; i++) {
      grid[i] = [];
      for (let j = 0; j < GRID_COLS; j++) {
          let left = marginX + j * cell;
          let top = marginY + i * cell;
          grid[i][j] = new Cell(left, top, cell, cell, i, j);
      }
  }
}

function drawBackground() {
  ctx.fillStyle= COLOR_BACKGROUND;
  ctx.fillRect(0, 0, width, height);
}

function newGame() {
  createGrid();
}

function setDimensions() {
  height = window.innerHeight;
  width = window.innerWidth;
  canv.height = height;
  canv.width = width;
  margin = MARGIN * Math.min(height, width);
  newGame();
}