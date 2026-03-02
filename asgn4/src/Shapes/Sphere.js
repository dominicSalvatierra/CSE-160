//import {SPHERE_POSITIONS} from "./sphereVertices.js";

class Sphere {
    constructor() {
      this.type = 'sphere';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
  
      this.textureNum = -1;
      this.texWeight = 0;
  
      this.vrtxUVNrmlcoord = SPHERE_POSITIONS;
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

    renderSlow() {
        var rgba = this.color;
          
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
        gl.uniform1i(u_whichTexture, this.textureNum);
      
        gl.uniform1f(u_texColorWeight, this.texWeight);
      
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix,false,this.matrix.elements); 
        
        var d = Math.PI / 25;
        var dd = Math.PI / 25;
    
        for (var t = 0; t < Math.PI; t += d) {
          for (var r = 0; r < (2 * Math.PI); r += d) {
    
            var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
            var p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
            var p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
            var p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];
    
            var uv1 = [t / Math.PI, r / (2 * Math.PI)];
            var uv2 = [(t + dd) / Math.PI, r / (2 * Math.PI)];
            var uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
            var uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];

            /*
            p1 = [math.sin(t) * math.cos(r), math.sin(t) * math.sin(r), math.cos(t)];
            p2 = [math.sin(t + dd) * math.cos(r), math.sin(t + dd) * math.sin(r), math.cos(t + dd)];
            p3 = [math.sin(t) * math.cos(r + dd), math.sin(t) * math.sin(r + dd), math.cos(t)];
            p4 = [math.sin(t + dd) * math.cos(r + dd), math.sin(t + dd) * math.sin(r + dd), math.cos(t + dd)];
    
            uv1 = [t / math.pi, r / (2 * math.pi)];
            uv2 = [(t + dd) / math.pi, r / (2 * math.pi)];
            uv3 = [t / math.pi, (r + dd) / (2 * math.pi)];
            uv4 = [(t + dd) / math.pi, (r + dd) / (2 * math.pi)];
            */
    
            var v = [];
            var uv = []; 
    
            // First triangle
            v = v.concat(p1); uv = uv.concat(uv1);
            v = v.concat(p2); uv = uv.concat(uv2);
            v = v.concat(p4); uv = uv.concat(uv4);
    
            gl.uniform4f(u_FragColor, 1, 1, 1, 1);
            drawSingleTriangle3DUVNormal(v, uv, v);
    
            // Second triangle
            v = [];
            uv = [];
    
            v = v.concat(p1); uv = uv.concat(uv1);
            v = v.concat(p4); uv = uv.concat(uv4);
            v = v.concat(p3); uv = uv.concat(uv3);
    
            gl.uniform4f(u_FragColor, 1, 0, 0, 1);
            drawSingleTriangle3DUVNormal(v, uv, v);
          }
        }
      }
  
  } //end Cube class