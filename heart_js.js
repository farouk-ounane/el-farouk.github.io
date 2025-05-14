let heart_shader;
let heart;

let shader_enable = true;

let eyeOpen = true;
let eyeLidProgress = 1.0;
let eyeTransitionSpeed = 0.05;

let pupilPos = [0, 0];

let blinking = false;
let blinking_timer = 0.0;

let isDragging = false;
let previousMouseX, previousMouseY;
let rotationX = 0;
let rotationY = 0;
let originalModelViewMatrix;
let originalProjectionMatrix;
let return_to_position = false;

let slider_x;
let slider_y;

let eye_button;
let shader_button;

function preload() {
  // "human heart" (https://skfb.ly/EnQR) by sammite is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  heart = loadModel("./data/heart.obj");

  // This is my shader (Mohamed El Farouk Ounane)
  heart_shader = loadShader("./data/shader.vert", "./data/shader.frag");
}

function setup() {
  const cnv = createCanvas(560, 560, WEBGL);
  cnv.parent('sketch');

  slider_x = createSlider(300, 1000, 1000);
  slider_x.parent('controls');
  slider_x.position(10, 10);
  slider_x.size(80);

  slider_y = createSlider(300, 1000, 1000);
  slider_y.parent('controls');
  slider_y.position(10, 20);
  slider_y.size(80);

  eye_button = createButton('Close');
  eye_button.parent('controls');
  eye_button.position(15, 40);
  eye_button.mouseClicked(eye);

  shader_button = createButton('Remove Shader Magic');
  shader_button.parent('controls');
  shader_button.position(15, 65);
  shader_button.mouseClicked(shader_enabling);

  noStroke();
}

function draw() {
  background(0);

  let x_light = slider_x.value();
  let y_light = slider_y.value();

  pupilPos[0] = ((constrain(mouseX, -width/4.0, 5*width/4.0) / float(width) - 0.5) * 0.7);
  pupilPos[1] = -((constrain(mouseY, -height/4.0, 5.0*height/4) / float(height) - 0.5) * 1.0);

  if (eyeOpen && !blinking) {
    eyeLidProgress = min(eyeLidProgress + eyeTransitionSpeed, 1.0);
  } else {
    eyeLidProgress = max(eyeLidProgress - eyeTransitionSpeed, 0.0);
  }

  rotateZ(PI);
  rotateY(-1);

  originalModelViewMatrix = this._renderer.uMVMatrix.copy();
  originalProjectionMatrix = this._renderer.uPMatrix.copy();

  rotateY(rotationX);

  if (abs(rotationX)> 0.1) {
    if (return_to_position)
    {
      rotationX -= 0.1 * rotationX/abs(rotationX);

      if (abs(rotationX) <= 0.1)
      {
           return_to_position = false;
           eyeOpen = true;
           eye_button.html("Close");
      }
    }
    else {
    eye_button.html("Open up!");
    eyeOpen = false;
    }
  }

  let dirY = (x_light / float(height) - 0.5) * 2;
  let dirX = (y_light / float(width) - 0.5) * 2;

  directionalLight(204, 204, 204, -dirX, -dirY, -1);

  if (shader_enable) {

    shader(heart_shader);
    heart_shader.setUniform("originalProjectionMatrix", originalProjectionMatrix.mat4);
    heart_shader.setUniform("originalModelViewMatrix", originalModelViewMatrix.mat4);
    heart_shader.setUniform("time", millis() / 1000.0);
    heart_shader.setUniform("lightNormal", [-dirX, -dirY, -1]);
    heart_shader.setUniform("pupilPos", pupilPos);
    heart_shader.setUniform("eyeOpen", eyeOpen && !blinking);
    heart_shader.setUniform("eyeLidProgress", eyeLidProgress);
  }

  if (random(1, 100) < 2 && blinking_timer <= 0.0) {
    blinking_timer = 1.0;
    blinking = true;
  }

  blinking_timer -= 0.1;

  if (blinking_timer < 0.0) {
    blinking = false;
  }

  model(heart);

}

function eye() {

  if (abs(rotationX)> 0.1) {
    return_to_position = true;
  }
  else
  {
  eyeOpen = !eyeOpen;
  eye_button.html(eyeOpen ? "Close" : "Open up!");
  }
}

function shader_enabling() {
  shader_enable = !shader_enable;
  shader_button.html(shader_enable ? "Remove Shader Magic" : "Add Shader Magic!");
  resetShader();
}

function mousePressed() {
  if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    isDragging = true;
    previousMouseX = mouseX;
    previousMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (!isDragging) return;

  var deltaX = mouseX - previousMouseX;
  var deltaY = mouseY - previousMouseY;

  rotationX += deltaX * 0.01;
  rotationY += deltaY * 0.01;

  previousMouseX = mouseX;
  previousMouseY = mouseY;
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 10);
  }
}
