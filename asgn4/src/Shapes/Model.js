//import { Matrix4 } from "../lib/cuon-matrix";

// prettier-ignore
//export default class Model {
class Model {
    constructor(gl, filePath) {
        this.filePath = filePath;
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.isFullyLoaded = false;
        this.textureNum = -1;
        this.texWeight = 0;

        this.getFileContent().then(() => {
            this.vertexBuffer = gl.createBuffer();
            this.uvBuffer = gl.createBuffer();
            this.normalBuffer = gl.createBuffer();

            if (!this.vertexBuffer || !this.uvBuffer || !this.normalBuffer ) {
                console.log("failed to create buffers for", this.filePath);
            }
        });
    }

    async parseModel(fileContent) {
        const lines = fileContent.split("\n");
        const allVertices = [];
        const allUVs = []
        const allNormals = [];

        const unpackedVerts = [];
        const unpackedUVs = [];
        const unpackedNormals = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tokens = line.split(" ");
            if (tokens[0] == 'v') {
                allVertices.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            }
            else if (tokens[0] === "vt") {
                allUVs.push(parseFloat(tokens[1]), parseFloat(tokens[2]));
            }
            else if (tokens[0] == 'vn') {
                allNormals.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            }
            else if (tokens[0] === "f") {
                const faceVerts = tokens.slice(1); // e.g. ["129/1/129","259/2/259","769/3/769","576/4/576"]
              
                // triangulate: (0, i, i+1)
                for (let i = 1; i + 1 < faceVerts.length; i++) {
                  for (const vstr of [faceVerts[0], faceVerts[i], faceVerts[i + 1]]) {
                    const parts = vstr.split("/"); // v/vt/vn OR v//vn OR v/vt OR v
              
                    const vIndex  = parseInt(parts[0], 10) - 1;
                    const vtIndex = parts[1] ? parseInt(parts[1], 10) - 1 : -1;
                    const vnIndex = parts[2] ? parseInt(parts[2], 10) - 1 : -1;
              
                    // positions
                    unpackedVerts.push(
                      allVertices[vIndex * 3 + 0],
                      allVertices[vIndex * 3 + 1],
                      allVertices[vIndex * 3 + 2]
                    );
              
                    // normals (if present)
                    if (vnIndex >= 0) {
                      unpackedNormals.push(
                        allNormals[vnIndex * 3 + 0],
                        allNormals[vnIndex * 3 + 1],
                        allNormals[vnIndex * 3 + 2]
                      );
                    } else {
                      // fallback normal if your file ever omits them
                      unpackedNormals.push(0, 0, 1);
                    }
              
                    // UVs (optional but recommended if your shader uses a_UV)
                    if (vtIndex >= 0) {
                      unpackedUVs.push(
                        allUVs[vtIndex * 2 + 0],
                        allUVs[vtIndex * 2 + 1]
                      );
                    } else {
                      unpackedUVs.push(0, 0);
                    }
                  }
                }
              }     
            /*
            else if (tokens[0] == 'f') {
                for (const face of [tokens[1], tokens[2], tokens[3]]) {
                    const indices = face.split("//");
                    const vertexIndex = (parseInt(indices[0]) - 1) * 3;
                    const normalIndex = (parseInt(indices[1]) - 1) * 3;

                    unpackedVerts.push(
                        allVertices[vertexIndex],
                        allVertices[vertexIndex + 1],
                        allVertices[vertexIndex + 2]
                    )

                    unpackedNormals.push(
                        allNormals[normalIndex],
                        allNormals[normalIndex + 1],
                        allNormals[normalIndex + 2]
                    )
                }
            }*/
        }

        this.modelData = {
            vertices: new Float32Array(unpackedVerts),
            uvs: new Float32Array(unpackedUVs),
            normals: new Float32Array(unpackedNormals)
        }

        this.isFullyLoaded = true;

        //console.log(allVertices);
        //console.log(allNormals);
    }

    render(gl) {
        // if the .obj file hasn't been fully parsed yet, skip rendering this frame
        if (!this.isFullyLoaded) return;
      
        // vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.modelData.vertices, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.modelData.uvs, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);
      
        // normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.modelData.normals, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);
      
        // set uniforms
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniform4fv(u_FragColor, this.color);

        let normalMatrix = new Matrix4().setInverseOf(this.matrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      
        gl.drawArrays(gl.TRIANGLES, 0, this.modelData.vertices.length / 3);
      }

    async getFileContent() {
        try {
            const response = await fetch(this.filePath);
            if (!response.ok) throw new Error(`Could not load file "${this.filePath}". Are you sure the file name/path are correct?`);

            const fileContent = await response.text();
            this.parseModel(fileContent);
        } catch (e) {
            throw new Error(`Something went wrong when loading ${this.filePath}. Error: ${e}`);
        }
    }
}
