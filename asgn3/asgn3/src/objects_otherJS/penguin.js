class Penguin {
    constructor() {
        //this.xBodyMove = 0;
        //this.yBodyMove = 0;
        //this.zBodyMove = 0;

        this.moveWings = 0;
        this.moveLeftLeg = 25;
        this.moveLeftFoot = 10; 
        this.moveLeftToes = 10;
        this.moveRightLeg = 25;
        this.moveRightFoot = 10; 
        this.moveRightToes = 10;

        // --- Poke animation state ---
        this.pokeActive = false;
        this.pokeStart = 0;
        this.pokeWingOffset = 0; // degrees added to g_moveWings
        this.pokeHeadOffset = 0; // degrees yaw for head
        this.pokeDuration = 2; // seconds total
        this.pokeFlaps = 6;      // number of flaps / head sways
        this.pokeWingAmp = 90;   // degrees
        this.pokeHeadAmp = 20;   // degrees

        this.animateWalk = false;
        this.walkSpeed = 0;
        this.speedTimes = 5;

        this.setMtrx = new Matrix4();
    }

    startPoke(seconds) {
        this.pokeActive = true;
        this.pokeStart = seconds;
    }

    // update animation state each frame
    update(seconds) {
        this.walkSpeed = seconds * this.speedTimes;

        if (this.pokeActive) {
            const t = seconds - this.pokeStart;

            if(t >= this.pokeDuration) {
                this.pokeActive = false;
                this.pokeWingOffset = 0;
                this.pokeHeadOffset = 0;
            } else {
                const u = t / this.pokeDuration;
                const phase = 2 * Math.PI * this.pokeFlaps * u;
                const envelope = Math.sin(Math.PI * u);
        
                this.pokeWingOffset = this.pokeWingAmp * Math.sin(phase) * envelope;
                this.pokeHeadOffset = this.pokeHeadAmp * Math.sin(phase) * envelope;
            }
        }
    }

    renderUpperBody(setMat) {
        let color = [];
        let i;
        let prismBlock = new Prism();
        let cubeBlock = new Cube();
      
        for (i = 0; i < 4; i++) {
          color[i] = [1.0 - i * 0.05, 1.0 - i * 0.05, 1.0 - i * 0.05, 1.0 - i * 0.05];
        }
        for (; i < 10; i++) {
          color[i] = [0.2,0.2,0.2,1.0];
        }
      
        
        prismBlock.color = color[0];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.scale(0.3,0.5,0.1);
        prismBlock.matrix.rotate(270,1,0,0);
        prismBlock.render();
      
        prismBlock.color = color[1];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.scale(-1,1,1);
        prismBlock.matrix.scale(0.3,0.5,0.1);
        prismBlock.matrix.rotate(270,1,0,0);
        prismBlock.render();
      
        prismBlock.color = color[2];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.scale(0.3,0.5,0.2);
        prismBlock.matrix.rotate(-90,0,1,0);
        prismBlock.render();
      
        prismBlock.color = color[3];  
        prismBlock.matrix.set(this.setMtrx);   
        prismBlock.matrix.scale(-1,1,1);
        prismBlock.matrix.scale(0.3,0.5,0.2);
        prismBlock.matrix.rotate(-90,0,1,0);
        prismBlock.render();
      
        prismBlock.color = color[4];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.translate(0,0.5,0.2);
        prismBlock.matrix.rotate(180,1,0,0);
        prismBlock.matrix.scale(0.3,0.5,0.2);
        prismBlock.matrix.rotate(-90,0,1,0);
        prismBlock.render();
      
        prismBlock.color = color[5];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.scale(-1,1,1);
        prismBlock.matrix.translate(0,0.5,0.2);
        prismBlock.matrix.rotate(180,1,0,0);
        prismBlock.matrix.scale(0.3,0.5,0.2);
        prismBlock.matrix.rotate(-90,0,1,0);
        prismBlock.render();
      
        prismBlock.color = color[6];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.translate(0.2,0.5,0.2);
        prismBlock.matrix.scale(0.1,0.5,0.3);
        prismBlock.matrix.rotate(90,1,0,0);
        prismBlock.render();

        prismBlock.color = color[7];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.scale(-1,1,1);
        prismBlock.matrix.translate(0.2,0.5,0.2);
        prismBlock.matrix.scale(0.1,0.5,0.3);
        prismBlock.matrix.rotate(90,1,0,0);
        prismBlock.render();
      
        prismBlock.color = color[8];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.translate(0,0.5,0.5);
        prismBlock.matrix.scale(0.2,0.5,0.1);
        prismBlock.matrix.rotate(90,1,0,0);
        prismBlock.render();

        prismBlock.color = color[9];
        prismBlock.matrix.set(this.setMtrx);
        prismBlock.matrix.scale(-1,1,1);
        prismBlock.matrix.translate(0,0.5,0.5);
        prismBlock.matrix.scale(0.2,0.5,0.1);
        prismBlock.matrix.rotate(90,1,0,0);
        prismBlock.render();
        
        cubeBlock.color = [0.2,0.2,0.2,1.0];
        cubeBlock.matrix.set(this.setMtrx);
        cubeBlock.matrix.translate(-0.2,0,0.2);
        cubeBlock.matrix.scale(0.4,0.5,0.3);
        cubeBlock.render();

    }
      
    renderLowerBody(setMat) {
        let color = [];
        let i;
        //let rotMat = new Matrix4();
      
        //ra.push(new Cube());
        //ra[0].color = [1,1,1,1];

        let cube = new Cube();
        let prism = new Prism();
        let baseMtrx = new Matrix4();
        
        //ra.push(new Prism());
        //ra[1].color = [1,1,1,1];
        color[0] = [1,1,1,1];
        color[1] = [1,1,1,1];
      
        for (i = 2; i < 11; i++) {
          //ra.push(new Prism());
          color[i] = [0.2,0.2,0.2,1.0]; 
        }
      
        //for (i=0; i < 11; i++){
        //  ra[i].matrix.set(rotMat);
        //}
      
        cube.color = color[0];
        cube.matrix.set(this.setMtrx);
        cube.matrix.translate(-0.3,0.0,0.1);
        cube.matrix.scale(0.6,0.4,0.1);
        cube.matrix.rotate(90,1,0,0);
        cube.render();
      
        prism.color = color[1];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(-0.25,0.0,0.1);
        prism.matrix.scale(0.5,0.4,0.1);
        prism.matrix.rotate(-90,1,0,0);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        prism.color = color[2];
        prism.matrix.set(this.setMtrx);
        baseMtrx.setTranslate(0.2,0.0,0.2);
        baseMtrx.scale(0.1,0.4,0.3);
        baseMtrx.rotate(90,1,0,0);
        prism.matrix.concat(baseMtrx);
        prism.render();

        prism.color = color[3];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[4];
        prism.matrix.set(this.setMtrx);
        baseMtrx.setTranslate(0,0.0,0.5);
        baseMtrx.scale(0.2,0.4,0.1);
        baseMtrx.rotate(90,1,0,0);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[5];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[6];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(-0.15,-0.4,0.2);
        prism.matrix.scale(0.30,0.1,0.1);
        prism.matrix.rotate(-90,1,0,0);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        //ra[8].matrix.scale(-1,1,1);
        prism.color = color[7];
        prism.matrix.set(this.setMtrx);
        baseMtrx.setTranslate(0.15,-0.4,0.2);
        baseMtrx.scale(0.05,0.1,0.3);
        baseMtrx.rotate(-90,0,0,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[8];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[9];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(-0.15,-0.5,0.5);
        prism.matrix.scale(0.3,0.1,0.3);
        prism.matrix.rotate(-90,1,0,0);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        // tail
        prism.color = color[10];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0.15,-0.6,0.5);
        prism.matrix.scale(0.3,0.2,0.3);
        prism.matrix.rotate(-90,0,1,0);
        prism.render();

        //for (i=0; i < 11; i++){
        //  ra[i].render();
        //}
    }
      
    renderWings() {
        let color = [];
        let i;
        let baseMtrx = new Matrix4();
        let prism = new Prism();
        let cube = new Cube();
      
        const wings = this.moveWings + this.pokeWingOffset;
          // ...rest of your function unchanged...
        let moveWingsXdir = wings * 0.78;
        let moveWingsYdir = wings * 0.167;
        let moveWingsZdir = wings * 1.11;

        prism.textureNum = 2;
        prism.texWeight = 1;
        cube.textureNum = 2;
        cube.texWeight = 1;
      
        for (i = 0; i < 4; i++) {
          //ra.push(new Cube());
          //ra[i].textureNum = 1;
          //ra[i].texWeight = 1;
          color[i] = [1,1,1,1];
        }
      
        for (; i < 8; i++) {
          //ra.push(new Prism());
          //ra[i].textureNum = 1;
          //ra[i].texWeight = 1;
          color[i] = [0.3,0.3,0.3,1.0];
        }
      
        //for (i=0; i < 8; i++) {
        //  ra[i].matrix.set(rotMat);
        //}
      
        cube.color = color[0];
        cube.matrix.set(this.setMtrx);
        baseMtrx.setTranslate(0.29,0.4,0.23);
        baseMtrx.rotate(-moveWingsYdir,0,1,0);
        baseMtrx.rotate(moveWingsXdir,1,0,0);
        baseMtrx.rotate(moveWingsZdir,0,0,1);
        baseMtrx.rotate(6,1,0,0);
        baseMtrx.rotate(7,0,0,1);
        baseMtrx.translate(0.0,-0.3,0.0);
        baseMtrx.scale(0.02,0.3,0.2);
        cube.matrix.concat(baseMtrx);
        cube.render();

        cube.color = color[1];
        cube.matrix.set(this.setMtrx);
        cube.matrix.scale(-1,1,1);
        cube.matrix.concat(baseMtrx);
        cube.render();
        
        cube.color = color[2];
        cube.matrix.set(this.setMtrx);
        baseMtrx.setTranslate(0.29,0.4,0.23);
        baseMtrx.rotate(-moveWingsYdir,0,1,0);
        baseMtrx.rotate(moveWingsXdir,1,0,0);
        baseMtrx.rotate(moveWingsZdir,0,0,1);
        baseMtrx.translate(0.035,-0.55,0.02);
        baseMtrx.scale(0.015,0.275,0.15);
        cube.matrix.concat(baseMtrx);
        cube.render();
        
        cube.color = color[3];
        cube.matrix.set(this.setMtrx);
        cube.matrix.scale(-1,1,1);
        cube.matrix.concat(baseMtrx);
        cube.render();
      
      
        prism.color = color[4];
        prism.matrix.set(this.setMtrx);
        baseMtrx.setTranslate(0.29,0.4,0.23);
        baseMtrx.rotate(-moveWingsYdir,0,1,0);
        baseMtrx.rotate(moveWingsXdir,1,0,0);
        baseMtrx.rotate(moveWingsZdir,0,0,1);
        baseMtrx.rotate(6,1,0,0);
        baseMtrx.rotate(7,0,0,1);
        baseMtrx.translate(0.02,-0.3,0.0);
        baseMtrx.scale(0.03,0.3,0.2);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[5];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        prism.color = color[6];
        prism.matrix.set(this.setMtrx);
        baseMtrx.translate(0.29,0.4,0.23);
        baseMtrx.rotate(-moveWingsYdir,0,1,0);
        baseMtrx.rotate(moveWingsXdir,1,0,0);
        baseMtrx.rotate(moveWingsZdir,0,0,1);
        baseMtrx.translate(0.05,-0.275,0.02);
        baseMtrx.scale(0.025,0.275,0.15);
        baseMtrx.rotate(-90,0,0,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
       
        prism.color = color[7];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.concat(baseMtrx);
        prism.render();
      
        //for (i=0; i < 8; i++){
        //  ra[i].render();
        //}
      }
        

      
     renderLegs() {
        let color = [];
        let cube = new Cube();
        let prism = new Prism();
        let i;
        let moveLeftLegXdir, moveLeftLegYdir = 0, moveLeftLegZdir = 0;
        let moveLeftFootXdir = this.moveLeftFoot - 10;
        let moveLeftToesXdir;
        let moveRightLegXdir, moveRightLegYdir = 0, moveRightLegZdir = 0;
        let moveRightFootXdir = this.moveRightFoot - 10;
        let moveRightToesXdir;
      
        
        //rotMat.rotate(-10*Math.sin(g_walkSpeed),0,0,1);
        //rotMat.rotate(15*Math.sin(g_walkSpeed + (Math.PI / 2)),0,1,0);
      
        if (this.animateWalk) {
          let angle1NEG = this.walkSpeed - (Math.PI / 2);
          let angle2POS = this.walkSpeed + (Math.PI / 2);

          moveLeftLegXdir = -25*Math.sin(angle1NEG + (0.5 * Math.cos(angle1NEG)));
          //moveLeftLegYdir = -15*Math.sin((g_walkSpeed + (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed + (Math.PI / 2))));
          moveLeftLegYdir = -15*Math.sin(angle2POS);
          moveLeftLegZdir = -10*Math.sin(angle1NEG);
          moveLeftToesXdir = 25*Math.sin(angle1NEG + (0.5 * Math.cos(angle1NEG))) + 10;
          moveRightLegXdir = -25*Math.sin(angle2POS + (0.5 * Math.cos(angle2POS)));
          //moveRightLegYdir = -15*Math.sin((g_walkSpeed - (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed - (Math.PI / 2))));
          moveRightLegYdir = -15*Math.sin(angle1NEG);
          moveRightLegZdir = -10*Math.sin(angle2POS);
          moveRightToesXdir = 25*Math.sin(angle2POS + (0.5 * Math.cos(angle2POS))) + 10;

        }
        else{
          moveLeftLegXdir = this.moveLeftLeg - 25;
          moveLeftToesXdir = this.moveLeftToes - 10;
          moveRightLegXdir = this.moveRightLeg - 25;
          moveRightToesXdir = this.moveRightToes - 10;;
        }
      
      
        for (i = 0; i < 2; i++) {
          //ra.push(new Cube());
          color[i] = [1, 1, 1, 1];
        }
      
        for (; i < 8; i++) {
          //ra.push(new Prism());
          color[i] = [0.3,0.3,0.3,1.0];
        }
      
        //for (i=0; i < 8; i++){
        //  ra[i].matrix.set(rotMat);
        //}
      
        //ra[0].color = [1,1,1,1];
        cube.color = color[0];
        cube.matrix.set(this.setMtrx);
        cube.matrix.translate(0.17,-0.4,0.25);
        cube.matrix.rotate(moveLeftLegZdir,0,0,1);
        cube.matrix.rotate(moveLeftLegYdir,0,1,0);
        cube.matrix.rotate(moveLeftLegXdir,1,0,0);
        cube.matrix.translate(0,-0.15,-0.1);
        cube.matrix.scale(0.12,0.15,0.15);
        cube.render();
      
        cube.color = color[1];
        cube.matrix.set(this.setMtrx);
        cube.matrix.scale(-1,1,1);
        cube.matrix.translate(0.17,-0.4,0.25);
        cube.matrix.rotate(moveRightLegZdir,0,0,1);
        cube.matrix.rotate(moveRightLegYdir,0,1,0);
        cube.matrix.rotate(moveRightLegXdir,1,0,0);
        cube.matrix.translate(0,-0.15,-0.1);
        cube.matrix.scale(0.12,0.15,0.15);
        cube.render();
      
      
        cube.color = color[2];
        cube.matrix.set(this.setMtrx);
        cube.matrix.translate(0.169,-0.4,0.25);
        cube.matrix.rotate(moveLeftLegZdir,0,0,1);
        cube.matrix.rotate(moveLeftLegYdir,0,1,0);
        cube.matrix.rotate(moveLeftLegXdir,1,0,0);
        cube.matrix.translate(0,-0.15,0.02);
        cube.matrix.rotate(moveLeftFootXdir,1,0,0);
        cube.matrix.translate(0,-0.05,-0.12);
        cube.matrix.scale(0.1,0.05,0.15);
        cube.render();
      
      
        cube.color = color[3];
        cube.matrix.set(this.setMtrx);
        cube.matrix.scale(-1,1,1);
        cube.matrix.translate(0.169,-0.4,0.25);
        cube.matrix.rotate(moveRightLegZdir,0,0,1);
        cube.matrix.rotate(moveRightLegYdir,0,1,0);
        cube.matrix.rotate(moveRightLegXdir,1,0,0);
        cube.matrix.translate(0,-0.15,0.02);
        cube.matrix.rotate(moveRightFootXdir,1,0,0);
        cube.matrix.translate(0,-0.05,-0.12);
        cube.matrix.scale(0.1,0.05,0.15);
        cube.render();
      
       
        prism.color = color[4];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0.17,-0.4,0.25);
        prism.matrix.rotate(moveLeftLegZdir,0,0,1);
        prism.matrix.rotate(moveLeftLegYdir,0,1,0);
        prism.matrix.rotate(moveLeftLegXdir,1,0,0);
        prism.matrix.translate(0.1,0,0.05);
        prism.matrix.scale(0.1,0.15,0.1);
        prism.matrix.rotate(-90,0,0,1);
        prism.matrix.rotate(90,1,0,0);
        prism.render();
      
        prism.color = color[5];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.translate(0.17,-0.4,0.25);
        prism.matrix.rotate(moveRightLegZdir,0,0,1);
        prism.matrix.rotate(moveRightLegYdir,0,1,0);
        prism.matrix.rotate(moveRightLegXdir,1,0,0);
        prism.matrix.translate(0.1,0,0.05);
        prism.matrix.scale(0.1,0.15,0.1);
        prism.matrix.rotate(-90,0,0,1);
        prism.matrix.rotate(90,1,0,0);
        prism.render();
      
      
        prism.color = color[6];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0.17,-0.4,0.25);
        //ra[6].matrix.rotate(moveLeftFootXdir,1,0,0);
        prism.matrix.rotate(moveLeftLegZdir,0,0,1);
        prism.matrix.rotate(moveLeftLegYdir,0,1,0);
        prism.matrix.rotate(moveLeftLegXdir,1,0,0);
        prism.matrix.translate(0,-0.15,0.02);
        prism.matrix.rotate(moveLeftFootXdir,1,0,0);
        prism.matrix.translate(0,-0.05,-0.12);
        prism.matrix.rotate(moveLeftToesXdir,1,0,0);
        prism.matrix.scale(0.1,0.05,0.15);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
      
        prism.color = color[7];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.translate(0.17,-0.4,0.25);
        prism.matrix.rotate(moveRightLegZdir,0,0,1);
        prism.matrix.rotate(moveRightLegYdir,0,1,0);
        prism.matrix.rotate(moveRightLegXdir,1,0,0);
        prism.matrix.translate(0,-0.15,0.02);
        prism.matrix.rotate(moveRightFootXdir,1,0,0);
        prism.matrix.translate(0,-0.05,-0.12);
        prism.matrix.rotate(moveRightToesXdir,1,0,0);
        prism.matrix.scale(0.1,0.05,0.15);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        //for (i=0; i < 8; i++){
        //  ra[i].render();
        //}
      } //original: line
      
      
     renderHeadNeck() {
        let color = [];
        let i;
        let cube = new Cube();
        let prism = new Prism();

        let moveHeadXdir = this.pokeWingOffset;
        if (this.animateWalk) {
          //moveLeftLegXdir = -25*Math.sin((g_walkSpeed - (Math.PI / 2)) + (0.5 * Math.cos(g_walkSpeed - (Math.PI / 2))));
          moveHeadXdir = -15*Math.sin(this.walkSpeed + (Math.PI / 2)) + this.pokeWingOffset;
        }
        //, moveHeadYdir, moveHeadZdir;
      
        color[0] = [1, 1, 1, 1];
        for (i = 1; i < 3; i++) {
          //ra.push(new Cube());
          color[i] = [0.3,0.3,0.3,1.0];
        }
      
        for (; i < 16; i++) {
          //ra.push(new Prism());
          //ra[i].color = [0.3 - i * 0.01, 0.3 - i * 0.01, 0.3 - i * 0.01, 0.3 - i * 0.01];
          //ra[i].textureNum = 0;
          color[i] = [0.3,0.3,0.3,1.0];
        }
      
        //for (i=0; i < 16; i++){
        //  ra[i].matrix.set(rotMat);
        //}
        
        //rotMat.rotate(-10*Math.sin(g_walkSpeed),0,0,1);
        //rotMat.rotate(15*Math.sin(g_walkSpeed + (Math.PI / 2)),0,1,0);
      
        cube.color = color[0];
        cube.matrix.set(this.setMtrx);
        cube.matrix.translate(-0.15,0.5,0.075);
        cube.matrix.scale(0.3,0.15,0.125);
        cube.render();
        //ra[0].render();
      
        cube.color = color[1];
        cube.matrix.set(this.setMtrx);
        cube.matrix.translate(-0.15,0.5,0.2);
        cube.matrix.scale(0.3,0.15,0.2);
        cube.render();
      
        cube.color = color[2];
        cube.matrix.set(this.setMtrx);
        cube.matrix.translate(0,0.65,0.235);
        cube.matrix.rotate(moveHeadXdir,0,1,0);
        cube.matrix.translate(-0.1,0.00,-0.16);
        cube.matrix.scale(0.2,0.075,0.08);
        cube.render();
      
        //ra[3].color = [1,1,1,1];
        prism.color = [1,1,1,1];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(-0.15,0.5,0.075);
        prism.matrix.scale(0.3,0.15,0.075);
        prism.matrix.rotate(90,0,1,0)
        prism.render();
      
        prism.color = color[4];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0.15,0.5,0.4);
        prism.matrix.scale(0.3,0.15,0.1);
        prism.matrix.rotate(-90,0,1,0)
        prism.render();
      
        //ra[5].color = [1,1,1,1];
        prism.color = [1,1,1,1];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0.15,0.5,0.075);
        prism.matrix.scale(0.1,0.15,0.125);
        prism.render();
      
        //ra[6].color = [1,1,1,1];
        prism.color = [1,1,1,1];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.translate(0.15,0.5,0.075);
        prism.matrix.scale(0.1,0.15,0.125);
        prism.render();
      
      
        prism.color = color[7];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0.15,0.5,0.2);
        prism.matrix.scale(0.075,0.15,0.2);
        prism.render();
      
        prism.color = color[8];
        prism.matrix.set(this.setMtrx);
        prism.matrix.scale(-1,1,1);
        prism.matrix.translate(0.15,0.5,0.2);
        prism.matrix.scale(0.075,0.15,0.2);
        prism.render();
      
      
        prism.color = color[9];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0,0.65,.24);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(0.1,0,.02);
        prism.matrix.scale(0.2,0.15,0.14);
        prism.matrix.rotate(-90,0,1,0);
        prism.render();
      
        prism.color = color[10];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0,0.65,0.24);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(0.1,0.15,0.02);
        prism.matrix.scale(0.2,0.15,0.105);
        prism.matrix.rotate(180,1,0,0);
        prism.matrix.rotate(-90,0,1,0);
        prism.render();
      
        prism.color = [.95,0.8,0,1];
        prism.matrix.set(this.setMtrx);
        prism.color = [95,0.8,0,1];
        prism.matrix.translate(0,0.65,0.24);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(0.1,0,-0.085);
        prism.matrix.scale(0.2,0.15,0.105);
        prism.matrix.rotate(-90,0,1,0);
        prism.render();
      
        prism.color = color[12];
        prism.matrix.set(this.setMtrx);
        //ra[12].matrix.translate(-0.1,0.725,0.155);
        prism.matrix.translate(0,0.65,0.24);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(-0.1,0.075,-0.085);
        prism.matrix.scale(0.2,0.075,0.155);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        prism.color = color[13];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0,0.65,0.24);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(-0.1,0.075,-0.165);
        prism.matrix.scale(0.2,0.075,0.075);
        prism.matrix.rotate(-90,1,0,0);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        prism.color = [.1,.1,.1,.1];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0,0.65,0.235);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(-0.05,0.05,-0.145);
        prism.matrix.scale(0.1,0.045,0.175);
        prism.matrix.rotate(90,0,1,0);
        prism.render();
      
        prism.color = [.1,.1,.1,.1];
        prism.matrix.set(this.setMtrx);
        prism.matrix.translate(0,0.65,0.235);
        prism.matrix.rotate(moveHeadXdir,0,1,0);
        prism.matrix.translate(0.05,0.05,-0.145);
        prism.matrix.scale(0.1,0.035,0.175);
        prism.matrix.rotate(180,1,0,0);
        prism.matrix.rotate(-90,0,1,0);
        prism.render();
      
        //for (i=0; i < 16; i++){
        //  ra[i].render();
        //}
      } //original line: 656
      

    // custom scale matrix + animates the body of the penguin 
    wholeBodyTransform(scalar, x, y, z, xRot, yRot, zRot) {
    
        //wbMatrix.setTranslate(x,y,z);
        this.setMtrx.setTranslate(x,y,z);
        this.setMtrx.scale(scalar,scalar,scalar);
        this.setMtrx.rotate(zRot, 0, 0, 1);
        this.setMtrx.rotate(yRot, 0, 1, 0);
        this.setMtrx.rotate(xRot, 1, 0, 0);
    
        if (this.animateWalk) {
          this.setMtrx.rotate(-10 * Math.sin(this.walkSpeed), 0, 0, 1);
          this.setMtrx.rotate(15 * Math.sin(this.walkSpeed + (Math.PI / 2)), 0, 1, 0);
        } 
        //return wbMatrix;
    }
    
    // Entry point for drawing the penguin (called from renderAllShapes) :contentReference[oaicite:9]{index=9}
    render() {
        // If you want: const rotMat = this.makeLocalRotMat();
        //let setMat = this.wholeBodyTransform(scalar);
        this.renderUpperBody();
        this.renderLowerBody();
        this.renderWings();
        this.renderLegs();
        this.renderHeadNeck();
    }

}