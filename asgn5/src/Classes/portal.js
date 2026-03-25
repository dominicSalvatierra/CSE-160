import * as THREE from 'three';
import {Vector3, Vector4, Matrix4} from '../../lib/cuon-matrix-cse160.js';

export class Portal {
    constructor() {
      this.cube0 = null;
      this.cube1 = null;
      this.cube02 = null;
      this.cube12 = null;

      this.positionsX = 0;
      this.positionsY = 0;
      this.positionsZ = 0;
      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;

      this.cameraVectorXZ = new Vector3([0,0,0]);
      this.cameraVectorXYZ = new Vector3([0,0,0]);
      this.originVectorXZ = new Vector3([0,0,0]);
      this.camOrthoVector = new Vector3([0,0,0]);
      this.pitchAxisVector = new THREE.Vector3(0,0,0);
      this.myRotMtrx = new Matrix4();
      this.threeRotMtrx = new THREE.Matrix4();

      this.initialRotationY = 0;

      this.hide = false;
      this.hold = false;
      this.retreat = false;
      this.release = false;

      this.shaken = false;
      this.initialTime = 0;
      this.endTime = 0;
      this.initialPosition = [];
      this.pacer = false;

      this.retreatAngle = 0;

      this.mesh = null;
    } 

    //createMesh( scale, rotY ) {
    createMesh( r, det, texturePath ) {
      const loader = new THREE.TextureLoader();

      const geometry = new THREE.IcosahedronGeometry( r, det );
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(icosaUVs, 2));

      const texture = loader.load(texturePath);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material =  new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide});
      const mesh = new THREE.Mesh( geometry, material);

      this.mesh = mesh;

      /*
      const loader = new THREE.TextureLoader();

      const rightTex = loader.load('../resources/side0.jpg');
      rightTex.colorSpace = THREE.SRGBColorSpace;
      const backTex  = loader.load('../resources/side1.jpg');
      backTex.colorSpace = THREE.SRGBColorSpace;
      const leftTex  = loader.load('../resources/side2.jpg');
      leftTex.colorSpace = THREE.SRGBColorSpace;
      const frontTex = loader.load('../resources/side3.jpg');
      frontTex.colorSpace = THREE.SRGBColorSpace;

      const materials = [
        new THREE.MeshBasicMaterial({ map: rightTex, side: THREE.DoubleSide}), // +x
        new THREE.MeshBasicMaterial({ map: leftTex,  side: THREE.DoubleSide }), // -x
        new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.0, side: THREE.BackSide }), // top
        new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.0, side: THREE.BackSide }), // bottom
        new THREE.MeshBasicMaterial({ map: frontTex, side: THREE.DoubleSide }), // +z
        new THREE.MeshBasicMaterial({ map: backTex,  side: THREE.DoubleSide }), // -z
      ];    
  
      const geometry = new THREE.BoxGeometry();
      this.cube0 = new THREE.Mesh( geometry, materials );
      this.cube0.scale.set(scale,scale,scale);
      this.cube0.rotation.y = rotY; 
    //cube0.position.set(0,6,0);


    //const cube1 = new THREE.Mesh( geometry, materials );
    //cube1.scale.set(10,10,10)
      this.cube1 = this.cube0.clone()
      this.cube1.rotation.y =  - rotY;
    //this.cube2.position.set(0,-6,0);
      this.cube02 = this.cube0.clone();
      this.cube12 = this.cube1.clone();

      //objects.push(cube0);
      //objects.push(cube1);
      //scene0.add( cube0 );  
      //scene0.add( cube1 ); 
    
      //objects.push(cube02);
      //objects.push(cube12);
      //scene2.add( cube02 );  
      //scene2.add( cube12 ); 
      */
    }

    setPosition(x,y,z) {
      this.positionX = x;
      this.positionY = y;
      this.positionZ = z;
      this.mesh.position.set(x, y, z);
    }

    setRotationY(yRot) { 
      //this.initialRotationY = yRot;
      this.mesh.rotation.set(0, this.rotationY + yRot, 0);
      //console.log("x,y,z rotations: " + xRot + "," + yRot + "," + zRot);
    }

    setRotationPitch(pitchAngle) {
      //console.log("in setRotationPitch()");
      //console.log(this.pitchAxisVector);
      //console.log("angle in setRotationPitch(): " + pitchRot * 180 / Math.PI);

      /*
      this.myRotMtrx.setRotate(pitchAngle * 180 / Math.PI, this.pitchAxisVector.x, this.pitchAxisVector.y, this.pitchAxisVector.z);
      //console.log(this.myRotMtrx.elements)
      this.threeRotMtrx.fromArray(this.myRotMtrx.elements);
      this.mesh.position.set(0,0,0);
      this.mesh.applyMatrix4(this.threeRotMtrx);
      this.setPosition(this.positionX, this.positionY, this.positionZ);
      //this.mesh.setRotationFromMatrix(this.threeRotMtrx);
      */

      //this.mesh.quaternion.setFromAxisAngle(this.pitchAxisVector, pitchAngle);
      this.mesh.rotateOnWorldAxis(this.pitchAxisVector, pitchAngle);
      //this.mesh.rotateOnAxis(this.pitchAxisVector, pitchAngle);
      //this.mesh.setRotationFromAxisAngle(this.pitchAxisVector, pitchAngle);
      //console.log("x,y,z rotations: " + xRot + "," + yRot + "," + zRot);
    }


    setOriginVectorXZ() {
      this.originVectorXZ.setElements([0 - this.positionX, 0, 0 - this.positionZ]);
      //console.log(this.cameraVectorXZ);
      this.originVectorXZ.normalize();
    }

    findCameraVectorXZ(camX, camZ) {
      this.cameraVectorXZ.setElements([camX - this.positionX, 0, camZ - this.positionZ]);
      //console.log(this.cameraVectorXZ);
      this.cameraVectorXZ.normalize();
    }

    findCameraVectorXYZ(camX, camY, camZ) {
      this.cameraVectorXYZ.setElements([camX - this.positionX, camY - this.positionY, camZ - this.positionZ]);
      this.cameraVectorXYZ.normalize();
    }

    findCamOrthoVector() {
      this.camOrthoVector.setElements([0, 0 - this.positionY, 0]);
      this.camOrthoVector.normalize();
      //console.log(this.camOrthoVector);
    }

    findPitchAxisVector() {
      //console.log("enter");
      //console.log(this.cameraVectorXZ);
      //console.log(this.camOrthoVector);
      Vector3.cross(this.pitchAxisVector, this.cameraVectorXZ, this.camOrthoVector);
      this.pitchAxisVector.normalize();
      //console.log(this.pitchAxisVector);
    }

    shake(currentTime, num) { 
      if (this.initialTime === 0) {
        this.initialTime = currentTime;
        //console.log(this.initialTime);
        this.endTime = this.initialTime + 1.0;
        //console.log(this.endTime);
        this.initialTime += 0.2;
        //this.initialPosition.push(this.positionX);
        //this.initialPosition.push(this.positionY);
        //this.initialPosition.push(this.positionZ);
      }
      if (currentTime < this.endTime) {
        //console.log(currentTime);
        if (currentTime < this.initialTime) { // this.initialTime += 0.2;
          //console.log("shake");
          if (!this.pacer) {
            if (num === 0 ) {
              this.mesh.position.x = this.positionX - (Math.random() * 200);
              this.mesh.position.z = this.positionZ + (Math.random() * 250 - 125);
            }
            else if (num === 1) {
              this.mesh.position.x = this.positionX + (Math.random() * 250 - 125);
              this.mesh.position.z = this.positionZ + (Math.random() * 200);
            }
            else if (num === 2) {
              this.mesh.position.x = this.positionX + (Math.random() * 200);
              this.mesh.position.z = this.positionZ + (Math.random() * 250 - 125);
            }
            else {
              this.mesh.position.x = this.positionX + (Math.random() * 250 - 125);
              this.mesh.position.z = this.positionZ - (Math.random() * 200);
            }
            //this.mesh.position.x = this.positionX + (Math.random() * 200 - 100);
            this.mesh.position.y = this.positionY + (Math.random() * 200);
            //this.mesh.position.z = this.positionZ + (Math.random() * 200 - 100);
            this.pacer = true;
          }
        }
        else {
          this.initialTime += 0.2;
          this.pacer = false;
        }
      }
      else {
        //this.setPosition( this.initialPosition[0], this.initialPosition[1], this.initialPosition[2]);
        this.setPosition( this.positionX, this.positionY, this.positionZ);
        this.initialTime = 0;
        this.shaken = true;
        //console.log(this.shaken);
        //console.log(this.positionX, this.positionY, this.positionZ);
        //console.log("end Shake");
      }
      //console.log(this.initialTime + ", " + this.endTime);
      //console.log(this.initialPosition);
    }
}