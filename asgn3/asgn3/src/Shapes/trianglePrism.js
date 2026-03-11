class Prism {
  constructor() {
    this.type = 'triPrism';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();

    this.textureNum = -1;
    this.texWeight = 0;
    this.vertexUVcoord = new Float32Array([
      0.0,0.0,1.0,  0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,  0.0,1.0,1.0,  0.0,1.0,   //front
      0.0,0.0,0.0,  1.0,0.0,  1.0,0.0,0.0,  0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,   //back
      0.0,0.0,0.0,  0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,  1.0,0.0,1.0,  1.0,1.0,   //bottom. far half
      0.0,0.0,0.0,  0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,  1.0,0.0,1.0,  1.0,1.0,   //bottom. close half
      0.0,0.0,0.0,  0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,   //left. Top half
      0.0,0.0,0.0,  0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,   //left. bottom half
      1.0,0.0,0.0,  1.0,0.0,  0.0,1.0,0.0,  1.0,1.0,  0.0,1.0,1.0,  0.0,1.0,   //right. Top half
      1.0,0.0,0.0,  1.0,0.0,  1.0,0.0,1.0,  0.0,0.0,  0.0,1.0,1.0,  0.0,1.0    //right. bottom half
    ])
  }

  renderSlow() {
    //var xy = this.position;
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform1f(u_texColorWeight, this.texWeight);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);

    // 1. front of prism
    drawTriangle3DUV( [
        0.0,0.0,0.0,  0.0,1.0,
        1.0,0.0,0.0,  0.0,1.0,
        0.0,1.0,0.0,  1.0,1.0
    ], 3 );
    //drawTriangle3D( [0.0,0.0,0.0,  1.0,0.0,0.0,  0.0,1.0,0.0] );

    gl.uniform4f(u_FragColor, rgba[0]*0.875, rgba[1]*0.875, rgba[2]*0.875, rgba[3]);
    // 2. back of prism
    drawTriangle3DUV( [
      0.0,0.0,1.0,  0.0,0.0,
      1.0,0.0,1.0,  0.0,0.0,
      0.0,1.0,1.0,  1.0,0.0
    ], 3 );
    //drawTriangle3D( [0.0,0.0,1.0,  1.0,0.0,1.0,  0.0,1.0,1.0] ); //2A

    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);
    // left face of prism
    drawTriangle3D( [0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0], 3 ); //2A
    drawTriangle3D( [0.0,0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,1.0], 3 ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.625, rgba[1]*0.625, rgba[2]*0.625, rgba[3]);
    // 4. right face of cube
    drawTriangle3DUV( [
      1.0,0.0,0.0,  0.0,1.0,
      0.0,1.0,0.0,  1.0,1.0,
      0.0,1.0,1.0,  1.0,0.0
    ], 3 );
    drawTriangle3DUV( [
      1.0,0.0,0.0,  0.0,1.0,
      1.0,0.0,1.0,  0.0,0.0,
      0.0,1.0,1.0,  1.0,0.0
    ], 3 );
    //drawTriangle3D( [1.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0] ); //2A. top diagonal
    //drawTriangle3D( [1.0,0.0,0.0,  1.0,0.0,1.0,  0.0,1.0,1.0] ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    // 4. bottom of cube
    drawTriangle3D( [0.0,0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,1.0], 3 ); //2A
    drawTriangle3D( [0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0], 3 ); //2B

    //gl.uniform4f(u_FragColor, rgba[0]*0.375, rgba[1]*0.375, rgba[2]*0.375, rgba[3]);
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
}