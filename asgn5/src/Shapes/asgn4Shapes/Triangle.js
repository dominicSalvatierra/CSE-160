class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    
    this.vertexUVBuffer = null;
    this.vrtxUVNrmlBuffer = null;
    this.successCOUNT = 0;

    //this.uvBuffer = null;
  }
}

  
//function initVertexBuffers(gl) {

//function initVertexBuffers(gl) {
  function drawSingleTriangle3DUVNormal(vertices, uvs, normals) {

    var n = vertices.length / 3;
      
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

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Create a buffer object
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
      
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
      
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);

    // Create a buffer object
    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
      
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
      
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Normal);
      
    gl.drawArrays(gl.TRIANGLES, 0, n);

    //g_vertexBuffer = null;
    //return n;
  }
    
function drawTriangle3DUV(vertices, n) {  
  //var n = 3; // The number of vertices
  const data = new Float32Array(vertices);
        
  // Create a buffer object
  if (!this.vertexUVBuffer) {
    this.vertexUVBuffer = gl.createBuffer();
    if (!this.vertexUVBuffer) {
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


function drawTriangle3DUVNrml(vertices, n) {  
  //var n = 3; // The number of vertices
  const data = new Float32Array(vertices);
        
  // Create a buffer object
  if (!this.vrtxUVNrmlBuffer) {
    this.vrtxUVNrmlBuffer = gl.createBuffer();
    if (!this.vrtxUVNrmlBuffer) {
      console.log('Failed to create the vertexUVBuffer object');
      return -1;
    }
  }
        
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vrtxUVNrmlBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

  var FSIZE = data.BYTES_PER_ELEMENT;
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  
  // Assign the buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
      // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);

    // Assign the buffer object to a_Normal variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
      // Enable the assignment to a_Normal variable
  gl.enableVertexAttribArray(a_Normal);
        
  gl.drawArrays(gl.TRIANGLES, 0, n);
  //console.log(this);
  //console.log("Success: " + this.successCOUNT);
  //this.successCOUNT += 1;
  //return n;
}
  