/*
// HelloTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  //gl.drawArrays(gl.TRIANGLES, 0, n);
  drawTriangle([0, 0.5,  -0.5, 0.5,  0.5, -0.5]);
}
*/
class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.draw = 0;
  }

  render() {
    if (this.draw){
      this.renderDrawing();
      return;
    }
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;
    //var xy = g_shapesList[i].position;
    //var rgba = g_shapesList[i].color;
    //var size = g_shapesList[i].size;
    //var xy = g_points[i];
    //var rgba = g_colors[i];
    //var size = g_size[i];

    // Pass the position of a vertex to a_Position variable
//    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of the triangle to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of a triangle to u_Size variable
    gl.uniform1f(u_Size, size);
    // Draw
    //gl.drawArrays(gl.POINTS, 0, 1);
    var d = this.size/200.0; // delta
    drawTriangle( [xy[0], xy[1],  xy[0]+d, xy[1],  xy[0], xy[1]+d] )
  }

  randomizeColor(num) {
    let upLimit =  90;
    let midLimit = 50;
    let lowLimit = 30;
    //magentas
    if (num == 0) {
      this.color[0] = Math.random() * (upLimit - midLimit) + midLimit;
      this.color[1] = Math.random() * (lowLimit);
      this.color[2] = Math.random() * (upLimit - midLimit) + midLimit;
    }
    //greens
    else if (num == 1) {
      this.color[0] = Math.random() * (lowLimit);;
      this.color[1] = Math.random() * (upLimit - midLimit) + midLimit;
      this.color[2] = Math.random() * (lowLimit);
    }
    //cyans
    else if (num == 2) {
      this.color[0] = Math.random() * (lowLimit);
      this.color[1] = Math.random() * (upLimit - midLimit) + midLimit;
      this.color[2] = Math.random() * (upLimit - midLimit) + midLimit;
    }
    //blues
    else {
      this.color[0] = Math.random() * (lowLimit);
      this.color[1] = Math.random() * (lowLimit);
      this.color[2] = Math.random() * (upLimit - midLimit) + midLimit;
    }
  
    //divide colors into a range that can be read by webgl
    this.color[0] /= 100;
    this.color[1] /= 100;
    this.color[2] /= 100;
  }

  findSign(angle) {
    let signs = [1, 1];
    if (Math.cos(angle) < 0) {
      signs[0] = -1;
    }
    else {
      signs[0] = 1;
    }
    if (Math.sin(angle) < 0) {
      signs[1] = -1;
    }
    else {
      signs[1] = 1;
    }
    return signs;
  }
  
  renderDrawing() {
    let i = 0;
    let angle = Math.PI / 4;
    let xSign, ySign;
    let xySigns = [];
    //let lowLimit = 0;
    while (i < 4) {
      xySigns = this.findSign(angle);
      //console.log()
      xSign = xySigns[0];
      ySign = xySigns[1];
  
      // Shape 1
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [0, 0,  0, ySign * 0.4,  xSign * 0.4, 0] );
      // Shape 2
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [xSign * 0.32, ySign * 0.32,  0, ySign * 0.4,  xSign * 0.4, 0] );
      // Shape 3 and its Reflection 
      // if in 1st, then top half first ...
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [xSign * 0.32, ySign * 0.32,  0, ySign * 0.4,  xSign * 0.57, ySign * 0.57] );
      // now let's do it's bottom half
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [xSign * 0.32, ySign * 0.32,  xSign * 0.57, ySign * 0.57,  xSign * 0.4, 0] );
      // Shape 4 and its Reflection 
      // if in 1st, then top half first ...
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [xSign * 0.25, ySign * 0.6,  0, ySign * 0.4,  xSign * 0.57, ySign * 0.57] );
      // now let's do it's bottom half
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [xSign * 0.6, ySign * 0.25,  xSign * 0.57, ySign * 0.57,  xSign * 0.4, 0] );
      // Shape 5 and its Reflection 
      // if in 1st, then top half first ...
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [0, ySign * 0.63,  0, ySign * 0.4,  xSign * 0.128, ySign * 0.5024] );
      // now let's do it's bottom half
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [xSign * 0.5024, ySign * 0.128,  xSign * 0.63, 0,  xSign * 0.4, 0] );
      // Shape 6 and its Reflection 
      // if in 1st, then top half first ...
      this.randomizeColor(i);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, 100);
      drawTriangle( [0, ySign * 0.63,  0, ySign,  xSign * 0.08, ySign * 0.815] );
      // now let's do it's bottom half
      //this.randomizeColor(i);
      //gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      //gl.uniform1f(u_Size, 100);
      //drawTriangle( [xSign * 0.63, 0,  xSign, 0,  xSign * 0.815, ySign * 0.08] );
  
      i += 1;
      angle += Math.PI / 2;
    }
  }
}


//function initVertexBuffers(gl) {
function drawTriangle(vertices) {
//  var vertices = new Float32Array([
//    0, 0.5,   -0.5, -0.5,   0.5, -0.5
//  ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//  if (a_Position < 0) {
//    console.log('Failed to get the storage location of a_Position');
//    return -1;
//  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  //return n;
}
