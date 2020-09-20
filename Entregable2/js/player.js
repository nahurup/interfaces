class Player {
    constructor(canvas, ctx, name, pNumber) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.name = name;
        this.pNumber = pNumber;
        this.cells = [];
    }

    pileUP(){
        for (let i = 0; i < 16; i++) {
            let cell = new Cell(canvas, ctx, name, pNumber);
            this.cells.push(cell);
            drawPile();
        }
    }

    drawPile(){
        if (this.pNumber == 1) {
            let img = new Image();
            img.src = "./img/img1.png";
            this.ctx.drawImage(img,10,500,50,50);
        }else if(this.pNumber == 2) {
            let img = new Image();
            img.src = "./img/img2.png";
            this.ctx.drawImage(img,10,500,50,50);
        }
    }

  
    
  }