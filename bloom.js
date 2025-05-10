let raymarcher;
let rotX = 0;
let rotY = 0;
let prevMouseX, prevMouseY;
let isDragging = false;

let slider_1;
let slider_2;
let slider_3;

let myPicker;


function preload() {
  // In p5.js, we'll use a string with the shader code directly
  // You would need to include the shader code as a string in your HTML or load it separately
  // For this example, I'll assume you've loaded it into a variable called 'fragShaderCode'
  raymarcher = loadShader('data/vert.glsl', 'data/frag.glsl');
}


function setup(){
  createCanvas(16*35, 16*35, WEBGL);
  
    // Create a color picker and set its position.
  myPicker = createColorPicker('deeppink');
  myPicker.position(100, 30);
  
  slider_1 = createSlider(0, 300, 300);
  slider_1.position(200, 30);
  slider_1.size(80);
  
  slider_2 = createSlider(0, 300, 300);
  slider_2.position(200, 45);
  slider_2.size(80);
  
  slider_3 = createSlider(0, 300, 300);
  slider_3.position(200, 60);
  slider_3.size(80);
  
  shader(raymarcher);
  noStroke();
}

function draw() {
  
  let c = myPicker.color();

  let lambda_1 = float(slider_1.value());
  let lambda_2 = float(slider_2.value());
  let lambda_3 = float(slider_3.value());
  
  let total = lambda_1+lambda_2+lambda_3;
  
  lambda_1 /= total;
  lambda_2 /= total;
  lambda_3 /= total;
  
  let A = lambda_1 * (3.14159/2.5) + lambda_2 * (3.14159/2.5) + lambda_3 * (3.14159/1.75);
  let B = lambda_1 * (16.0*3.14159) + lambda_2 * (6.5*3.14159) + lambda_3 * (11.0*3.14159);
  let petalCutA = lambda_1 * 2.75 + lambda_2 * 2.25 + lambda_3 * 4.75;
  let petalCutB = lambda_1 * 80.0 + lambda_2 * 120.0 + lambda_3 * 420.0;
  let petalCutC = (lambda_1 * 480.0 + lambda_2 * 360.0 + lambda_3 * 2000.0)+60.0;
  let basePetalCut = lambda_1 * 0.75 + lambda_2 * 0.5 + lambda_3 * 0.6;
  let hangDownA = lambda_1 * 1.4 + lambda_2 * 2.3 + lambda_3 * 2.3;
  let hangDownB = lambda_1 * 1.0 + lambda_2 * 0.8 + lambda_3 * 0.9;
  let thetaReduction = (lambda_1 * 6000.0 + lambda_2 * 10000.0 + lambda_3 * 20000.0)*3.14159/180.0;
  
  let r = red(c) / 255.0;
  let g = green(c) / 255.0;
  let b = blue(c) / 255.0;
  
  raymarcher.setUniform('bColor', [r, g, b]);
  
  
  raymarcher.setUniform('iResolution', [width, height]);
  raymarcher.setUniform('iTime', 0.0);// millis() / 1000.0);
  raymarcher.setUniform('rotX', min(rotX-3.14/2.0, 0));
  raymarcher.setUniform('rotY', rotY + millis() / 1000.0);
  
  raymarcher.setUniform('param', [A, B]);
  raymarcher.setUniform('petalCut', [basePetalCut, petalCutA, petalCutB, petalCutC]);
  raymarcher.setUniform('hangDown', [hangDownA, hangDownB]);
  raymarcher.setUniform('thetaReduction', thetaReduction);

  rect(0, 0, width, height);
}

function mousePressed() {
  isDragging = true;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - prevMouseX;
    let deltaY = mouseY - prevMouseY;
    rotY += deltaX * 0.01;
    rotX += deltaY * 0.01;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 5);
  }
}
