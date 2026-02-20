// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    //gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;  // uniform変数
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform int u_whichTexture;
  uniform float u_texColorWeight; //will default to zero 
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }
    else if (u_whichTexture == -1) {
      gl_FragColor = u_FragColor;
    }
    //else if (u_whichTexture == -1) {
    //  gl_FragColor = vec4(v_UV, 1.0, 1.0);
    //}
    else if (u_whichTexture == 0) {
      gl_FragColor = u_FragColor;
    }
    else if (u_whichTexture == 1) { //sky 1
      //gl_FragColor = texture2D(u_Sampler0, v_UV);
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler0, v_UV);
    }
    else if (u_whichTexture == 2) { //sky 2
      //gl_FragColor = texture2D(u_Sampler1, v_UV);
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler1, v_UV);
    }
    else if (u_whichTexture == 3) { //sky 3
      //gl_FragColor = texture2D(u_Sampler1, v_UV);
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler2, v_UV);
    }
    else if (u_whichTexture == 4) { //wall 1
      //gl_FragColor = texture2D(u_Sampler1, v_UV);
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler3, v_UV);
    }
    else if (u_whichTexture == 5) { //wall 2
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler4, v_UV);
    }
    else if (u_whichTexture == 6) { //wall 3
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler5, v_UV);
    }
    else if (u_whichTexture == 7) { //wall 0
      gl_FragColor = (1.0 - u_texColorWeight) * u_FragColor + u_texColorWeight * texture2D(u_Sampler6, v_UV);
    }
    else {
      gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); 
    }
  }`
  
// Global Variables
let canvas;
let gl;

let a_Position;
let a_UV;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_ModelMatrix;

let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_whichTexture;
let u_texColorWeight;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_camera;
let g_maze;
//let u_Size;

let g_isDragging = false;
let g_lastMouseX = 0;
let g_lastMouseY = 0;
let g_yaw = 0;
let g_pitch = 0;

let g_penguin_list = [];

//PENGUIN GLOBAL VARIABLES
let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_globalZAngle = 0;

let g_startTime = performance.now() / 1000.0;
let g_seconds = performance.now() / 1000.0 - g_startTime;

let g_terrain_map = [];
let g_mapNum = 0;

let g_map = [
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];

/*
function setupPageStyle(){ .. }
function updateCursorColor{ .. }

refer to asgn 1 or 2 for these functions
*/

// code from CSE 160 helper videos
function sendTextToHTML(text, htmlID) {
  var hmtlElm = document.getElementById(htmlID);
  if (!hmtlElm) {
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  hmtlElm.innerHTML = text;
}

/*
function addMouseRotateControls(canvas) {
  canvas.addEventListener("mousedown", (ev) => {
    g_isDragging = true;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;
  });

  window.addEventListener("mouseup", () => { g_isDragging = false; });

  window.addEventListener("mousemove", (ev) => {
    if (!g_isDragging) return;

    const dx = ev.clientX - g_lastMouseX;
    const dy = ev.clientY - g_lastMouseY;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;

    // sensitivity: degrees per pixel
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
}*/

function keydown(ev) {
  if(ev.keyCode == 65) { // 'A' was pressed. go left
    g_camera.moveLeft();
  } 
  else if (ev.keyCode == 87) {  // 'W' was pressed. go forward
    g_camera.moveForward();
  } 
  else if (ev.keyCode == 68) { // 'D' was pressed. go right
    g_camera.moveRight();
  } 
  else if (ev.keyCode == 83) { // 'S' was pressed. go backwards
    g_camera.moveBackwards();
  } 
  else if (ev.keyCode == 81) { // 'Q' pressed. pan left
    g_camera.panLeft(1);
  }
  else if (ev.keyCode == 69) { // 'E' pressed. pan right
    g_camera.panRight(1);
  }
  else { return; }
}

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  //setupPageStyle();
  //addMouseRotateControls(canvas);

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

  // // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  // failure returns -1
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

    // get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  // failure returns null
  if (!u_ProjectionMatrix) {
     console.log('Failed to get the storage location of u_ProjectionMatrix');
     return;
  }

  // get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  // failure returns null
  if (!u_ViewMatrix) {
     console.log('Failed to get the storage location of u_ViewMatrix');
     return;
  }

  // get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    // failure returns null
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
     return;
  }

  // get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // failure returns null
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_Sampler
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Get the storage location of u_Sampler
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  // Get the storage location of u_Sampler
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }
  
  // Get the storage location of u_Sampler
  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return false;
  } 

  // Get the storage location of u_Sampler
  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to get the storage location of u_Sampler6');
    return false;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  // failure returns null
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  // failure returns null
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  } 
  
  // Get the storage location of u_texColorWeight
  u_texColorWeight = gl.getUniformLocation(gl.program, 'u_texColorWeight');
  // failure returns null
  if (!u_texColorWeight) {
    console.log('Failed to get the storage location of u_texColorWeight');
    return;
  }

}

function onMove(ev, tilt) {
    const dx = ev.clientX - g_lastMouseX;
    const dy = ev.clientY - g_lastMouseY;
  
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;
  
    const sensitivity = 0.2;
  
    // Horizontal movement → pan camera left/right
    if (dx > 0) {
      g_camera.panRight(dx * sensitivity);
    } else if (dx < 0) {
      g_camera.panLeft(-dx * sensitivity);
    }
  
    if (tilt) {
      // Vertical movement → tilt camera up/down
      if (dy < 0) {
        g_camera.panUp(dy * sensitivity);
      } else if (dy > 0) {
        g_camera.panDown(-dy * sensitivity);
      }
    }
  
    //renderAllShapes();
}

function addBlock(){
  let d = new Vector3(g_camera.at.elements);
  let d2 = new Vector3();
  let addedOofBs = 0;
  let i, posZ, posX, z, x, eyeZ, eyeX;

  d.sub(g_camera.eye);
  d.normalize();
  i = 1;
  //console.log("d: " + d.elements);

  while (!addedOofBs && i < 16) {
    d2.set(d).mul(0.2 * i);
    //console.log("i" + i + ": " + vec.elements);
    posZ = g_camera.eye.elements[2] + d2.elements[2];
    posX = g_camera.eye.elements[0] + d2.elements[0];
    //console.log("vecZ: " + vecZ + "     vecX: " + vecX);
    if ((-16 < posZ && posZ < 16) && (-16 < posX && posX < 16)) {
      z = Math.floor(posZ) + 16;
      x = Math.floor(posX) + 16;
      if (g_map[z][x] == 1) {
        // relocate if the magnitude of my vector / d2 is less than 2
        d2.set(d).mul(0.2 * (i - 1));
        z = Math.floor(g_camera.eye.elements[2] + d2.elements[2]) + 16;
        x = Math.floor(g_camera.eye.elements[0] + d2.elements[0]) + 16;
        g_map[z][x] = 1;
        g_camera.map = structuredClone(g_map);
        console.log("magnitude of d2: " + d2.magnitude());
        
        eyeZ = Math.floor(g_camera.eye.elements[2]) + 16;
        eyeX = Math.floor(g_camera.eye.elements[0]) + 16;
        //console.log("eyeZ, eyeX: " + eyeZ + ", " + eyeX);
        if (g_map[eyeZ][eyeX] == 1) {
          d2.set(g_camera.eye).sub(d);
          z = Math.floor(d2.elements[2]) + 16;
          x = Math.floor(d2.elements[0]) + 16;
          //console.log("in g_map[eyeZ][eyeX] == 1")
          //console.log("z, x: " + z + ", " + x);
          //console.log("eyeZ, eyeX: " + eyeZ + ", " + eyeX);
          //console.log("g_camera.eye: " + g_camera.eye.elements);
          if ((1 < z && z < 31) && (1 < x && x < 31) && g_map[z][x] == 0){
            //console.log("in this");
            g_camera.eye.sub(d);
            g_camera.at.sub(d);
          }
          else {
            //console.log("in this?")
            //console.log("eyeZ, eyeX: " + eyeZ + ", " + eyeX);
            g_map[eyeZ][eyeX] = 0;
            g_camera.map = structuredClone(g_map);
            //console.log(g_map);
          }
        }
        
        //console.log(g_map);
        g_camera.map = structuredClone(g_map);
        addedOofBs = 1;
      }
    }
    else {
      addedOofBs = 1;
      //console.log("out of bounds");
    }
    i++;
  }
  console.log("addBlock() success");
}

function deleteBlock() {
  let d = new Vector3(g_camera.at.elements);
  let d2 = new Vector3();
  let deletedOofBs = 0;
  let i, posZ, posX, z, x;

  d.sub(g_camera.eye);
  d.normalize();
  i = 1;
  //console.log("d: " + d.elements);

  while (!deletedOofBs && i < 16) {
    d2.set(d).mul(0.2 * i);
    //console.log("i" + i + ": " + vec.elements);
    posZ = g_camera.eye.elements[2] + d2.elements[2];
    posX = g_camera.eye.elements[0] + d2.elements[0];
    //console.log("vecZ: " + vecZ + "     vecX: " + vecX);
    if ((-16 < posZ && posZ < 16) && (-16 < posX && posX < 16)) {
      z = Math.floor(posZ) + 16;
      x = Math.floor(posX) + 16;
      if (g_map[z][x] == 1) {
        g_map[z][x] = 0;
        //console.log(g_map);
        g_camera.map = structuredClone(g_map);
        deletedOofBs = 1;
      }
    }
    else {
      deletedOofBs = 1;
      //console.log("out of bounds");
    }
    i++;
  }

  //console.log("deleteBlock() success");
}

function generateMaze1() {
  console.log("inside Maze1");
}

function addActionsForHtmlUI(){
  
  document.onkeydown = function(ev){ keydown(ev); };

  canvas.addEventListener("mousemove", (ev) => {
    // First movement: initialize
    if (g_lastMouseX === 0 && g_lastMouseY === 0) {
      g_lastMouseX = ev.clientX;
      g_lastMouseY = ev.clientY;
      return;
    }
    onMove(ev, 0);
  });
  
  canvas.addEventListener("mouseleave", () => {
    g_lastMouseX = 0;
    g_lastMouseY = 0;
  });

  canvas.addEventListener("click", (ev) => {
    if (g_mapNum == 0) {
      if (ev.shiftKey){
        // start poke animation
        deleteBlock();
      }
      else {
        addBlock();
      }
    }
  });

  document.getElementById('generateMaze1').onclick = function() {
    g_mapNum = 1;
    g_camera.eye.set(new Vector3([-15,-4.5,-15]));
    g_camera.at.set(new Vector3([80,-4.5,80]));
    g_camera.setLook();
    g_camera.map = structuredClone(g_maze.maze1);
  };

  document.getElementById('generateMaze2').onclick = function() {
    g_mapNum = 2;
    g_camera.eye.set(new Vector3([-15,-4.5,-15]));
    g_camera.at.set(new Vector3([80,-4.5,80]));
    g_camera.setLook();
    g_camera.map = structuredClone(g_maze.maze2);
  };

  document.getElementById('generateMaze3').onclick = function() {
    g_mapNum = 3;
    g_camera.eye.set(new Vector3([-15,-4.5,-15]));
    g_camera.at.set(new Vector3([80,-4.5,80]));
    g_camera.setLook();
    g_camera.map = structuredClone(g_maze.maze3);
  };

  document.getElementById('originalMap').onclick = function() {
    g_mapNum = 0;
    g_camera.eye.set(new Vector3([0,-4.5,0]));
    g_camera.at.set(new Vector3([0,-4.5,-100]));
    g_camera.setLook();
    g_camera.map = structuredClone(g_map);
  };
  /*0
  // Move Camera x-wise
  document.getElementById('xSlide').addEventListener('mousemove',   function() { 
    g_globalXAngle = Number(this.value);
  });
    
  // Move Camera y-wise
  document.getElementById('ySlide').addEventListener('mousemove',   function() { 
    g_globalYAngle = Number(this.value);
  });
  // Move Camera y-wise
  document.getElementById('zSlide').addEventListener('mousemove',   function() { 
    g_globalZAngle = Number(this.value);
  });
  */

  
  /*
  canvas.addEventListener("click", (ev) => {
    if (ev.shiftKey){
      // start poke animation
      g_penguin.startPoke(g_seconds);
    }
  });

  document.getElementById('animateWalkON').onclick = function() {g_penguin.animateWalk = true;};
  document.getElementById('animateWalkOFF').onclick = function() {g_penguin.animateWalk = false;}; 
  document.getElementById('walkSpeedSlider').addEventListener('mousemove',   function() { 
    g_penguin.speedTimes = Number(this.value);
  });

  document.getElementById('wingsSlider').addEventListener('mousemove',   function() { 
    g_penguin.moveWings = Number(this.value);
  });

  document.getElementById('leftLeg').addEventListener('mousemove',   function() { 
    g_penguin.moveLeftLeg = Number(this.value);
  });
  document.getElementById('leftFoot').addEventListener('mousemove',   function() { 
    g_penguin.moveLeftFoot = Number(this.value);
  });
  document.getElementById('leftToes').addEventListener('mousemove',   function() { 
    g_penguin.moveLeftToes = Number(this.value);
  });
  document.getElementById('rightLeg').addEventListener('mousemove',   function() { 
    g_penguin.moveRightLeg = Number(this.value);
  });
  document.getElementById('rightFoot').addEventListener('mousemove',   function() { 
    g_penguin.moveRightFoot = Number(this.value);
  });
  document.getElementById('rightToes').addEventListener('mousemove',   function() { 
    g_penguin.moveRightToes = Number(this.value);
  });
  */
}

function initTextures() {

  var image0 = new Image();  // Create the image object
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }
  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  var image3 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  var image4 = new Image();  // Create the image object
  if (!image4) {
    console.log('Failed to create the image object');
    return false;
  }
  var image5 = new Image();  // Create the image object
  if (!image5) {
    console.log('Failed to create the image object');
    return false;
  }
  var image6 = new Image();  // Create the image object
  if (!image6) {
    console.log('Failed to create the image object');
    return false;
  }



  // Register the event handler to be called on loading an image
  // Attach listeners before starting the action that triggers them! I.e. image.src will trigger .onload
  image0.onload = function(){ sendImageToTEXTURE(image0, 0); };
  // Tell the browser to load an image
  image0.src = '../resources/stars1.jpg';

  //add more textures here
  image1.onload = function(){ sendImageToTEXTURE(image1, 1); };
  // Tell the browser to load an image
  image1.src = '../resources/stars2.jpg';

  image2.onload = function(){ sendImageToTEXTURE(image2, 2); };
  // Tell the browser to load an image
  image2.src = '../resources/stars3.jpg';

  image3.onload = function(){ sendImageToTEXTURE(image3, 3); };
  // Tell the browser to load an image
  image3.src = '../resources/wall1.jpg';

  image4.onload = function(){ sendImageToTEXTURE(image4, 4); };
  // Tell the browser to load an image
  image4.src = '../resources/wall2.jpg';

  image5.onload = function(){ sendImageToTEXTURE(image5, 5); };
  // Tell the browser to load an image
  image5.src = '../resources/wall3.jpg';

  image6.onload = function(){ sendImageToTEXTURE(image6, 6); };
  // Tell the browser to load an image
  image6.src = '../resources/wall0.jpg';


  //return true;
}

function sendImageToTEXTURE(image, sN) {
  let texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0

  if (sN == 0) {
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
  }
  else if (sN == 1) {
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler1, 1);
  }
  else if (sN == 2) {
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler2, 2);
  }
  else if (sN == 3) {
    gl.activeTexture(gl.TEXTURE3);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler3, 3);
  }
  else if (sN == 4) {
    gl.activeTexture(gl.TEXTURE4);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler4, 4);
  }

  else if (sN == 5) {
    gl.activeTexture(gl.TEXTURE5);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler5, 5);
  }

  else if (sN == 6) {
    gl.activeTexture(gl.TEXTURE6);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    // how do I create a mipmap of my texture?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // CHANGE last parameter to use mipmapping 

    // Set the texture image
    //UNSIGNED_BYTE means that the data has max value of 1111 1111, or 255 in decimal
    const isPNG = image.src.toLowerCase().endsWith(".png");
    const fmt = isPNG ? gl.RGBA : gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler6, 6);
  }
  
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log("finish loading texture" + sN);
}

function generateTerrain() {
  let i, j;
  for (i = 0; i < 32; i++) {
    g_terrain_map.push([]);
    for (j = 0; j < 32; j++) {
      g_terrain_map[i].push(Math.floor(Math.random() * 4) + 1);
    }
  }

  for (i = 0; i < 32; i++) {
    g_maze.terrain1.push([]);
    for (j = 0; j < 32; j++) {
      if (i == 0 || i == 31) {
        g_maze.terrain1[i].push(4);
      }
      else if (j == 0 || j == 31) {
        g_maze.terrain1[i].push(4);
      }
      else {
        g_maze.terrain1[i].push(Math.floor(Math.random() * 4) + 1);
      }
    }
  }

  for (i = 0; i < 32; i++) {
    g_maze.terrain2.push([]);
    for (j = 0; j < 32; j++) {
      if (i == 0 || i == 31) {
        g_maze.terrain2[i].push(4);
      }
      else if (j == 0 || j == 31) {
        g_maze.terrain2[i].push(4);
      }
      else {
        g_maze.terrain2[i].push(Math.floor(Math.random() * 4) + 1);
      }
    }
  }

  for (i = 0; i < 32; i++) {
    g_maze.terrain3.push([]);
    for (j = 0; j < 32; j++) {
      if (i == 0 || i == 31) {
        g_maze.terrain3[i].push(4);
      }
      else if (j == 0 || j == 31) {
        g_maze.terrain3[i].push(4);
      }
      else {
        g_maze.terrain3[i].push(Math.floor(Math.random() * 4) + 1);
      }
    }
  }
  //console.log(g_terrain_map);
}

function renderSkyTerrain(skytexNum, groundtexNum) {
  let sky = new Cube();
  let size = 32;
  sky.textureNum = skytexNum;
  sky.texWeight = 1;
  sky.color = [0.0, 0.3, 0.6, 1.0]
  sky.matrix.setScale(size, size, size);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  //ground.matrix.rotate(180, 0,0,1);
  sky.render();

  let ground = new Cube();
  ground.textureNum = groundtexNum;
  ground.texWeight = 0.5;
  ground.color = [0.0, 0.0, 0.0, 1.0]
  ground.matrix.setTranslate(0, -5.5, 0);
  ground.matrix.scale(size, 1, size);
  ground.matrix.translate(-0.5, -0.5, -0.5);
  //ground.matrix.rotate(180, 0,0,1);
  ground.render();
  
}


function renderWalls(texNum) {
  let block = new Cube();
  let size = 32;
  block.textureNum = texNum;
  block.texWeight = 1;
  //let z_limit;
  //block.translate(-0.5, -0.5, -0.5)

  for (let z = 0; z < size; z++ ) {
    for (let x = 0; x < size; x++) {
      if (g_map[z][x]) {
        //z_limit = Math.floor(Math.random() * 4) + 1;
        //dz_limit = 4;
        for (let y = 0; y < g_terrain_map[z][x]; y++) {
          //block.color = [0.0, 0.2, 0.0, 1.0];
          block.matrix.setTranslate(-16 + x, -5 + y, -16 + z);
          block.render();
        }
      }
    }
  }
  //console.log("g_map[19][12]: " + g_map[19][12]);

  //block.textureNum = 0;
  //block.texWeight = 1;
  //block.matrix.setScale(1, 1, 1);
  //block.render();

}

function renderPenguins() {
  let scale = 0.4;
  if (g_mapNum == 0) {
    g_penguin_list[0].wholeBodyTransform(scale, -15,-4.75,-15, 0,-135,0);
    g_penguin_list[0].render();
    g_penguin_list[1].wholeBodyTransform(scale, 15,-4.75,-15, 0,135,0);
    g_penguin_list[1].render();
    g_penguin_list[2].wholeBodyTransform(scale, 15,-4.75, 15, 0,45,0);
    g_penguin_list[2].render();
    g_penguin_list[3].wholeBodyTransform(scale, -15,-4.75,15, 0,-45,0);
    g_penguin_list[3].render();
  }
  else {
    g_penguin_list[0].wholeBodyTransform(scale, 15,-4.75, 15, 0,45,0);
    g_penguin_list[0].render();
  }
}


// Draw every shape that is supposed to be in the canvas
// this is #5. This rtenders our scene
function renderAllShapes() {
  //check the time at the start of this function
  var startTime = performance.now();

  //pass the projection matrix
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);
  
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);
  
  var globalRotMat = new Matrix4().setRotate(g_globalXAngle,1,0,0);
  globalRotMat.rotate(g_globalYAngle,0,1,0);
  globalRotMat.rotate(g_globalZAngle,0,0,1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //let setMat = g_penguin.wholeBodyTransform(0.4, 0, 0, 0);
  //g_penguin.render(setMat);

  if (g_mapNum == 0) {
    renderSkyTerrain(0, 6);
    renderWalls(7);
    renderPenguins();
  }
  else {
    if (g_mapNum == 1) {
      renderSkyTerrain(1, 1);
      renderPenguins();
      g_maze.maze1Tex = 4;
      g_maze.renderMaze1();
    }
    else if (g_mapNum == 2) {
      renderSkyTerrain(2, 2);
      renderPenguins();
      g_maze.maze2Tex = 5;
      g_maze.renderMaze2();
    }
    else if (g_mapNum == 3) {
      renderSkyTerrain(3, 3);
      renderPenguins();
      g_maze.maze3Tex = 6;
      g_maze.renderMaze3();
    }
  }


  //check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  //console.log("about to update numdot", len, duration);
  sendTextToHTML("ms: " + Math.floor(duration) + "    fps: " + Math.floor(10000/duration)/10, "numdot");
}


function tick() {
  // Save the current time
  g_seconds = performance.now() / 1000.0 - g_startTime;

  //g_penguin.update(g_seconds);

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  initTextures();

  for (let i = 0; i < 4; i++) {
    g_penguin_list.push(new Penguin());
  }
  g_camera = new Camera();
  g_camera.projectionMatrix.setPerspective(60, canvas.width/canvas.height, 0.01, 100);
  g_camera.eye.set(new Vector3([0,-4.5,0]));
  //g_camera.eye.set(new Vector3([0,-1,0]));
  //g_camera.eye.set(new Vector3([0,0,3]));
  g_camera.at.set(new Vector3([0,-4.5,-100]));
  //g_camera.at.set(new Vector3([0,0,-100]));
  g_camera.up.set(new Vector3([0,1,0])); //eye, at, then up array as arguments
  g_camera.map = structuredClone(g_map);
  //console.log(g_camera.map);
  g_camera.setLook();

  g_maze = new Maze();
  generateTerrain();
  //console.log(g_maze.terrain1);
  //console.log(g_maze.terrain2);
  //console.log(g_maze.terrain3);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.55, 0.6, 1.0);

  requestAnimationFrame(tick);
}