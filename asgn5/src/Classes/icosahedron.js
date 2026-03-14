import * as THREE from 'three';
import {icosaUVs} from './icosaUVs.js';
import {Vector3, Vector4, Matrix4} from '../../lib/cuon-matrix-cse160.js';

export class Icosahedron {
    constructor() {
      this.positionsX = 0;
      this.positionsY = 0;
      this.positionsZ = 0;
      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;

      this.cameraVectorXZ = new Vector3([0,0,0]);
      this.lastCamVectorXZ = new Vector3([0,0,0]);

      this.mesh = null;
    } 

    createMesh( r, det, texturePath ) {
      const loader = new THREE.TextureLoader();

      const geometry = new THREE.IcosahedronGeometry( r, det );
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(icosaUVs, 2));

      const texture = loader.load(texturePath);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material =  new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide});
      const mesh = new THREE.Mesh( geometry, material);

      this.mesh = mesh;
    }

    setPosition(x,y,z) {
      this.positionX = x;
      this.positionY = y;
      this.positionZ = z;
      this.mesh.position.set(x, y, z);
    }

    setRotation(xRot, yRot, zRot) {
      this.rotationX = xRot;
      this.rotationY = yRot;
      this.rotationZ = zRot;
      this.mesh.rotation.set(xRot, yRot, zRot);
      //console.log("x,y,z rotations: " + xRot + "," + yRot + "," + zRot);
    }

    setLastCamVectorXZ(lastX, lastZ) {
      //this.lastCamVectorXZ.setElements([this.cameraVectorXZ.elements]);
      console.log(this.cameraVectorXZ.getElements());
      this.lastCamVectorXZ.setElements(this.cameraVectorXZ.getElements()); // argument returns array
      this.lastCamVectorXZ.normalize();
      //console.log("in setLastCamVectorXZ")
      console.log(this.lastCamVectorXZ);
      console.log("exiting setLastCamVectorXZ");
    }

    findCameraVectorXZ(camX, camZ) {
      this.cameraVectorXZ.setElements([camX - this.positionX, 0, camZ - this.positionZ]);
      //console.log(this.cameraVectorXZ);
      this.cameraVectorXZ.normalize();
    }
}