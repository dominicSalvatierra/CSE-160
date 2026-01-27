// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  //uniform float u_Segments;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 50.0;
    gl_PointSize = u_Size;
    //gl_Segments = u_Segments;
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
let u_Size;
//let u_Segments;
var g_shapesList= [];
//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_size = []; // The array to store the size of the clicked point
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedSegments = 10.0;
let g_selectedType = POINT;
let g_draw = 0;

function setupPageStyle(){
  const cursor = document.createElement('div');
  cursor.id = 'fakeCursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // this property allows me to reflect the color of my selected color
  document.documentElement.style.setProperty('--ui-accent', `rgb(${255},${255},${255})`);
}

function updateCursorColor(){
  document.documentElement.style.setProperty('--ui-accent', `rgb(${g_selectedColor[0] * 255},${g_selectedColor[1] * 255},${g_selectedColor[2] * 255})`);
}

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  setupPageStyle();

  //get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  // failure returns null
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  // Get the storage location of u_Segments
  //u_Segments = gl.getUniformLocation(gl.program, 'u_Segments');
  // failure returns null
 // if (!u_Segments) {
  //  console.log('Failed to get the storage location of u_Segments');
  //  return;
 // }
}

function deleteBrushStroke(){
  g_shapesList.pop();
  renderAllShapes();
}

function addActionsForHtmlUI(){
  // BUTTON Events (shape type)
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes();};
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;};
  document.getElementById('triButton').onclick = function() {g_selectedType = TRIANGLE;};
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;};
  document.getElementById('delete').onclick = function() {deleteBrushStroke();};
  document.getElementById('drawPicture').onclick = function() {
    let point = new Triangle();
    point.draw = 1;
    g_shapesList.push(point);
    renderAllShapes();
  };


  // SLIDER Events
  // Size Adjust
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
  });
  // Segments Adjust
  document.getElementById('circleSegments').addEventListener('mouseup',   function() { g_selectedSegments = this.value; });
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

function sendTextToHTML(text, htmlID) {
  var hmtlElm = document.getElementById(htmlID);
  if (!hmtlElm) {
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  hmtlElm.innerHTML = text;
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  //check the time at the start of this function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  //var len = g_points.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  //check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  //console.log("about to update numdot", len, duration);
  sendTextToHTML("numdot: " +  len + "    ms: " + Math.floor(duration) + "    fps: " + Math.floor(10000/duration)/10, "numdot");
}

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

  // UPDATE THE STATE OF MY "WORLD"
  // Store the coordinates to g_points array
  //g_points.push([x, y]);

  // Store the color to g_colors array
  //g_colors.push([g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]]);

  // Store the size to the g_size array
  //g_size.push(g_selectedSize);
  /*
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  */

  // DRAW THIS NEW STATE OF MY "WORLD"
  renderAllShapes();
}


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) }}

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}