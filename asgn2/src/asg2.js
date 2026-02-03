// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  //uniform float u_Size;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    //gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;  // uniform変数
  void main() {
    gl_FragColor = u_FragColor;
  }`
  
// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
//let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
//let u_Segments;
//var g_shapesList= [];
//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_size = []; // The array to store the size of the clicked point
//const POINT = 0;
//const TRIANGLE = 1;
//const CIRCLE = 2;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
//let g_selectedSize = 10.0;
//let g_selectedSegments = 10.0
//let g_selectedType = POINT;
//let g_draw = 0;
//let g_starsDrawn = 0;
let g_animateWalk = false;
let g_walkSpeed = 0;
let g_speedTimes = 5;

let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_globalZAngle = 0;
let g_xBodyMove = 0;
let g_yBodyMove = 0;
let g_zBodyMove = 0;

let g_isDragging = false;
let g_lastMouseX = 0;
let g_lastMouseY = 0;

let g_moveWings = 0;

let g_moveLeftLeg = 25;
let g_moveLeftFoot = 10; 
let g_moveLeftToes = 10;
let g_moveRightLeg = 25;
let g_moveRightFoot = 10; 
let g_moveRightToes = 10;

// --- Poke animation state ---
let g_poke = false;
let g_pokeStart = 0;

let g_pokeWingOffset = 0; // degrees added to g_moveWings
let g_pokeHeadOffset = 0; // degrees yaw for head

const g_pokeDuration = 2; // seconds total
const g_pokeFlaps = 6;      // number of flaps / head sways
const g_pokeWingAmp = 90;   // degrees
const g_pokeHeadAmp = 20;   // degrees

function setupPageStyle(){
  const cursor = document.createElement('div');
  cursor.id = 'fakeCursor';
  document.body.appendChild(cursor);

  // this event listener determines the location of the click on the canvas
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // this property allows me to reflect the color of my selected color
  document.documentElement.style.setProperty('--ui-accent', `rgb(${255},${255},${255})`);
}

// use this function to update the cursor color by reading from g_selectedColor
function updateCursorColor(){
  document.documentElement.style.setProperty('--ui-accent', `rgb(${g_selectedColor[0] * 255},${g_selectedColor[1] * 255},${g_selectedColor[2] * 255})`);
}

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  setupPageStyle();
  addMouseRotateControls(canvas);

  //get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {
    preserveDrawingBuffer: true,
    depth: true
  })
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // failure returns -1
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  // failure returns null
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // failure returns null
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    // failure returns null
  if (!u_GlobalRotateMatrix) {
     console.log('Failed to get the storage location of u_GlobalRotateMatrix');
     return;
  }

}

function addMouseRotateControls(canvas) {
  canvas.addEventListener("mousedown", (ev) => {
    g_isDragging = true;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;
  });

  window.addEventListener("mouseup", () => {
    g_isDragging = false;
  });

  window.addEventListener("mousemove", (ev) => {
    if (!g_isDragging) return;

    const dx = ev.clientX - g_lastMouseX;
    const dy = ev.clientY - g_lastMouseY;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;

    // sensitivity: degrees per pixel (tweak to taste)
    const s = 0.5;

    // Common convention:
    // - drag left/right changes Y rotation
    // - drag up/down changes X rotation
    g_globalYAngle = Number(g_globalYAngle) + dx * s;
    g_globalXAngle = Number(g_globalXAngle) - dy * s;

    // optional clamp so it doesn't flip weirdly
    g_globalXAngle = Math.max(-89, Math.min(89, g_globalXAngle));

    renderAllShapes();
  });

}


function addActionsForHtmlUI(){
  // BUTTON Events (shape type)
  /*
  document.getElementById('clearButton').onclick = function() {
    g_shapesList = [];
    g_starsDrawn = 0; //rest starsDrawn to 0 now that all "stars" have been cleared
    renderAllShapes();
  };
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;};
  document.getElementById('triButton').onclick = function() {g_selectedType = TRIANGLE;}; 
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;};
  document.getElementById('delete').onclick = function() {deleteBrushStroke();};
  document.getElementById('drawPicture').onclick = function() {
    // first check that no stars are drawn. If so, ignore
    if (g_starsDrawn == 0) {
      paintStars();
      g_starsDrawn = 1;
    }
    let point = new Triangle();
    // point.draw enables Triangle class to draw the picture
    point.draw = 1;
    g_shapesList.push(point);
    renderAllShapes();
  };*/


  // SLIDER Events
  // Size Adjust
  /*
  document.getElementById('sizeSlide').addEventListener('mouseup',   function() { g_selectedSize = this.value; });
  // Color Adjust
  document.getElementById('redSlide').addEventListener('mouseup',   function() { 
    g_selectedColor[0] = this.value / 100;
    updateCursorColor(); 
  });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value / 100; 
    updateCursorColor();
  });
  document.getElementById('blueSlide').addEventListener('mouseup',  function() { 
    g_selectedColor[2] = this.value / 100; 
    updateCursorColor();
  });*/
  canvas.addEventListener("click", (ev) => {
    if (ev.shiftKey){
      // start poke animation
      g_poke = true;
      g_pokeStart = g_seconds;  // assumes g_seconds is updated in tick()
    }
  });

  document.getElementById('animateWalkON').onclick = function() {g_animateWalk = true;};
  document.getElementById('animateWalkOFF').onclick = function() {g_animateWalk = false;}; 
  document.getElementById('walkSpeedSlider').addEventListener('mousemove',   function() { 
    g_speedTimes = Number(this.value);
    renderAllShapes(); });

  // Move Camera x-wise
  document.getElementById('xSlide').addEventListener('mousemove',   function() { 
    g_globalXAngle = Number(this.value);
    renderAllShapes(); });
    
  // Move Camera y-wise
  document.getElementById('ySlide').addEventListener('mousemove',   function() { 
    g_globalYAngle = Number(this.value);
    renderAllShapes(); });
  // Move Camera y-wise
  document.getElementById('zSlide').addEventListener('mousemove',   function() { 
    g_globalZAngle = Number(this.value);
    renderAllShapes(); });
  // Move Body x-wise
  /*
  document.getElementById('xBodyMove').addEventListener('mousemove',   function() { 
    g_xBodyMove = Number(this.value);
    renderAllShapes(); });
  document.getElementById('yBodyMove').addEventListener('mousemove',   function() { 
    g_yBodyMove = Number(this.value);
    renderAllShapes(); });
  document.getElementById('zBodyMove').addEventListener('mousemove',   function() { 
    g_zBodyMove = Number(this.value);
    renderAllShapes(); });
    */

  document.getElementById('wingsSlider').addEventListener('mousemove',   function() { 
    g_moveWings = Number(this.value);
    renderAllShapes(); });

  document.getElementById('leftLeg').addEventListener('mousemove',   function() { 
    g_moveLeftLeg = Number(this.value);
    renderAllShapes(); });
  document.getElementById('leftFoot').addEventListener('mousemove',   function() { 
    g_moveLeftFoot = Number(this.value);
    renderAllShapes(); });
  document.getElementById('leftToes').addEventListener('mousemove',   function() { 
    g_moveLeftToes = Number(this.value);
    renderAllShapes(); });
  document.getElementById('rightLeg').addEventListener('mousemove',   function() { 
    g_moveRightLeg = Number(this.value);
    renderAllShapes(); });
  document.getElementById('rightFoot').addEventListener('mousemove',   function() { 
    g_moveRightFoot = Number(this.value);
    renderAllShapes(); });
  document.getElementById('rightToes').addEventListener('mousemove',   function() { 
    g_moveRightToes = Number(this.value);
    renderAllShapes(); });
}

function getMouseNDC(ev, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  // NDC: x in [-1,1], y in [-1,1] with +y up
  const ndcX = (x / canvas.width) * 2 - 1;
  const ndcY = 1 - (y / canvas.height) * 2;
  return [ndcX, ndcY];
}

// extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x,y];
}

// code from CSE 160 helper videos
function sendTextToHTML(text, htmlID) {
  var hmtlElm = document.getElementById(htmlID);
  if (!hmtlElm) {
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  hmtlElm.innerHTML = text;
}

let g_aniPenguinYdir = 0;

function renderUpperBody(rotMat) {
  let ra = [];
  let i;


  for (i = 0; i < 4; i++) {
    ra.push(new Prism());
    ra[i].color = [1.0 - i * 0.05, 1.0 - i * 0.05, 1.0 - i * 0.05, 1.0 - i * 0.05];
  }
  for (; i < 10; i++) {
    ra.push(new Prism());
    ra[i].color = [0.2,0.2,0.2,1.0];
  }

  ra.push(new Cube());
  ra[i].color = [0.2,0.2,0.2,1.0];


  for (i=0; i < 11; i++) {
    ra[i].matrix.set(rotMat);
  }
/*
  for (i=0; i < 11; i++){
    ra[i].matrix.setRotate(g_zBodyMove,0,0,1);
    ra[i].matrix.rotate(g_yBodyMove,0,1,0);
    ra[i].matrix.rotate(g_xBodyMove,1,0,0);
    //ra[i].render();
  }
*/
  
  ra[0].matrix.scale(0.3,0.5,0.1);
  ra[0].matrix.rotate(270,1,0,0);

  ra[1].matrix.scale(-1,1,1);
  ra[1].matrix.scale(0.3,0.5,0.1);
  ra[1].matrix.rotate(270,1,0,0);


  ra[2].matrix.scale(0.3,0.5,0.2);
  ra[2].matrix.rotate(-90,0,1,0);


  ra[3].matrix.scale(-1,1,1);
  ra[3].matrix.scale(0.3,0.5,0.2);
  ra[3].matrix.rotate(-90,0,1,0);


  ra[4].matrix.translate(0,0.5,0.2);
  ra[4].matrix.rotate(180,1,0,0);
  ra[4].matrix.scale(0.3,0.5,0.2);
  ra[4].matrix.rotate(-90,0,1,0);


  ra[5].matrix.scale(-1,1,1);
  ra[5].matrix.translate(0,0.5,0.2);
  ra[5].matrix.rotate(180,1,0,0);
  ra[5].matrix.scale(0.3,0.5,0.2);
  ra[5].matrix.rotate(-90,0,1,0);


  ra[6].matrix.translate(0.2,0.5,0.2);
  ra[6].matrix.scale(0.1,0.5,0.3);
  ra[6].matrix.rotate(90,1,0,0);

  ra[7].matrix.scale(-1,1,1);
  ra[7].matrix.translate(0.2,0.5,0.2);
  ra[7].matrix.scale(0.1,0.5,0.3);
  ra[7].matrix.rotate(90,1,0,0);


  ra[8].matrix.translate(0,0.5,0.5);
  ra[8].matrix.scale(0.2,0.5,0.1);
  ra[8].matrix.rotate(90,1,0,0);

  ra[9].matrix.scale(-1,1,1);
  ra[9].matrix.translate(0,0.5,0.5);
  ra[9].matrix.scale(0.2,0.5,0.1);
  ra[9].matrix.rotate(90,1,0,0);

  ra[10].matrix.translate(-0.2,0,0.2);
  ra[10].matrix.scale(0.4,0.5,0.3);

  for (i=0; i < 11; i++){
    ra[i].render();
  }

}

function renderLowerBody(rotMat) {
  let ra = [];
  let i;
  //let rotMat = new Matrix4();

  ra.push(new Cube());
  ra[0].color = [1,1,1,1];
  
  ra.push(new Prism());
  ra[1].color = [1,1,1,1];

  for (i = 2; i < 11; i++) {
    ra.push(new Prism());
    ra[i].color = [0.2,0.2,0.2,1.0];
  }

  for (i=0; i < 11; i++){
    ra[i].matrix.set(rotMat);
  }


  ra[0].matrix.translate(-0.3,0.0,0.1);
  ra[0].matrix.scale(0.6,0.4,0.1);
  ra[0].matrix.rotate(90,1,0,0);
  //ra[0].render();

  ra[1].matrix.translate(-0.25,0.0,0.1);
  ra[1].matrix.scale(0.5,0.4,0.1);
  ra[1].matrix.rotate(-90,1,0,0);
  ra[1].matrix.rotate(90,0,1,0);


  //ra[2].matrix.scale(-1,1,1);
  //ra[3].matrix.set(ra[2].matrix);
  ra[2].matrix.translate(0.2,0.0,0.2);
  ra[2].matrix.scale(0.1,0.4,0.3);
  ra[2].matrix.rotate(90,1,0,0);
  //ra[3].render();

  ra[3].matrix.scale(-1,1,1);
  ra[3].matrix.translate(0.2,0.0,0.2);
  ra[3].matrix.scale(0.1,0.4,0.3);
  ra[3].matrix.rotate(90,1,0,0);
  //ra[4].render();

  ra[4].matrix.translate(0,0.0,0.5);
  ra[4].matrix.scale(0.2,0.4,0.1);
  ra[4].matrix.rotate(90,1,0,0);

  ra[5].matrix.scale(-1,1,1);
  ra[5].matrix.translate(0,0.0,0.5);
  ra[5].matrix.scale(0.2,0.4,0.1);
  ra[5].matrix.rotate(90,1,0,0);

  ra[6].color = [1,1,1,1];
  ra[6].matrix.translate(-0.15,-0.4,0.2);
  ra[6].matrix.scale(0.30,0.1,0.1);
  ra[6].matrix.rotate(-90,1,0,0);
  ra[6].matrix.rotate(90,0,1,0);

  //ra[8].matrix.scale(-1,1,1);
  ra[7].matrix.translate(0.15,-0.4,0.2);
  ra[7].matrix.scale(0.05,0.1,0.3);
  ra[7].matrix.rotate(-90,0,0,1);

  ra[8].matrix.scale(-1,1,1);
  ra[8].matrix.translate(0.15,-0.4,0.2);
  ra[8].matrix.scale(0.05,0.1,0.3);
  ra[8].matrix.rotate(-90,0,0,1);

  ra[9].matrix.translate(-0.15,-0.5,0.5);
  ra[9].matrix.scale(0.3,0.1,0.3);
  ra[9].matrix.rotate(-90,1,0,0);
  ra[9].matrix.rotate(90,0,1,0);

  // tail
  ra[10].matrix.translate(0.15,-0.6,0.5);
  ra[10].matrix.scale(0.3,0.2,0.3);
  ra[10].matrix.rotate(-90,0,1,0);

  for (i=0; i < 11; i++){
    ra[i].render();
  }
}

function renderWings(rotMat) {
  let ra = [];
  let i;
  //let moveWingsXdir;
  //let moveWingsYdir;
  //let moveWingsZdir;

  const wings = g_moveWings + g_pokeWingOffset;
    // ...rest of your function unchanged...
  let moveWingsXdir = wings * 0.78;
  let moveWingsYdir = wings * 0.167;
  let moveWingsZdir = wings * 1.11;

    /*
  if (!g_poke) {
    moveWingsXdir = g_moveWings * 0.78;
    moveWingsYdir = g_moveWings * 0.167;
    moveWingsZdir = g_moveWings * 1.11;
  }
  else{
    moveWingsXdir = g_pokeWingOffset;
    moveWingsYdir = g_pokeWingOffset;
    moveWingsZdir = g_pokeWingOffset;
  }
*/

  for (i = 0; i < 4; i++) {
    ra.push(new Cube());
    ra[i].color = [1,1,1,1];
  }

  for (; i < 8; i++) {
    ra.push(new Prism());
    ra[i].color = [0.3,0.3,0.3,1.0];
  }

  /*
  for (i=0; i < 8; i++){
    ra[i].matrix.setRotate(g_zBodyMove,0,0,1);
    ra[i].matrix.rotate(g_yBodyMove,0,1,0);
    ra[i].matrix.rotate(g_xBodyMove,1,0,0);
    //ra[i].render();
  }
  */

  for (i=0; i < 8; i++) {
    ra[i].matrix.set(rotMat);
  }

  let ra0Base = new Matrix4();
  ra0Base.translate(0.29,0.4,0.23);
  ra0Base.rotate(-moveWingsYdir,0,1,0);
  ra0Base.rotate(moveWingsXdir,1,0,0);
  ra0Base.rotate(moveWingsZdir,0,0,1);
  ra0Base.rotate(6,1,0,0);
  ra0Base.rotate(7,0,0,1);
  ra0Base.translate(0.0,-0.3,0.0);
  ra0Base.scale(0.02,0.3,0.2);
  ra[0].matrix.concat(ra0Base);

  ra[1].matrix.scale(-1,1,1);
  ra[1].matrix.concat(ra0Base);

  
  let ra2Base = new Matrix4();
  ra2Base.translate(0.29,0.4,0.23);
  ra2Base.rotate(-moveWingsYdir,0,1,0);
  ra2Base.rotate(moveWingsXdir,1,0,0);
  ra2Base.rotate(moveWingsZdir,0,0,1);
  ra2Base.translate(0.035,-0.55,0.02);
  ra2Base.scale(0.015,0.275,0.15);
  ra[2].matrix.concat(ra2Base);
  
  ra[3].matrix.scale(-1,1,1);
  ra[3].matrix.concat(ra2Base);


  let ra4Base = new Matrix4();
  ra4Base.translate(0.29,0.4,0.23);
  ra4Base.rotate(-moveWingsYdir,0,1,0);
  ra4Base.rotate(moveWingsXdir,1,0,0);
  ra4Base.rotate(moveWingsZdir,0,0,1);
  ra4Base.rotate(6,1,0,0);
  ra4Base.rotate(7,0,0,1);
  ra4Base.translate(0.02,-0.3,0.0);
  ra4Base.scale(0.03,0.3,0.2);
  ra[4].matrix.concat(ra4Base);

  ra[5].matrix.scale(-1,1,1);
  ra[5].matrix.concat(ra4Base);


  let ra6Base = new Matrix4();
  ra6Base.translate(0.29,0.4,0.23);
  ra6Base.rotate(-moveWingsYdir,0,1,0);
  ra6Base.rotate(moveWingsXdir,1,0,0);
  ra6Base.rotate(moveWingsZdir,0,0,1);
  ra6Base.translate(0.05,-0.275,0.02);
  ra6Base.scale(0.025,0.275,0.15);
  ra6Base.rotate(-90,0,0,1);
  ra[6].matrix.concat(ra6Base);

  ra[7].matrix.scale(-1,1,1);
  ra[7].matrix.concat(ra6Base);

  for (i=0; i < 8; i++){
    ra[i].render();
  }
}

/*
function renderWings() {
  let ra = [];
  let i;
  let globalRotMat = new Matrix4();
  let moveWingsXdir = g_moveWings * 0.78;
  let moveWingsYdir = g_moveWings * 0.167;
  let moveWingsZdir = g_moveWings * 1.11;
  


  for (i = 0; i < 4; i++) {
    ra.push(new Cube());
    ra[i].color = [1,1,1,1];
  }

  for (; i < 8; i++) {
    ra.push(new Prism());
    ra[i].color = [0.3,0.3,0.3,1.0];
  }

  /*
  for (i=0; i < 8; i++){
    ra[i].matrix.setRotate(g_zBodyMove,0,0,1);
    ra[i].matrix.rotate(g_yBodyMove,0,1,0);
    ra[i].matrix.rotate(g_xBodyMove,1,0,0);
    //ra[i].render();
  }
  */
 /*
  globalRotMat.setRotate(g_zBodyMove,0,0,1);
  globalRotMat.rotate(g_yBodyMove,0,1,0);
  globalRotMat.rotate(g_xBodyMove,1,0,0);



  ra[0].matrix.translate(0.29,0.4,0.23);
  ra[0].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[0].matrix.rotate(moveWingsXdir,1,0,0);
  ra[0].matrix.rotate(moveWingsZdir,0,0,1);
  ra[0].matrix.rotate(6,1,0,0);
  ra[0].matrix.rotate(7,0,0,1);
  ra[0].matrix.translate(0.0,-0.3,0.0);
  ra[0].matrix.scale(0.02,0.3,0.2);
  //ra[0].render();

  ra[1].matrix.scale(-1,1,1);
  ra[1].matrix.translate(0.29,0.4,0.23);
  ra[1].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[1].matrix.rotate(moveWingsXdir,1,0,0);
  ra[1].matrix.rotate(moveWingsZdir,0,0,1);
  ra[1].matrix.rotate(6,1,0,0);
  ra[1].matrix.rotate(7,0,0,1);
  ra[1].matrix.translate(0.0,-0.3,0.0);
  ra[1].matrix.scale(0.02,0.3,0.2);


  ra[2].matrix.translate(0.29,0.4,0.23);
  ra[2].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[2].matrix.rotate(moveWingsXdir,1,0,0);
  ra[2].matrix.rotate(moveWingsZdir,0,0,1);
  ra[2].matrix.translate(0.035,-0.55,0.02);
  ra[2].matrix.scale(0.015,0.275,0.15);
  //ra[2].matrix.rotate(-90,0,0,1);

  
  ra[3].matrix.scale(-1,1,1);
  ra[3].matrix.translate(0.29,0.4,0.23);
  ra[3].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[3].matrix.rotate(moveWingsXdir,1,0,0);
  ra[3].matrix.rotate(moveWingsZdir,0,0,1);
  ra[3].matrix.translate(0.035,-0.55,0.02);
  ra[3].matrix.scale(0.015,0.275,0.15);

  ra[4].matrix.translate(0.29,0.4,0.23);
  ra[4].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[4].matrix.rotate(moveWingsXdir,1,0,0);
  ra[4].matrix.rotate(moveWingsZdir,0,0,1);
  ra[4].matrix.rotate(6,1,0,0);
  ra[4].matrix.rotate(7,0,0,1);
  ra[4].matrix.translate(0.02,-0.3,0.0);
  ra[4].matrix.scale(0.03,0.3,0.2);

  ra[5].matrix.scale(-1,1,1);
  ra[5].matrix.translate(0.29,0.4,0.23);
  ra[5].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[5].matrix.rotate(moveWingsXdir,1,0,0);
  ra[5].matrix.rotate(moveWingsZdir,0,0,1);
  ra[5].matrix.rotate(6,1,0,0);
  ra[5].matrix.rotate(7,0,0,1);
  ra[5].matrix.translate(0.02,-0.3,0.0);
  ra[5].matrix.scale(0.03,0.3,0.2);


  
  ra[6].matrix.translate(0.29,0.4,0.23);
  ra[6].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[6].matrix.rotate(moveWingsXdir,1,0,0);
  ra[6].matrix.rotate(moveWingsZdir,0,0,1);
  ra[6].matrix.translate(0.05,-0.275,0.02);
  ra[6].matrix.scale(0.025,0.275,0.15);
  ra[6].matrix.rotate(-90,0,0,1);
  ra7Mat = new Matrix4(ra[6].matrix)

  //ra[7].matrix.concat(ra7Mat.scale(-1,1,1));
  
  ra[7].matrix.scale(-1,1,1);
  ra[7].matrix.concat(ra7Mat);
  /*
  ra[7].matrix.translate(0.29,0.4,0.23);
  ra[7].matrix.rotate(-moveWingsYdir,0,1,0);
  ra[7].matrix.rotate(moveWingsXdir,1,0,0);
  ra[7].matrix.rotate(moveWingsZdir,0,0,1);
  ra[7].matrix.translate(0.05,-0.275,0.02);
  ra[7].matrix.scale(0.025,0.275,0.15);
  ra[7].matrix.rotate(-90,0,0,1);
  */
  
/*
  for (i=0; i < 8; i++){
    ra[i].render();
  }
}
*/

function renderLegs(rotMat) {
  let ra = [];
  let i;
  let moveLeftLegXdir, moveLeftLegYdir = 0, moveLeftLegZdir = 0;
  let moveLeftFootXdir = g_moveLeftFoot - 10;
  let moveLeftToesXdir;
  let moveRightLegXdir, moveRightLegYdir = 0, moveRightLegZdir = 0;
  let moveRightFootXdir = g_moveRightFoot - 10;
  let moveRightToesXdir;

  
  //rotMat.rotate(-10*Math.sin(g_walkSpeed),0,0,1);
  //rotMat.rotate(15*Math.sin(g_walkSpeed + (Math.PI / 2)),0,1,0);

  if (g_animateWalk) {
    moveLeftLegXdir = -25*Math.sin((g_walkSpeed - (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed - (Math.PI / 2))));
    //moveLeftLegYdir = -15*Math.sin((g_walkSpeed + (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed + (Math.PI / 2))));
    moveLeftLegYdir = -15*Math.sin(g_walkSpeed + (Math.PI / 2));
    moveLeftLegZdir = -10*Math.sin(g_walkSpeed - (Math.PI / 2));
    moveLeftToesXdir = 25*Math.sin((g_walkSpeed - (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed - (Math.PI / 2)))) + 10;
    moveRightLegXdir = -25*Math.sin((g_walkSpeed + (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed + (Math.PI / 2))));
    //moveRightLegYdir = -15*Math.sin((g_walkSpeed - (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed - (Math.PI / 2))));
    moveRightLegYdir = -15*Math.sin(g_walkSpeed - (Math.PI / 2));
    moveRightLegZdir = -10*Math.sin(g_walkSpeed + (Math.PI / 2));
    moveRightToesXdir = 25*Math.sin((g_walkSpeed + (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed + (Math.PI / 2)))) + 10;

    //rotMat.rotate(15*Math.sin(g_walkSpeed + (Math.PI / 2)),0,1,0);
  }
  else{
    moveLeftLegXdir = g_moveLeftLeg - 25;
    moveLeftToesXdir = g_moveLeftToes - 10;
    moveRightLegXdir = g_moveRightLeg - 25;
    moveRightToesXdir = g_moveRightToes - 10;;
  }


  for (i = 0; i < 4; i++) {
    ra.push(new Cube());
  }

  for (; i < 8; i++) {
    ra.push(new Prism());
    ra[i].color = [0.3,0.3,0.3,1.0];
  }

  for (i=0; i < 8; i++){
    ra[i].matrix.set(rotMat);
  }

  //ra[0].color = [1,1,1,1];
  ra[0].matrix.translate(0.17,-0.4,0.25);
  ra[0].matrix.rotate(moveLeftLegZdir,0,0,1);
  ra[0].matrix.rotate(moveLeftLegYdir,0,1,0);
  ra[0].matrix.rotate(moveLeftLegXdir,1,0,0);
  ra[0].matrix.translate(0,-0.15,-0.1);
  ra[0].matrix.scale(0.12,0.15,0.15);
  //ra[0].render();

  ra[1].matrix.scale(-1,1,1);
  ra[1].matrix.translate(0.17,-0.4,0.25);
  ra[1].matrix.rotate(moveRightLegZdir,0,0,1);
  ra[1].matrix.rotate(moveRightLegYdir,0,1,0);
  ra[1].matrix.rotate(moveRightLegXdir,1,0,0);
  ra[1].matrix.translate(0,-0.15,-0.1);
  ra[1].matrix.scale(0.12,0.15,0.15);


  ra[2].color = [0.3,0.3,0.3,1.0];
  ra[2].matrix.translate(0.169,-0.4,0.25);
  ra[2].matrix.rotate(moveLeftLegZdir,0,0,1);
  ra[2].matrix.rotate(moveLeftLegYdir,0,1,0);
  ra[2].matrix.rotate(moveLeftLegXdir,1,0,0);
  ra[2].matrix.translate(0,-0.15,0.02);
  ra[2].matrix.rotate(moveLeftFootXdir,1,0,0);
  ra[2].matrix.translate(0,-0.05,-0.12);
  ra[2].matrix.scale(0.1,0.05,0.15);


  ra[3].color = [0.3,0.3,0.3,1.0];
  ra[3].matrix.scale(-1,1,1);
  ra[3].matrix.translate(0.169,-0.4,0.25);
  ra[3].matrix.rotate(moveRightLegZdir,0,0,1);
  ra[3].matrix.rotate(moveRightLegYdir,0,1,0);
  ra[3].matrix.rotate(moveRightLegXdir,1,0,0);
  ra[3].matrix.translate(0,-0.15,0.02);
  ra[3].matrix.rotate(moveRightFootXdir,1,0,0);
  ra[3].matrix.translate(0,-0.05,-0.12);
  ra[3].matrix.scale(0.1,0.05,0.15);


 
  ra[4].matrix.translate(0.17,-0.4,0.25);
  ra[4].matrix.rotate(moveLeftLegZdir,0,0,1);
  ra[4].matrix.rotate(moveLeftLegYdir,0,1,0);
  ra[4].matrix.rotate(moveLeftLegXdir,1,0,0);
  ra[4].matrix.translate(0.1,0,0.05);
  ra[4].matrix.scale(0.1,0.15,0.1);
  ra[4].matrix.rotate(-90,0,0,1);
  ra[4].matrix.rotate(90,1,0,0);
  

  ra[5].matrix.scale(-1,1,1);
  ra[5].matrix.translate(0.17,-0.4,0.25);
  ra[5].matrix.rotate(moveRightLegZdir,0,0,1);
  ra[5].matrix.rotate(moveRightLegYdir,0,1,0);
  ra[5].matrix.rotate(moveRightLegXdir,1,0,0);
  ra[5].matrix.translate(0.1,0,0.05);
  ra[5].matrix.scale(0.1,0.15,0.1);
  ra[5].matrix.rotate(-90,0,0,1);
  ra[5].matrix.rotate(90,1,0,0);


  ra[6].matrix.translate(0.17,-0.4,0.25);
  //ra[6].matrix.rotate(moveLeftFootXdir,1,0,0);
  ra[6].matrix.rotate(moveLeftLegZdir,0,0,1);
  ra[6].matrix.rotate(moveLeftLegYdir,0,1,0);
  ra[6].matrix.rotate(moveLeftLegXdir,1,0,0);
  ra[6].matrix.translate(0,-0.15,0.02);
  ra[6].matrix.rotate(moveLeftFootXdir,1,0,0);
  ra[6].matrix.translate(0,-0.05,-0.12);
  ra[6].matrix.rotate(moveLeftToesXdir,1,0,0);
  ra[6].matrix.scale(0.1,0.05,0.15);
  ra[6].matrix.rotate(90,0,1,0);


  ra[7].matrix.scale(-1,1,1);
  ra[7].matrix.translate(0.17,-0.4,0.25);
  ra[7].matrix.rotate(moveRightLegZdir,0,0,1);
  ra[7].matrix.rotate(moveRightLegYdir,0,1,0);
  ra[7].matrix.rotate(moveRightLegXdir,1,0,0);
  ra[7].matrix.translate(0,-0.15,0.02);
  ra[7].matrix.rotate(moveRightFootXdir,1,0,0);
  ra[7].matrix.translate(0,-0.05,-0.12);
  ra[7].matrix.rotate(moveRightToesXdir,1,0,0);
  ra[7].matrix.scale(0.1,0.05,0.15);
  ra[7].matrix.rotate(90,0,1,0);

  for (i=0; i < 8; i++){
    ra[i].render();
  }
}


function renderHeadNeck(rotMat) {
  let ra = [];
  let i;
  let moveHeadXdir = g_pokeWingOffset;
  if (g_animateWalk) {
    //moveLeftLegXdir = -25*Math.sin((g_walkSpeed - (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed - (Math.PI / 2))));
    moveHeadXdir = -15*Math.sin(g_walkSpeed + (Math.PI / 2)) + g_pokeWingOffset;
  }
  //, moveHeadYdir, moveHeadZdir;

  for (i = 0; i < 3; i++) {
    ra.push(new Cube());
    ra[i].color = [0.3,0.3,0.3,1.0];
  }

  for (; i < 16; i++) {
    ra.push(new Prism());
    //ra[i].color = [0.3 - i * 0.01, 0.3 - i * 0.01, 0.3 - i * 0.01, 0.3 - i * 0.01];
    ra[i].color = [0.3,0.3,0.3,1.0];
  }

  for (i=0; i < 16; i++){
    ra[i].matrix.set(rotMat);
  }
  
  //rotMat.rotate(-10*Math.sin(g_walkSpeed),0,0,1);
  //rotMat.rotate(15*Math.sin(g_walkSpeed + (Math.PI / 2)),0,1,0);

  ra[0].color = [1,1,1,1];
  ra[0].matrix.translate(-0.15,0.5,0.075);
  ra[0].matrix.scale(0.3,0.15,0.125);
  //ra[0].render();

  ra[1].matrix.translate(-0.15,0.5,0.2);
  ra[1].matrix.scale(0.3,0.15,0.2);

  //ra[2].matrix.scale(-1,1,1);
  ra[2].matrix.translate(0,0.65,0.235);
  ra[2].matrix.rotate(moveHeadXdir,0,1,0);
  ra[2].matrix.translate(-0.1,0.00,-0.16);
  ra[2].matrix.scale(0.2,0.075,0.08);

  ra[3].color = [1,1,1,1];
  ra[3].matrix.translate(-0.15,0.5,0.075);
  ra[3].matrix.scale(0.3,0.15,0.075);
  ra[3].matrix.rotate(90,0,1,0)

  ra[4].matrix.translate(0.15,0.5,0.4);
  ra[4].matrix.scale(0.3,0.15,0.1);
  ra[4].matrix.rotate(-90,0,1,0)

  ra[5].color = [1,1,1,1];
  ra[5].matrix.translate(0.15,0.5,0.075);
  ra[5].matrix.scale(0.1,0.15,0.125);

  ra[6].color = [1,1,1,1];
  ra[6].matrix.scale(-1,1,1);
  ra[6].matrix.translate(0.15,0.5,0.075);
  ra[6].matrix.scale(0.1,0.15,0.125);


  ra[7].matrix.translate(0.15,0.5,0.2);
  ra[7].matrix.scale(0.075,0.15,0.2);

  ra[8].matrix.scale(-1,1,1);
  ra[8].matrix.translate(0.15,0.5,0.2);
  ra[8].matrix.scale(0.075,0.15,0.2);


  ra[9].matrix.translate(0,0.65,.24);
  ra[9].matrix.rotate(moveHeadXdir,0,1,0);
  ra[9].matrix.translate(0.1,0,.02);
  ra[9].matrix.scale(0.2,0.15,0.14);
  ra[9].matrix.rotate(-90,0,1,0);

  ra[10].matrix.translate(0,0.65,0.24);
  ra[10].matrix.rotate(moveHeadXdir,0,1,0);
  ra[10].matrix.translate(0.1,0.15,0.02);
  ra[10].matrix.scale(0.2,0.15,0.105);
  ra[10].matrix.rotate(180,1,0,0);
  ra[10].matrix.rotate(-90,0,1,0);

  ra[11].color = [95,0.8,0,1];
  ra[11].matrix.translate(0,0.65,0.24);
  ra[11].matrix.rotate(moveHeadXdir,0,1,0);
  ra[11].matrix.translate(0.1,0,-0.085);
  ra[11].matrix.scale(0.2,0.15,0.105);
  ra[11].matrix.rotate(-90,0,1,0);

  //ra[12].matrix.translate(-0.1,0.725,0.155);
  ra[12].matrix.translate(0,0.65,0.24);
  ra[12].matrix.rotate(moveHeadXdir,0,1,0);
  ra[12].matrix.translate(-0.1,0.075,-0.085);
  ra[12].matrix.scale(0.2,0.075,0.155);
  ra[12].matrix.rotate(90,0,1,0);

  ra[13].matrix.translate(0,0.65,0.24);
  ra[13].matrix.rotate(moveHeadXdir,0,1,0);
  ra[13].matrix.translate(-0.1,0.075,-0.165);
  ra[13].matrix.scale(0.2,0.075,0.075);
  ra[13].matrix.rotate(-90,1,0,0);
  ra[13].matrix.rotate(90,0,1,0);

  ra[14].color = [.1,.1,.1,.1];
  //ra[14].matrix.translate(-0.05,0.7,0.09);
  //ra[14].matrix.rotate(moveHeadXdir,0,1,0);
  ra[14].matrix.translate(0,0.65,0.235);
  ra[14].matrix.rotate(moveHeadXdir,0,1,0);
  ra[14].matrix.translate(-0.05,0.05,-0.145);
  ra[14].matrix.scale(0.1,0.045,0.175);
  ra[14].matrix.rotate(90,0,1,0);

  //ra[15].matrix.rotate(moveHeadXdir,0,1,0);
  ra[15].color = [.1,.1,.1,.1];
  //ra[15].matrix.translate(0.05,0.7,0.075);
  ra[15].matrix.translate(0,0.65,0.235);
  ra[15].matrix.rotate(moveHeadXdir,0,1,0);
  ra[15].matrix.translate(0.05,0.05,-0.145);
  ra[15].matrix.scale(0.1,0.035,0.175);
  ra[15].matrix.rotate(180,1,0,0);
  ra[15].matrix.rotate(-90,0,1,0);

  for (i=0; i < 16; i++){
    ra[i].render();
  }
}


function renderMiddleBodyThird() {
  // Draw the body cube
var body = new Cube();
body.color = [1.0, 0.0, 0.0, 1.0];
body.matrix.translate(-0.25, -0.75, 0.0);
body.matrix.rotate(-5, 1, 0, 0);
body.matrix.scale(0.5, 0.3, 0.5);
//body.render();


// Draw a left arm
var leftArm = new Cube();
leftArm.color = [1, 1, 0, 1];
//leftArm.matrix.setTranslate(0, -0.5, 0.0);
//leftArm.matrix.rotate(-5, 1, 0, 0);
leftArm.matrix.rotate(-g_zBodyMove , 0, 0, 1);

// Save the arm’s coordinate system BEFORE scaling
var yellowCoordinatesMat = new Matrix4(leftArm.matrix);

//leftArm.matrix.scale(0.25, 0.7, 0.5);
//leftArm.matrix.translate(-0.5, 0, 0);
leftArm.render();


// Test box
var box = new Cube();
box.color = [1, 0, 1, 1];
//box.matrix = yellowCoordinatesMat;
//box.matrix.translate(0, 0.7, 0);
//box.matrix = yellowCoordinatesMat;
box.matrix.rotate(-g_zBodyMove , 0, 0, 1);
box.matrix.translate(0, 0.7, 0);

// Optional transforms you had commented out
// box.matrix.rotate(0, 1, 0, 0);
// box.matrix.scale(1, 1, 1);
// box.matrix.translate(-1, 1, 0);
// box.matrix.rotate(-30, 1, 0, 0);
// box.matrix.scale(0.2, 0.4, 0.2);

box.render();
}

function setUpRotMat() {
  let rotMat = new Matrix4();
  
  rotMat.setRotate(g_zBodyMove,0,0,1);
  rotMat.rotate(g_yBodyMove,0,1,0);
  rotMat.rotate(g_xBodyMove,1,0,0);
  if (g_animateWalk) {
    rotMat.rotate(-10*Math.sin(g_walkSpeed),0,0,1);
    rotMat.rotate(15*Math.sin(g_walkSpeed + (Math.PI / 2)),0,1,0);
  }
  
  return rotMat;
}

// Draw every shape that is supposed to be in the canvas
// this is #5. This rtenders our scene
function renderAllShapes() {
  //check the time at the start of this function
  var startTime = performance.now();

  var globalRotMat = new Matrix4().setRotate(g_globalXAngle,1,0,0);
  globalRotMat.rotate(g_globalYAngle,0,1,0);
  globalRotMat.rotate(g_globalZAngle,0,0,1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  g_walkSpeed = g_seconds * g_speedTimes;
  let funcRotMat = setUpRotMat();

  renderUpperBody(funcRotMat);
  renderLowerBody(funcRotMat);
  renderWings(funcRotMat);
  renderLegs(funcRotMat);
  renderHeadNeck(funcRotMat);
  //renderMiddleBodyThird();
  //body.matrix.translate(-0.5,-0.5,0.0);
  //body.matrix.scale(0.5,1.0,0.5);
  //tri.render();

  //var leftArm = new Cube();
  //leftArm.color = [1.0,1.0,0.0,1.0];
  //leftArm.matrix.translate(0.7,0.0,0.0);
  //leftArm.matrix.rotate(45,0,0,1);
  //leftArm.matrix.scale(0.25,0.7,0.5);
  //leftArm.render();
 

  //check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  //console.log("about to update numdot", len, duration);
  sendTextToHTML("ms: " + Math.floor(duration) + "    fps: " + Math.floor(10000/duration)/10, "numdot");
}

/*
function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);

  //create and store the new point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  }
  else {
    point = new Circle();
    point.segments = g_selectedSegments;
  }
  point.position = [x,y];
  point.color = [g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]];
  point.size = g_selectedSize;
  g_shapesList.push(point);


  // DRAW THIS NEW STATE OF MY "WORLD"
  renderAllShapes();
}
*/

let g_startTime = performance.now() / 1000.0;
let g_seconds = performance.now() / 1000.0 - g_startTime;

//let g_poke = false;
//let g_pokeStart = 0;

//let g_pokeWingOffset = 0; // degrees added to g_moveWings
//let g_pokeHeadOffset = 0; // degrees yaw for head

//const g_pokeDuration = 2; // seconds total
//const g_pokeFlaps = 6;      // number of flaps / head sways
//const g_pokeWingAmp = 90;   // degrees
//const g_pokeHeadAmp = 20;   // degrees

function poke() {
  const t = g_seconds - g_pokeStart; // elapsed seconds since poke started
  //if (t < 0) return;
  // end poke
  if (t >= g_pokeDuration) {
    g_poke = false;
    g_pokeWingOffset = 0;
    g_pokeHeadOffset = 0;
  }
  else {
    // controls the phase. u increases as duration is worked through
    const u = t / g_pokeDuration;

    // Make g_pokeFlap full cycles over the duration:
    // e.g. if flaps = 4, sin(2π * flaps * u) => 4 flaps + 4 head sways
    const phase = 2 * Math.PI * g_pokeFlaps * u;

    // envelope deaccelerates the wing flaps
    const envelope = Math.sin(Math.PI * u); // 0 at start/end, 1 mid

    g_pokeWingOffset = g_pokeWingAmp * Math.sin(phase) * envelope;
    g_pokeHeadOffset = g_pokeHeadAmp * Math.sin(phase) * envelope;
  }
}

function tick() {
  // Save the current time
  g_seconds = performance.now() / 1000.0 - g_startTime;

  if (g_poke) {
    poke();
  } 
  //else {
   // updateAnimationAngles(); // your normal animation
  //}

  //console.log(g_seconds);
  //console.log(performance.now());
  // Update animation angles
  //updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) }}

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}