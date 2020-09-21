let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d');
let grid = document.querySelector("#grid");
let ctxGrid = grid.getContext('2d');

let dx=[ 1,-1, 0, 0, 1,-1, 1,-1];
let dy=[ 0, 0, 1,-1,-1, 1, 1,-1];

let cell = 100;
let halfCell = cell / 2;
grid.height = cell * 7;
grid.width = cell * 7;
canvas.height = cell * 7;
canvas.width = cell * 7;

let turn = 2;
let cellColor = "./img/img1.png";


let matriz = [];
for(let i = 0; i < 7; i++){
  matriz[i] = new Array(6);
}

ctxGrid.fillStyle = "#3867d6";
ctxGrid.fillRect(0, cell, grid.width, grid.height);
ctxGrid.stroke();

function clearCircle(x, y, radius) {
  ctxGrid.globalCompositeOperation = 'destination-out';
  ctxGrid.arc(x, y, radius, 0, Math.PI * 2, true);
  ctxGrid.fill();
  ctxGrid.closePath();
}

for (let y = 100; y < 700; y += cell) {
  for (let x = 0; x < 700; x += cell) {
    clearCircle(x + halfCell, y + halfCell, 35);
  }
}

ctxGrid.globalCompositeOperation = 'source-over';

function getMousePos(evt) {
    let mouseX = evt.offsetX * canvas.width / canvas.clientWidth;
    let mouseY = evt.offsetY * canvas.height / canvas.clientHeight;
    return {
      x: mouseX,
      y: mouseY
    };
}

function efectoHover(event){
    let mousePos = getMousePos(event);
    let x = parseInt(mousePos.x/100);
    ctxGrid.beginPath();
    ctxGrid.fillStyle = "white";
    ctxGrid.fillRect(0,0,cell*7, cell);
    ctxGrid.stroke();
    let img = new Image();
    img.src = cellColor;
    ctxGrid.drawImage(img,(x*cell+ halfCell)-35,halfCell-30,70,70);
}

function fillCol(numCol){
    let numFil = 5;
    while(numFil >= 0 && matriz[numCol][numFil] != undefined){
      numFil--;
    }
    if(numFil < 0) return;
    matriz[numCol][numFil] = turn;
    return numFil;
  }
  let posWinners=[[0,0],[0,0],[0,0],[0,0]];
  function fCount(mx,my,col,fil,cellValue){
    if(fil<0 || fil>5 || col<0 || col>6)
      return 0;
    if(matriz[col][fil]!=cellValue)
      return 0;
    return 1 + fCount(mx,my,col+my,fil+mx,cellValue);
  }
  let posi=0;
  function fCount2(mx,my,col,fil,cellValue)
  {
    if(fil<0 || fil>5 || col<0 || col>6)
      return;
    if(matriz[col][fil]!=cellValue)
      return;
    posWinners[posi] = [col, fil];
    posi++;
    fCount2(mx,my,col+my,fil+mx,cellValue);
}

function checkWin(xCell, yCell){
    let cellValue = matriz[xCell][yCell];
    for(let i=0;i<8;i+=2){
      
      let lado1=fCount(dx[i],dy[i],xCell+dy[i],yCell+dx[i],cellValue);
      let lado2=fCount(dx[i+1],dy[i+1],xCell+dy[i+1],yCell+dx[i+1],cellValue);
      if(lado1+lado2+1>=4){
        posi=0;
        fCount2(dx[i],dy[i],xCell+dy[i],yCell+dx[i],cellValue,posi);
        fCount2(dx[i+1],dy[i+1],xCell+dy[i+1],yCell+dx[i+1],cellValue,posi);
        posWinners[posi]=[xCell,yCell];
        return true; 
      }
    }  
    return false;
}

function changeTurn(){
    if (turn == 1) {
        turn = 2;
    }else if (turn == 2) {
        turn = 1;
    }
    if (turn == 1) {
        cellColor = "./img/img1.png";
    }else if (turn == 2) {
        cellColor = "./img/img2.png";
    }
}

function throwCell(x, y, yMax) {
    let img = new Image();
    ctx.clearRect(x - halfCell, 0, cell, yMax);
    
    ctx.strokeStyle = "white";
    img.src = cellColor;
    ctx.drawImage(img,x,y,70,70);
    
    ctx.stroke();

    
    
    if (y !== yMax) {
      y += 10;
      setTimeout('throwCell(' + x + ',' + y + ', ' + yMax + ')', 1);
    }
    return;
}

function highlightWCells(){
    for(let i = 0; i<=3; i++){
        let x=posWinners[i][0];
        let y=posWinners[i][1];
        console.log(x + " " + y);
        ctxGrid.beginPath();
        ctxGrid.arc(x*cell+halfCell, y*cell+cell+halfCell, 35, 0, Math.PI * 2, true);
        ctxGrid.lineWidth = 8;
        ctxGrid.strokeStyle = "#66FF33";
        ctxGrid.fillStyle = color;
        ctxGrid.fill();
        ctxGrid.stroke();
        ctxGrid.closePath();
    }
}

grid.addEventListener('click', function (evt) {
    ctxGrid.beginPath();
    ctxGrid.fillStyle = "white";
    ctxGrid.fillRect(0,0,cell*7, cell);
    ctxGrid.stroke();
    let mousePos = getMousePos(evt);
    for (let i = 0; i < grid.width; i += cell) {
      if (mousePos.x > i && mousePos.x < i + cell) {
        if(matriz[i/100][0] !== undefined) break;
        let topeY = fillCol(i/100) + 1;
        changeTurn();
        throwCell(i + halfCell, halfCell, topeY * cell + halfCell);
        grid.style.pointerEvents = 'none';
        if(!checkWin(i/100, topeY-1)){
          setTimeout(function(){ 
            grid.style.pointerEvents = 'auto';
          }, 500);
        } else{
          highlightWCells();
        }
      }
    }
});