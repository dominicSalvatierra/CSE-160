class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();

    this.textureNum = -1;
    this.texWeight = 0;

    this.vertexUVcoord = new Float32Array([
      0.0,0.0,1.0,  0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,  1.0,1.0,1.0,  1.0,1.0,   //front. Top half
      0.0,0.0,1.0,  0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,   //front. bottom half
      0.0,0.0,0.0,  1.0,0.0,  0.0,1.0,0.0,  1.0,1.0,  1.0,1.0,0.0,  0.0,1.0,   //back. Top half
      0.0,0.0,0.0,  1.0,0.0,  1.0,0.0,0.0,  0.0,0.0,  1.0,1.0,0.0,  0.0,1.0,   //back. bottom half
      0.0,1.0,0.0,  0.0,1.0,  1.0,1.0,0.0,  1.0,1.0,  1.0,1.0,1.0,  1.0,0.0,   //top. far half
      0.0,1.0,0.0,  0.0,1.0,  0.0,1.0,1.0,  0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,   //top. close half
      0.0,0.0,0.0,  0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,  1.0,0.0,1.0,  1.0,1.0,   //bottom. far half
      0.0,0.0,0.0,  0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,  1.0,0.0,1.0,  1.0,1.0,   //bottom. close half
      0.0,0.0,0.0,  0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,   //left. Top half
      0.0,0.0,0.0,  0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,   //left. bottom half
      1.0,0.0,0.0,  1.0,0.0,  1.0,1.0,0.0,  1.0,1.0,  1.0,1.0,1.0,  0.0,1.0,   //right. Top half
      1.0,0.0,0.0,  1.0,0.0,  1.0,0.0,1.0,  0.0,0.0,  1.0,1.0,1.0,  0.0,1.0    //right. bottom half
    ])
  }

  render() {
    var rgba = this.color;
    
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform1f(u_texColorWeight, this.texWeight);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);

    //console.log(this.vertexUVcoord.length / 5);

    drawTriangle3DUV( this.vertexUVcoord, this.vertexUVcoord.length / 5 );
  }

  renderSlow() {
    var rgba = this.color;
    
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform1f(u_texColorWeight, this.texWeight);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);

    // 1. front of cube
    drawTriangle3DUV( [
      0.0,0.0,0.0,  1.0,0.0,
      1.0,1.0,0.0,  0.0,1.0,
      1.0,0.0,0.0,  0.0,0.0
    ], 3 );
    drawTriangle3DUV( [
      0.0,0.0,0.0,  1.0,0.0,
      1.0,1.0,0.0,  0.0,1.0,
      0.0,1.0,0.0,  1.0,1.0
    ], 3 );
    //drawTriangle3D( [0.0,0.0,0.0,  1.0,0.0,0.0,  1.0,1.0,0.0] ); //1A
    //drawTriangle3D( [0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0] ); //1B

    //gl.uniform4f(u_FragColor, rgba[0]*0.97, rgba[1]*0.97, rgba[2]*0.97, rgba[3]);
    gl.uniform4f(u_FragColor, 0,0, 0.5, rgba[3]);
    // 2. back of cube
    drawTriangle3D( [0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0], 3 ); //2A
    drawTriangle3D( [0.0,0.0,1.0,  1.0,0.0,1.0,  1.0,1.0,1.0], 3 ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.94, rgba[1]*0.94, rgba[2]*0.94, rgba[3]);
    // 3. top of cube
    drawTriangle3D( [0.0,1.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0], 3 ); //2A
    drawTriangle3D( [0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0], 3 ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.91, rgba[1]*0.91, rgba[2]*0.91, rgba[3]);
    // 4. bottom of cube
    drawTriangle3D( [0.0,0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,1.0], 3 ); //2A
    drawTriangle3D( [0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0], 3 ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.88, rgba[1]*0.88, rgba[2]*0.88, rgba[3]);
    // 4. left face of cube
    drawTriangle3D( [0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0], 3 ); //2A
    drawTriangle3D( [0.0,0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,1.0], 3 ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
    // 4. right face of cube
    drawTriangle3DUV( [
      1.0,0.0,0.0,  1.0,1.0,
      1.0,1.0,0.0,  0.0,1.0,
      1.0,1.0,1.0,  0.0,0.0
    ], 3 );
    drawTriangle3DUV( [
      1.0,0.0,0.0,  1.0,1.0,
      1.0,0.0,1.0,  1.0,0.0,
      1.0,1.0,1.0,  0.0,0.0
    ], 3 );
    //drawTriangle3D( [1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0] ); //2A
    //drawTriangle3D( [1.0,0.0,0.0,  1.0,0.0,1.0,  1.0,1.0,1.0] ); //2B
  }
}