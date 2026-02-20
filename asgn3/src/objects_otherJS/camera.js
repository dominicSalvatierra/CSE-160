class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([0,0,0]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);

        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(30, canvas.width/canvas.height, 0.1, 1000);
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2],
        );

        this.map = [];
    } 

    setLook() {
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2],
      );
    }


    isBlockedSphere(pos) {
      const R = 0.2;
      const px = pos.elements[0], py = pos.elements[1], pz = pos.elements[2];
      console.log("px, pz: " + px + ", " + pz);

     // sample 4 points around the player in XZ plane
      const samples = [
        [px + R, py, pz],
        [px - R, py, pz],
        [px, py, pz + R],
        [px, py, pz - R],
      ];
 
      for (const [sx, sy, sz] of samples) {
        console.log("sx, sz: " + sx + ", " + sz);
        let x = Math.floor(sx);
        let y = Math.floor(sy);
        let z = Math.floor(sz);
        console.log("x, z: " + x + ", " + z);
        if (this.map[z + 16][x + 16] === 1){
          console.log("true: " + this.map[z + 16][x + 16])
          return true;
        } 
      }
      return false;
    }

    tryMove(dx, dy, dz, sub) {
      // X
      if (!sub) {
        let next = new Vector3(this.eye.elements);
        next.elements[0] += dx;
        if (!this.isBlockedSphere(next)) {
          this.eye.elements[0] += dx;
          this.at.elements[0] += dx;
        }

        next = new Vector3(this.eye.elements);
        next.elements[2] += dz;
        if (!this.isBlockedSphere(next)) {
          this.eye.elements[2] += dz;
          this.at.elements[2] += dz;
        }
        console.log(this.eye.elements);
      }

      else {
        let next = new Vector3(this.eye.elements);
        next.elements[0] += dx;
        if (!this.isBlockedSphere(next)) {
          this.eye.elements[0] -= dx;
          this.at.elements[0] -= dx;
        }

        next = new Vector3(this.eye.elements);
        next.elements[2] += dz;
        if (!this.isBlockedSphere(next)) {
          this.eye.elements[2] -= dz;
          this.at.elements[2] -= dz;
        }
        console.log(this.eye.elements);
      }

      //this.eye.elements[1] += dy;
      //this.at.elements[1] += dy;
    
      // Z
      // Y (optional)
    }


    moveForward() {
      let next = new Vector3(this.eye.elements);
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      d.normalize().mul(0.2);
      let dx = d.elements[0];
      let dz = d.elements[2];
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
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      d.normalize().mul(0.2);
      let dx = d.elements[0];
      let dz = d.elements[2];
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
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      let left = new Vector3();
      left = Vector3.cross(this.up, d);
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
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      let right = new Vector3();
      right = Vector3.cross(d, this.up);
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
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      let rotMat = new Matrix4().setRotate(5 * sensitivity, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let dNew = rotMat.multiplyVector3(d);
      this.at.set(dNew.add(this.eye));

      this.setLook();
    }

    panRight(sensitivity) {
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      let rotMat = new Matrix4().setRotate(-5 * sensitivity, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      this.at.set(rotMat.multiplyVector3(d).add(this.eye));

      this.setLook();
    }

    panUp(sensitivity) {
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      let axis = new Vector3();
      axis = Vector3.cross(this.up, d);

      let rotMat = new Matrix4().setRotate(5 * sensitivity, axis.elements[0], axis.elements[1], axis.elements[2]);
      let dNew = rotMat.multiplyVector3(d);
      this.at.set(dNew.add(this.eye));

      this.setLook();
    }

    panDown(sensitivity) {
      let d = new Vector3(this.at.elements);
      d.sub(this.eye);
      let axis = new Vector3();
      axis = Vector3.cross(d, this.up);

      let rotMat = new Matrix4().setRotate(5 * sensitivity, axis.elements[0], axis.elements[1], axis.elements[2]);
      let dNew = rotMat.multiplyVector3(d);
      this.at.set(dNew.add(this.eye));

      this.setLook();
    }
}