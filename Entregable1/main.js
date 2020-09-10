let canvas = document.getElementById("canvas");

// hotfixes
document.body.style.margin = 0;
canvas.style.position = 'fixed';

let ctx = canvas.getContext('2d');
resize();

// last known position
let pos = { x: 0, y: 0 };

let color = 'black', grosor = 1;

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

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

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
  let reader = new FileReader();
  reader.onload = function(event){
      let img = new Image();
      img.onload = function(){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img,0,0);
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

function saveCanvas() {
  let canva = document.querySelector("canvas");
  let image = canva.toDataURL("image/png", 1.0)
  .replace("image/png", "image/octet-stream");
  let link = document.createElement("a");
  link.download = "my-image.png";
  link.href = image;
  link.click();
}

function setGrayscale(context, canvas) {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      let grayscale = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
      pixels[i]   = 255 - grayscale;   // red
      pixels[i+1] = 255 - grayscale; // green
      pixels[i+2] = 255 - grayscale; // blue
      // i+3 is alpha
  }
    
  context.putImageData(imageData, 0, 0);
}

function setNegative(context, canvas) {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      pixels[i]   = 255 - pixels[i];   // red
      pixels[i+1] = 255 - pixels[i+1]; // green
      pixels[i+2] = 255 - pixels[i+2]; // blue
      // i+3 is alpha
  }
  
  context.putImageData(imageData, 0, 0);
}