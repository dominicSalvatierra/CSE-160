class Prism {
  constructor() {
    this.type = 'triPrism';
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
  }

  render() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;
    //var segments = this.segments;
    
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements);
    // Pass the size of a triangle to u_Size variable
    //gl.uniform1f(u_Size, size);
    // Draw
    //gl.drawArrays(gl.POINTS, 0, 1);
    /*
    var d = this.size/200.0; // delta

    let angleStep = 360 / this.segments;
    for(var angle = 0; angle < 360; angle += angleStep){
    let centerPt = [xy[0], xy[1]];
    let angle1 = angle;
    let angle2 = angle + angleStep;
    let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d];
    let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d];
    let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
    let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]]; */
    //drawTriangle( [xy[0], xy[1],  pt1[0], pt1[1],  pt2[0], pt2[1]] ); 

    // 1. front of prism
    drawTriangle3D( [0.0,0.0,0.0,  1.0,0.0,0.0,  0.0,1.0,0.0] );

    gl.uniform4f(u_FragColor, rgba[0]*0.875, rgba[1]*0.875, rgba[2]*0.875, rgba[3]);
    // 2. back of prism
    drawTriangle3D( [0.0,0.0,1.0,  1.0,0.0,1.0,  0.0,1.0,1.0] ); //2A

    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);
    // left face of prism
    drawTriangle3D( [0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0] ); //2A
    drawTriangle3D( [0.0,0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,1.0] ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.625, rgba[1]*0.625, rgba[2]*0.625, rgba[3]);
    // 4. right face of cube
    drawTriangle3D( [1.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0] ); //2A
    drawTriangle3D( [1.0,0.0,0.0,  1.0,0.0,1.0,  0.0,1.0,1.0] ); //2B

    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    // 4. bottom of cube
    drawTriangle3D( [0.0,0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,1.0] ); //2A
    drawTriangle3D( [0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0] ); //2B

    //gl.uniform4f(u_FragColor, rgba[0]*0.375, rgba[1]*0.375, rgba[2]*0.375, rgba[3]);
  

  }
}