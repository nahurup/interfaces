let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let inMemCanvas = document.createElement('canvas');
let inMemCtx = inMemCanvas.getContext('2d');
let imagetemp;

let container = document.querySelector(".container-fluid");

window.onresize = function () {
  inMemCanvas.width = container.clientWidth;
  inMemCanvas.height = container .clientHeight;
  inMemCtx.drawImage(canvas, 0, 0);
  canvas.width = container.clientWidth;
  canvas.height = container .clientHeight;
  ctx.drawImage(inMemCanvas, 0, 0);
}


// last known position
let pos = { x: 0, y: 0 };

let color = 'black', grosor = 1;

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}

let eraser = document.querySelector("#eraser");
eraser.addEventListener("click", setEraser);
function setEraser() {
  ctx.globalCompositeOperation = "destination-out";
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = grosor;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
}

let clear = document.querySelector("#clear");
clear.addEventListener("click", clearCanvas);
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function scaleToFit(img){
  // get the scale
  let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  // get the top left position of the image
  let x = (canvas.width / 2) - (img.width / 2) * scale;
  let y = (canvas.height / 2) - (img.height / 2) * scale;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
  let reader = new FileReader();
  reader.onload = function(event){
      let img = new Image();
      imagetemp = img;
      img.onload = function(){
        scaleToFit(this);
      }
      img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);     
}

function setcolor(c) {
  color = c;
}
function setgrosor(g) {
  grosor=g;
}

let save = document.querySelector("#save");
save.addEventListener("click", saveCanvas);
function saveCanvas() {
  let canva = document.querySelector("canvas");
  let image = canva.toDataURL("image/png", 1.0)
  .replace("image/png", "image/octet-stream");
  let link = document.createElement("a");
  link.download = "my-image.png";
  link.href = image;
  link.click();
}

let grayscale = document.querySelector("#grayscale");
grayscale.addEventListener("click", setGrayscale);
function setGrayscale() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      let lightness = parseInt(pixels[i]*.299 + pixels[i + 1]*.587 + pixels[i + 2]*.114);
      pixels[i]   = lightness;   // red
      pixels[i+1] = lightness; // green
      pixels[i+2] = lightness; // blue
      // i+3 is alpha
  }
    
  ctx.putImageData(imageData, 0, 0);
}

let sepia = document.querySelector("#sepia");
sepia.addEventListener("click", setSepia);
function setSepia() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      let avg = pixels[i]*0.3 + pixels[i+1]*0.59 + pixels[i+2]*0.11;
      pixels[i]   = 100 + avg;   // red
      pixels[i+1] = 50 + avg; // green
      pixels[i+2] = avg; // blue
      // i+3 is alpha
  }
    
  ctx.putImageData(imageData, 0, 0);
}

function setBrightness(brightness) {
  scaleToFit(imagetemp);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      pixels[i]   = pixels[i] + 255 * (brightness / 100);   // red
      pixels[i+1] = pixels[i+1] + 255 * (brightness / 100); // green
      pixels[i+2] = pixels[i+2] + 255 * (brightness / 100); // blue
      // i+3 is alpha
  }
    
  ctx.putImageData(imageData, 0, 0);
}

let binarization = document.querySelector("#binarization");
binarization.addEventListener("click", setBinarization);
function setBinarization() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] <= 128) {
      pixels[i]   = 0;   // red
      pixels[i+1] = 0; // green
      pixels[i+2] = 0; // blue
      // i+3 is alpha
    }else if(pixels[i] > 128) {
      pixels[i]   = 255;   // red
      pixels[i+1] = 255; // green
      pixels[i+2] = 255; // blue
      // i+3 is alpha
    }
  }
    
  ctx.putImageData(imageData, 0, 0);
}

let negative = document.querySelector("#negative");
negative.addEventListener("click", setNegative);
function setNegative() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      pixels[i]   = 255 - pixels[i];   // red
      pixels[i+1] = 255 - pixels[i+1]; // green
      pixels[i+2] = 255 - pixels[i+2]; // blue
      // i+3 is alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
}

let kernels = {
  sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  blur: [0, .2, 0, .2, .2, .2, 0, .2, 0],
  edge: [0, 1, 0, 1, -4, 1, 0, 1, 0],
};

function convolve(context, kernel) {
  let canvas = context.canvas;
  let width = canvas.width;
  let height = canvas.height;

  let size = Math.sqrt(kernel.length);
  let half = Math.floor(size / 2);

  let inputData = context.getImageData(0, 0, width, height).data;

  let output = context.createImageData(width, height);
  let outputData = output.data;

  for (let pixelY = 0; pixelY < height; ++pixelY) {
    let pixelsAbove = pixelY * width;
    for (let pixelX = 0; pixelX < width; ++pixelX) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let kernelY = 0; kernelY < size; ++kernelY) {
        for (let kernelX = 0; kernelX < size; ++kernelX) {
          let weight = kernel[kernelY * size + kernelX];
          let neighborY = Math.min(
            height - 1,
            Math.max(0, pixelY + kernelY - half)
          );
          let neighborX = Math.min(
            width - 1,
            Math.max(0, pixelX + kernelX - half)
          );
          let inputIndex = (neighborY * width + neighborX) * 4;
          r += inputData[inputIndex] * weight;
          g += inputData[inputIndex + 1] * weight;
          b += inputData[inputIndex + 2] * weight;
          a += inputData[inputIndex + 3] * weight;
        }
      }
      let outputIndex = (pixelsAbove + pixelX) * 4;
      outputData[outputIndex] = r;
      outputData[outputIndex + 1] = g;
      outputData[outputIndex + 2] = b;
      outputData[outputIndex + 3] = kernel.normalized ? a : 255;
    }
  }
  context.putImageData(output, 0, 0);
}

let sharpen = document.querySelector("#sharpen");
sharpen.onclick = function() {
  convolve(ctx,kernels["sharpen"]);
}
let blur = document.querySelector("#blur");
blur.onclick = function() {
  convolve(ctx,kernels["blur"]);
}
let edge = document.querySelector("#edge");
edge.onclick = function() {
  convolve(ctx,kernels["edge"]);
}
let redraw = document.querySelector("#redraw ");
redraw .onclick = function() {
  clearCanvas();
  scaleToFit(imagetemp);
}