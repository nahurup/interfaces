let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d');
let grid = document.querySelector("#grid");
let ctxGrid = grid.getContext('2d');

let dx=[ 1,-1, 0, 0, 1,-1, 1,-1];
let dy=[ 0, 0, 1,-1,-1, 1, 1,-1];

let cell = 100;
let halfCell = cell / 2;
cell.height = cell * 7;
cell.width = cell * 7;
canvas.height = cell * 7;
canvas.width = cell * 7;

let turn = 2;
let color;

let matriz = [];
for(let i = 0; i < 7; i++){
  matriz[i] = new Array(6);
}

ctx.fillStyle = "#3867d6";
ctx.fillRect(0, cell, canvas.width, canvas.height);
ctx.stroke();

function clearCircle(x, y, radius) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.closePath();
}
for (let y = 100; y < 700; y += cell) {
  for (let x = 0; x < 700; x += cell) {
    clearCircle(x + halfCell, y + halfCell, 35);
  }
}

ctx.globalCompositeOperation = 'source-over';