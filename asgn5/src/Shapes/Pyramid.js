import * as THREE from 'three';

export default class Pyramid {

  constructor() { 
    this.mesh = null;
    //switchToFPS();
    this.vertices = [
      // top
      /*
      { pos: [ 1,  1, -1], norm: [ 0,  1,  0], color:[], uv: [0, 0], }, // 16
      { pos: [-1,  1, -1], norm: [ 0,  1,  0], color: , uv: [1, 0], }, // 17
      { pos: [ 1,  1,  1], norm: [ 0,  1,  0], color: ,  uv: [0, 1], }, // 18
      { pos: [-1,  1,  1], norm: [ 0,  1,  0], color: , uv: [1, 1], }, // 19
      */
      { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], }, // 0
      { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], }, // 1
      { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], }, // 2
      { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], }, // 3
    
      { pos: [ 1,  1,  1], norm: [ 0,  -1 / Math.sqrt(5),  2 / Math.sqrt(5)], uv: [0, 1], }, // 4
      { pos: [-1,  1,  1], norm: [ 0,  -1 / Math.sqrt(5),  2 / Math.sqrt(5)], uv: [1, 1], }, // 5
      { pos: [0,  -1,  0], norm: [ 0,  -1 / Math.sqrt(5),  2 / Math.sqrt(5)], uv: [0.5, 0], }, // 6

      { pos: [ -1,  1,  1], norm: [ -2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0], uv: [0, 1], }, // 7
      { pos: [-1,  1,  -1], norm: [ -2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0], uv: [1, 1], }, // 8
      { pos: [0,  -1,  0], norm: [ -2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0], uv: [0.5, 0], }, // 9

      { pos: [ -1,  1,  -1], norm: [ 0,  -1 / Math.sqrt(5),  -2 / Math.sqrt(5)], uv: [0, 1], }, // 10
      { pos: [1,  1,  -1], norm: [ 0,  -1 / Math.sqrt(5),  -2 / Math.sqrt(5)], uv: [1, 1], }, // 11
      { pos: [0,  -1,  0], norm: [ 0,  -1 / Math.sqrt(5),  -2 / Math.sqrt(5)], uv: [0.5, 0], }, // 12

      { pos: [ 1,  1,  -1], norm: [ 2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0 ], uv: [0, 1], }, // 10
      { pos: [1,  1,  1], norm: [ 2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0 ], uv: [1, 1], }, // 11
      { pos: [0,  -1,  0], norm: [ 2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0 ], uv: [0.5, 0], }, // 12
    ];

    this.buildMesh();

  } //END CONSTRUCTOR

  buildMesh() {
    const numVertices = this.vertices.length;
    const positions = new Float32Array(numVertices * 3);
    const normals = new Float32Array(numVertices * 3);
    const uvs = new Float32Array(numVertices * 2);

    let posNdx = 0;
    let nrmNdx = 0;
    let uvNdx = 0;
    for ( const vertex of this.vertices ) {
        //console.log(posNdx);
        positions.set(vertex.pos, posNdx);
        normals.set(vertex.norm, nrmNdx);
        uvs.set(vertex.uv, uvNdx);
        posNdx += 3;
        nrmNdx += 3;
        uvNdx += 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
  
    geometry.setIndex( [
      0, 1, 2, 2, 1, 3,
      4, 5, 6,
      7, 8, 9,
      10, 11, 12,
      13, 14, 15,
    ] );
  
    const loader = new THREE.TextureLoader();
    const texture = loader.load( '../resources/cobblestone.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
      
    this.mesh = new THREE.Mesh(geometry, material);
  }
 
  // ex: pyramid.setPosition(5, 0, 0);
  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  //ex: pyramid.setRotation(0, Math.PI / 4, 0);
  setRotation(x, y, z) {
    this.mesh.rotation.set(x, y, z);
  }

  //ex: pyramid.setScale(2, 2, 2);
  setScale(x, y, z) {
    this.mesh.scale.set(x, y, z);
  }
}