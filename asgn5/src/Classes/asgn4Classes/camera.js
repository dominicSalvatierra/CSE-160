class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([0,0,0]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
        this.d = new Vector3(this.at.elements - this.eye.elements);
        this.move = 1;

        this.tiltAngle = 0;

        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(30, canvas.width/canvas.height, 0.1, 1000);
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2],
        );

        this.map = [];
        for (let i = 0; i < 32; i++ ) {
          let row = [];
          for (let j = 0; j < 32; j++) {
            row.push(0);
          }
          this.map.push(row);
        }
    } 

    setLook() {
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2],
      );
    }


    


    moveForward() {
      let next = new Vector3(this.eye.elements);
      this.d.set(this.at).sub(this.eye).normalize().mul(0.2);
      let dx = this.d.elements[0];
      let dz = this.d.elements[2];
      let z, x;
      //console.log("dx, dz: " + dx + ", " + dz);

      let new_eyeZ = this.eye.elements[2] + dz;
      if (-16 < new_eyeZ && new_eyeZ < 16) { 
        z = Math.floor(new_eyeZ);//let z = Math.floor(this.eye.elements[2] + dz);
        x = Math.floor(this.eye.elements[0]);
        //console.log("moveForward() z + dz: dx, dz: " + dx + ", " + dz);
        //console.log("z, x: " + z + ", " + x);
        //console.log("this.eye.elements[2], this.eye.elements[0]: " + this.eye.elements[2] + ", " + this.eye.elements[0]);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[2] += dz;
          this.at.elements[2] += dz;
        }
      }
      
      let new_eyeX = this.eye.elements[0] + dx;
      if (-16 < new_eyeX && new_eyeX < 16) { 
        z = Math.floor(this.eye.elements[2]);
        x = Math.floor(new_eyeX);
        //console.log("moveForward() x + dx: dx, dz: " + dx + ", " + dz);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[0] += dx;
          this.at.elements[0] += dx;
        }
      }

      /*
      next.elements[0] += dx;
      if (!this.forwardBlocked(next)) {
        this.eye.elements[0] += dx;
        this.at.elements[0] += dx;
      }

      next.set(this.eye);
      next.elements[2] += dz;
      if (!this.forwardBlocked(next)) {
        this.eye.elements[2] += dz;
        this.at.elements[2] += dz;
      }*/

      //this.tryMove(d.elements[0], d.elements[1], d.elements[2], 0);
      //this.eye.add(d);
      //this.at.add(d);
      this.setLook();
    }

    moveBackwards() {
      this.d.set(this.at).sub(this.eye).normalize().mul(0.2);
      //this.d.normalize().mul(0.2);
      let dx = this.d.elements[0];
      let dz = this.d.elements[2];
      let z, x;
      //console.log("moveBackwards(): dx, dz: " + dx + ", " + dz);

      let new_eyeZ = this.eye.elements[2] - dz;
      if (-16 < new_eyeZ && new_eyeZ < 16) { 
        z = Math.floor(new_eyeZ);
        x = Math.floor(this.eye.elements[0]);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[2] -= dz;
          this.at.elements[2] -= dz;
        }
      }  

      let new_eyeX = this.eye.elements[0] - dx;
      if (-16 < new_eyeX && new_eyeX < 16) { 
        z = Math.floor(this.eye.elements[2]);
        x = Math.floor(new_eyeX);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[0] -= dx;
          this.at.elements[0] -= dx;
        }
      }
      //this.tryMove(d.elements[0], d.elements[1], d.elements[2], 1);
      //this.eye.sub(d);
      //this.at.sub(d);
  
      this.setLook();
    }

    moveLeft() {
      this.d.set(this.at).sub(this.eye);
      let left = new Vector3();
      left = Vector3.cross(this.up, this.d);
      left.normalize().mul(0.1);
      let dx = left.elements[0];
      let dz = left.elements[2];
      let z, x;
      //console.log("dx, dz: " + dx + ", " + dz);


      let new_eyeZ = this.eye.elements[2] + dz;
      if (-16 < new_eyeZ && new_eyeZ < 16) { 
        z = Math.floor(new_eyeZ);//let z = Math.floor(this.eye.elements[2] + dz);
        x = Math.floor(this.eye.elements[0]);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[2] += dz;
          this.at.elements[2] += dz;
        }
      }
      
      let new_eyeX = this.eye.elements[0] + dx;
      if (-16 < new_eyeX && new_eyeX < 16) { 
        z = Math.floor(this.eye.elements[2]);
        x = Math.floor(new_eyeX);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[0] += dx;
          this.at.elements[0] += dx;
        }
      }
/*
      z = Math.floor(this.eye.elements[2] + dz);
      x = Math.floor(this.eye.elements[0]);
      if (this.map[z + 16][x + 16] == 0) {
        this.eye.elements[2] += dz;
        this.at.elements[2] += dz;
      }

      z = Math.floor(this.eye.elements[2]);
      x = Math.floor(this.eye.elements[0] + dx);
      if (this.map[z + 16][x + 16] == 0) {
        this.eye.elements[0] += dx;
        this.at.elements[0] += dx;
      }
      //this.tryMove(left.elements[0], left.elements[1], left.elements[2], 0);
      //this.eye.add(left);
      //this.at.add(left);
*/
      this.setLook();
    }

    moveRight() {
      this.d.set(this.at).sub(this.eye);
      let right = new Vector3();
      right = Vector3.cross(this.d, this.up);
      right.normalize().mul(0.1);
      let dx = right.elements[0];
      let dz = right.elements[2];
      let z, x;
      //console.log("dx, dz: " + dx + ", " + dz);

      let new_eyeZ = this.eye.elements[2] + dz;
      if (-16 < new_eyeZ && new_eyeZ < 16) { 
        z = Math.floor(new_eyeZ);//let z = Math.floor(this.eye.elements[2] + dz);
        x = Math.floor(this.eye.elements[0]);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[2] += dz;
          this.at.elements[2] += dz;
        }
      }
      
      let new_eyeX = this.eye.elements[0] + dx;
      if (-16 < new_eyeX && new_eyeX < 16) { 
        z = Math.floor(this.eye.elements[2]);
        x = Math.floor(new_eyeX);
        if (this.map[z + 16][x + 16] == 0) {
          this.eye.elements[0] += dx;
          this.at.elements[0] += dx;
        }
      }
      //this.tryMove(right.elements[0], right.elements[1], right.elements[2], 0);
      //this.eye.add(right);
      //this.at.add(right);
  
      this.setLook();
    }

    panLeft(sensitivity) {
      this.d.set(this.at).sub(this.eye);
      let rotMat = new Matrix4().setRotate(5 * sensitivity, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let dNew = rotMat.multiplyVector3(this.d);
      this.at.set(dNew.add(this.eye));

      this.setLook();
    }

    panRight(sensitivity) {
      this.d.set(this.at).sub(this.eye);
      let rotMat = new Matrix4().setRotate(-5 * sensitivity, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      this.at.set(rotMat.multiplyVector3(this.d).add(this.eye));

      this.setLook();
    }

    panUp(sensitivity) {
      this.d.set(this.at).sub(this.eye);
      let axis = new Vector3();
      axis = Vector3.cross(this.up, this.d);

      let delta = 5 * sensitivity;
      //console.log("tiltAngle + delta " + (this.tiltAngle + delta));
      if (-30 < (this.tiltAngle + delta)) {
        let rotMat = new Matrix4().setRotate(5 * sensitivity, axis.elements[0], axis.elements[1], axis.elements[2]);
        let dNew = rotMat.multiplyVector3(this.d);
        this.at.set(dNew.add(this.eye));
        this.tiltAngle += delta;
      }

      this.setLook();
    }

    panDown(sensitivity) {
      this.d.set(this.at).sub(this.eye);
      let axis = new Vector3();
      axis = Vector3.cross(this.d, this.up);

      let delta = 5 * sensitivity;
      //console.log("tiltAngle + delta " + (this.tiltAngle + delta));
      if ((this.tiltAngle + delta) < 15) {
        let rotMat = new Matrix4().setRotate(5 * sensitivity, axis.elements[0], axis.elements[1], axis.elements[2]);
        let dNew = rotMat.multiplyVector3(this.d);
        this.at.set(dNew.add(this.eye));
        this.tiltAngle -= delta;
      }

      this.setLook();
    }
}