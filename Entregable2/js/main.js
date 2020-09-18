//parametros del juego
const GRID_CIRCLE = 0.7; //fraccion de la celda
const GRID_COLS = 7;
const GRID_ROWS = 6;
const MARGIN = 0.02; //fraccion de el tamaño mas corto de pantalla

const COLOR_BACKGROUND = "mintcream";
const COLOR_COMP = "red";
const COLOR_COMP_DARk = "darkred";
const COLOR_FRAME = "dodgerblue";
const COLOR_FRAME_BUTT = "royalblue";
const COLOR_PLAY = "yellow";
const COLOR_PLAY_DRK = "olive";

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

let gameove, grid = [], playersTurn;

let height, width, margin;
setDimensions();

canv.addEventListener("mousemove", highlightGrid);
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
  drawGrid();

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

function drawGrid() {
  let cell = grid[0][0];
  let fh = cell.h * GRID_ROWS;
  let fw = cell.w * GRID_COLS;
  ctx.fillStyle = COLOR_FRAME;
  ctx.fillRect(cell.left, cell.top, fw, fh);
  ctx.fillStyle = COLOR_FRAME_BUTT;
  ctx.fillRect(cell.left - margin / 2, cell.top + fh - margin / 2, fw + margin, margin);

  // cells
  for (let row of grid) {
      for (let cell of row) {
          cell.draw(ctx);
      }
  }
}

function highlightCell(x, y) {
  let col = null;
  for (let row of grid) {
      for (let cell of row) {

          //clear
          cell.highlight = null;

          if (cell.contains(x, y)) {
              col = cell.col;
          }
      }
  }

  if (col == null) {
      return;
  }

  for (let i = GRID_ROWS - 1; i >= 0; i--) {
      if (grid[i][col].owner == null) {
          grid[i][col].highlight = playersTurn;
          return grid[i][col];
      }
  }
  return null;
}

function highlightGrid(e) {
  if (!playersTurn || gameOver) {
      return;
  }
  highlightCell(e.clientX, e.clientY);
}


function newGame() {
  playersTurn = Math.random() < 0.5;
  gameOver = false;
  gameTied = false;
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