class Cell {
    constructor(canvas, ctx, player, pNumber) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = player;
        this.radio = 30;
        this.pNumber = pNumber;
        this.imgURL=setIMG(player);
        this.color = "rgb(29, 29, 29)";
    }

    setIMG(name) {
        let url;
        if (name == 'p1') {
            url = "./img/img1.png";
            return url;
        }else if (name == 'p2') {
            url = "./img/img2.png";
            return url;
        }
    }
  
    
}