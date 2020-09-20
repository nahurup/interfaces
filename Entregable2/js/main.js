let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d');

let grid = [[],[],[],[],[],[],[],[]];

function start(){
    for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < 8; j++) {
            this.grid[i][j] = new Cell(canvas, ctx, 'base', i);
        }
    }
    this.draw();
}

function draw(){
    ctx.fillStyle = "rgb(54, 54, 54)";
    ctx.fillRect(220,30,560,560);

    for (let i = 0; i < this.tablero.length; i++) {
        for (let j = 0; j < 8; j++) {
            this.grid[i][j].draw(ctx,(255)+(70*i),(590-35)-(70*j));
        }
    }
}