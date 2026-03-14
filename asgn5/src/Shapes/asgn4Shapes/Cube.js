class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

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

    this.vrtxUVNrmlcoord = new Float32Array([
      0.0,0.0,1.0,  0.0,0.0,  0.0,0.0,1.0,
      0.0,1.0,1.0,  0.0,1.0,  0.0,0.0,1.0,
      1.0,1.0,1.0,  1.0,1.0,  0.0,0.0,1.0,   //front. Top half
      0.0,0.0,1.0,  0.0,0.0,  0.0,0.0,1.0,
      1.0,0.0,1.0,  1.0,0.0,  0.0,0.0,1.0,
      1.0,1.0,1.0,  1.0,1.0,  0.0,0.0,1.0, //front. bottom half

      0.0,0.0,0.0,  1.0,0.0,  0.0,0.0,-1.0,
      0.0,1.0,0.0,  1.0,1.0,  0.0,0.0,-1.0,
      1.0,1.0,0.0,  0.0,1.0,  0.0,0.0,-1.0, //back. Top half
      0.0,0.0,0.0,  1.0,0.0,  0.0,0.0,-1.0,
      1.0,0.0,0.0,  0.0,0.0,  0.0,0.0,-1.0,
      1.0,1.0,0.0,  0.0,1.0,  0.0,0.0,-1.0, //back. bottom half

      0.0,1.0,0.0,  0.0,1.0,  0.0,1.0,0.0,
      1.0,1.0,0.0,  1.0,1.0,  0.0,1.0,0.0,
      1.0,1.0,1.0,  1.0,0.0,  0.0,1.0,0.0, //top. far half
      0.0,1.0,0.0,  0.0,1.0,  0.0,1.0,0.0,
      0.0,1.0,1.0,  0.0,0.0,  0.0,1.0,0.0,
      1.0,1.0,1.0,  1.0,0.0,  0.0,1.0,0.0, //top. close half

      0.0,0.0,0.0,  0.0,0.0,  0.0,-1.0,0.0,
      1.0,0.0,0.0,  1.0,0.0,  0.0,-1.0,0.0,
      1.0,0.0,1.0,  1.0,1.0,  0.0,-1.0,0.0, //bottom. far half
      0.0,0.0,0.0,  0.0,0.0,  0.0,-1.0,0.0,
      0.0,0.0,1.0,  0.0,1.0,  0.0,-1.0,0.0,
      1.0,0.0,1.0,  1.0,1.0,  0.0,-1.0,0.0, //bottom. close half

      0.0,0.0,0.0,  0.0,0.0,  -1.0,0.0,0.0, 
      0.0,1.0,0.0,  0.0,1.0,  -1.0,0.0,0.0, 
      0.0,1.0,1.0,  1.0,1.0,  -1.0,0.0,0.0,  //left. Top half
      0.0,0.0,0.0,  0.0,0.0,  -1.0,0.0,0.0, 
      0.0,0.0,1.0,  1.0,0.0,  -1.0,0.0,0.0, 
      0.0,1.0,1.0,  1.0,1.0,  -1.0,0.0,0.0,  //left. bottom half

      1.0,0.0,0.0,  1.0,0.0,  1.0,0.0,0.0,
      1.0,1.0,0.0,  1.0,1.0,  1.0,0.0,0.0,
      1.0,1.0,1.0,  0.0,1.0,  1.0,0.0,0.0, //right. Top half
      1.0,0.0,0.0,  1.0,0.0,  1.0,0.0,0.0,
      1.0,0.0,1.0,  0.0,0.0,  1.0,0.0,0.0,
      1.0,1.0,1.0,  0.0,1.0,  1.0,0.0,0.0 //right. bottom half
    ])
  }

  render() {
    var rgba = this.color;
    
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform1f(u_texColorWeight, this.texWeight);

    // Pass the normal matrix to u_NormalMatrix uniform
    gl.uniformMatrix4fv(u_NormalMatrix,false,this.normalMatrix.elements);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);

    //console.log(this.vertexUVcoord.length / 5);

    //drawTriangle3DUV( this.vertexUVcoord, this.vertexUVcoord.length / 5 );
    drawTriangle3DUVNrml( this.vrtxUVNrmlcoord, this.vrtxUVNrmlcoord.length / 8 );
  }

} //end Cube class