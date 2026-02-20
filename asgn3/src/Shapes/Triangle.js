class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    
    this.vertexUVBuffer = null;
    //this.uvBuffer = null;
  }
}


//function initVertexBuffers(gl) {
  function drawTriangle3D(vertices, n) {
    //  var vertices = new Float32Array([
    //    0, 0.5,   -0.5, -0.5,   0.5, -0.5
    //  ]);
    //var n = 3; // The number of vertices
      
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
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
      
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
  }

  
//function initVertexBuffers(gl) {
    
function drawTriangle3DUV(vertices, n) {  
  //var n = 3; // The number of vertices
  const data = new Float32Array(vertices);
        
  // Create a buffer object
  if (!this.vertexUVBuffer) {
    this.vertexUVBuffer = gl.createBuffer();
    if (!vertexUVBuffer) {
      console.log('Failed to create the vertexUVBuffer object');
      return -1;
    }
  }
        
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexUVBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

  var FSIZE = data.BYTES_PER_ELEMENT;
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  
  // Assign the buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
      // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);
        
  gl.drawArrays(gl.TRIANGLES, 0, n);
  //return n;
}
  