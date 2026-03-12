import * as THREE from 'three';

export function createPyramidGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([
    //top
    1,  1, -1,
   -1,  1, -1,
    1,  1,  1,
   -1,  1,  1,
    //front
    1,  1,  1,
   -1,  1,  1,
    0, -1,  0,
    //left
   -1,  1,  1,
   -1,  1, -1,
    0, -1,  0,
    //back
   -1,  1, -1,
    1,  1, -1,
    0, -1,  0,
    //right
    1,  1, -1,
    1,  1,  1,
    0, -1,  0,
  ]);

  const normals = new Float32Array([
    // top normals
    0,  1,  0,
    0,  1,  0,
    0,  1,  0,
    0,  1,  0,
    // front normals
    0,  -1 / Math.sqrt(5),  2 / Math.sqrt(5),
    0,  -1 / Math.sqrt(5),  2 / Math.sqrt(5),
    0,  -1 / Math.sqrt(5),  2 / Math.sqrt(5),
    // left normals
    -2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0,
    -2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0,
    -2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0,
    // back normals
    0,  -1 / Math.sqrt(5),  -2 / Math.sqrt(5),
    0,  -1 / Math.sqrt(5),  -2 / Math.sqrt(5),
    0,  -1 / Math.sqrt(5),  -2 / Math.sqrt(5),
    // right normals
    2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0,
    2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0,
    2 / Math.sqrt(5),  -1 / Math.sqrt(5), 0,
  ]);

  const uvs = new Float32Array([
    0, 0,  1, 0,  0, 1,  1, 1,  // top
    0, 1,  1, 1,  0.5, 0,  //front-left-back-right
    0, 1,  1, 1,  0.5, 0, 
    0, 1,  1, 1,  0.5, 0,
    0, 1,  1, 1,  0.5, 0,
  ]);
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute( normals, 3 ));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  geometry.setIndex( [
    0, 1, 2, 2, 1, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11, 12,
    13, 14, 15,
  ]);

  return geometry;
} //END 

export function createPyramidTexture(path, colorTint) {
  const texture = new THREE.TextureLoader().load(path);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshPhongMaterial({ map: texture, color: colorTint,  side: THREE.DoubleSide });
  material.shininess = 0;
  return material;
}