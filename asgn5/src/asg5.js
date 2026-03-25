import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
//import Pyramid from './Shapes/Pyramid.js'
import * as Pyramid from './Shapes/createPyramidGeometry.js';
import {Portal} from './Classes/portal.js';
import {Icosahedron} from './Classes/icosahedron.js';
import {Vector3, Vector4, Matrix4} from '../lib/cuon-matrix-cse160.js';


function main () {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    antialias: true, canvas,
    logarithmicDepthBuffer: true
  });
  //const gui = new GUI();

  //CAMERA
  //set-up
  const fov = 40; 
  const aspect = 2; 
  const near = 0.1;
  //1000000
  const far = 2000000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const orbitControls = new OrbitControls( camera, renderer.domElement );
  const pointerControls = new PointerLockControls( camera, renderer.domElement );

  const keysDown = new Set();
  const moveSpeed = 50;
  let lastTime = 0;
  let entered = false;
  let stoppedTime = 0;
  let offsetTime = 0;
  let currentTime = 0;
  let paused = false;
  let offset = false;
  let risen = false;
  //let previousCamVec = new Vector3([0,0,0]);
  let checked = false;
  let crossForAngleDir = new THREE.Vector3(0,0,0);
  let aCosTheta;
  let angle;

  let sqrt2 = Math.sqrt(2)
  let lookDirXZ = new THREE.Vector3(0,0,0);
  let plusPlusVec = new THREE.Vector3(sqrt2 / 2, 0, sqrt2 / 2);
  let plusMinusVec = new THREE.Vector3(sqrt2 / 2, 0, -sqrt2 / 2);
  let minusMinusVec = new THREE.Vector3(-sqrt2 / 2, 0, -sqrt2 / 2);
  let minusPlusVec = new THREE.Vector3(-sqrt2 / 2, 0, sqrt2 / 2);
  let up1 = new THREE.Vector3(0,0,0);
  let up2 = new THREE.Vector3(0,0,0);
  let quadNum;
  let spotAngleLimit = Math.PI / 16;

  camera.position.set(0, 1.5, 100);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 1.5, -1000);
  let cameraVector = new Vector3( [camera.position.x, camera.position.y, camera.position.z] );
  //console.log( cameraVector );
  //cameraVector.setElements( [0.5,0.5,0.5] );
  //console.log( cameraVector );
  //orbitControls.update();

  orbitControls.target.set(0, 0, 0);
  switchToOrbit();
 
  //SCENE
  const scene0 = new THREE.Scene();
  const scene1 = new THREE.Scene();
  const scene2 = new THREE.Scene();
  let objects = [];
  let particles = [];
  let icosas = [];
  /*
  let icosaPositionsX = [];
  let icosaPositionsY = [];
  let icosaPositionsZ = [];
  let icosaRotationX = [];
  let icosaRotationY = [];
  let icosaRotationZ = [];
  */

  let particleLight0 = [];
  let particleLight2 = [];
  let portalLights = [];
  let portalLightPositionsX = [];
  let portalLightPositionsY = [];
  let portalLightPositionsZ = [];
  let spotLight0;
  let spotLight2;
  const lookDir = new THREE.Vector3();
  const targetPos = new THREE.Vector3(); 
  let spotLightOn = false;

  //let object;
  let scene1Tex;
  let exit = false;

  //console.log(19.99 % 10);
  
  

  addActionsForHtmlUI();
  addSkyBox();
  addLattice();
  addObjects();
  addScene02Shapes();
  //addSolarSystem();
  addLights();

  requestAnimationFrame(render);

  function addActionsForHtmlUI(){ 
    window.addEventListener('keydown', (e) => {
      keysDown.add(e.code);

      if (e.code === 'KeyC') {
        if (orbitControls.enabled) {
          switchToPointer();
        } else {
          switchToOrbit();
        }
      }

      if (e.code === 'KeyO') {
        if (entered) {
          exit = true;
        }
      }

      if (e.code === 'KeyF') {
        if (!spotLightOn) {
            spotLightOn = true;
        }
        else {
            spotLightOn = false;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      keysDown.delete(e.code);
    });

    pointerControls.addEventListener("lock", () => {
      console.log("Pointer locked");
    });
      
    pointerControls.addEventListener("unlock", () => {
      console.log("Pointer unlocked. Orbit Controls Enabled");
      switchToOrbit();
    });    
  }

  function switchToPointer() {
    orbitControls.enabled = false;
    if (!pointerControls.isLocked) {
      pointerControls.lock();
    }
  }

  function switchToOrbit() {
    if (pointerControls.isLocked) {
      pointerControls.unlock();
    }
    // Set the orbit target in front of the camera
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    orbitControls.target.copy(camera.position).add(dir);
 
    orbitControls.enabled = true;
    orbitControls.update();
  }

  /*
    0: right  (+x)
    1: left   (-x)
    2: top    (+y)
    3: bottom (-y)
    4: front  (+z)
    5: back   (-z) 
  */
  function addSkyBox() {
    const loader = new THREE.TextureLoader();

    const rightTex = loader.load('../resources/wall0.jpg');
    rightTex.colorSpace = THREE.SRGBColorSpace;
    rightTex.wrapS = THREE.RepeatWrapping;
    rightTex.wrapT = THREE.RepeatWrapping;
    rightTex.repeat.set(1,100);
    const leftTex  = loader.load('../resources/wall2.jpg');
    leftTex.colorSpace = THREE.SRGBColorSpace;
    leftTex.wrapS = THREE.RepeatWrapping;
    leftTex.wrapT = THREE.RepeatWrapping;
    leftTex.repeat.set(1,100);
    const frontTex = loader.load('../resources/wall3.jpg');
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.wrapS = THREE.RepeatWrapping;
    frontTex.wrapT = THREE.RepeatWrapping;
    frontTex.repeat.set(1,100);
    const backTex  = loader.load('../resources/wall1.jpg');
    backTex.colorSpace = THREE.SRGBColorSpace;
    backTex.wrapS = THREE.RepeatWrapping;
    backTex.wrapT = THREE.RepeatWrapping;
    backTex.repeat.set(1,100);

    const materials = [
      new THREE.MeshPhongMaterial({ map: rightTex, side: THREE.BackSide }), // +x
      new THREE.MeshPhongMaterial({ map: leftTex,  side: THREE.BackSide }), // -x
      new THREE.MeshPhongMaterial({ color: 0x333333, side: THREE.BackSide }), // top
      new THREE.MeshPhongMaterial({ color: 0x333333, side: THREE.BackSide }), // bottom
      new THREE.MeshPhongMaterial({ map: frontTex, color: 0xEEEEEE, side: THREE.BackSide }), // +z
      new THREE.MeshPhongMaterial({ map: backTex, color: 0xCCCCCC,  side: THREE.BackSide }), // -z
    ];    

    const geometry0 = new THREE.BoxGeometry( 1050, 50000, 1050 );
    const skyBox0 = new THREE.Mesh( geometry0, materials );
    scene0.add( skyBox0 );   

    const skyBox2 = skyBox0.clone();
    scene2.add( skyBox2 ); 

    scene1Tex = loader.load('../resources/stars2.jpg');
    scene1Tex.colorSpace = THREE.SRGBColorSpace;
    scene1Tex.wrapS = THREE.RepeatWrapping;
    scene1Tex.wrapT = THREE.RepeatWrapping;

    const geometry1 = new THREE.BoxGeometry( 1000, 1000000, 1000 );
    const material1 = new THREE.MeshBasicMaterial({ map: scene1Tex, side: THREE.BackSide });
    const skyBox1 = new THREE.Mesh( geometry1, material1 );
    scene1.add( skyBox1 );
  }

  function addLattice() {
    const geometry = Pyramid.createPyramidGeometry();
    /*
    const material0 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x882222);
    const material1 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x918267);
    const material2 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x4E5F68);
    const material3 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x999990);
    */
    const material0 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x6043AA);
    const material1 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x6043AA);
    const material2 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x6043AA);
    const material3 = Pyramid.createPyramidTexture('../resources/cobblestone.jpg', 0x6043AA);

    // to right wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material0);
      mesh.position.set(step, -2, 0);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);

      const mesh_copy = mesh.clone();
      scene2.add(mesh_copy);
    }

    // to front wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material1);
      mesh.position.set(0, -2, -step);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);

      const mesh_copy = mesh.clone();
      scene2.add(mesh_copy);
    }

    // to left wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material2);
      mesh.position.set(-step, -2, 0);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);

      const mesh_copy = mesh.clone();
      scene2.add(mesh_copy);
    }

    // to back wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material3);
      mesh.position.set(0, -2, step);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);

      const mesh_copy = mesh.clone();
      scene2.add(mesh_copy);
    }

  }

  //0x882222
  //0x918267
  //0x4E5F68
  //0x999990
  function addObjects() {
    // add obj loaded "mainframe"
    const mtlLoader = new MTLLoader();
    mtlLoader.load('./Shapes/Mainframe.mtl', (mtl) => {
      mtl.preload();
      //for (const material of Object.values(mtl.materials)) {
      //  material.side = THREE.DoubleSide;
      //}
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('./Shapes/Mainframe.obj', (root) => {
        /*
        root.traverse((child) => {
          if (child.isMesh) {
            //child.material = new THREE.MeshPhongMaterial({
            //  color: 0x1010FF,
            //  emissive: 0x555022,
            //  emissiveIntensity: 0.05,
            //});
            child.material.color.set(0x7A2E2E);
            child.material.color.multiplyScalar(0.7);
          }
        });        
        
        let root1 = root.clone(true);
        //const particle1Tex = loader.load('../resources/stars3.jpg');
        //particle1Tex.colorSpace = THREE.SRGBColorSpace;
        
        root1.traverse((child) => {
          if (child.isMesh) {
            //child.material = new THREE.MeshPhongMaterial({
              //map: particle1Tex,
              //side: THREE.FrontSide,
              //color: 0x050000,
              //emissive: 0x555022,
              //emissiveIntensity: 0.0,
            //});
            child.material.color.set(0xCC8E8E);
            child.material.color.multiplyScalar(2);
          }
        }); 

        let root2 = root.clone(true);
        root2.traverse((child) => {
            if (child.isMesh) {
              child.material.color.set(0x7A2E2E);
              child.material.color.multiplyScalar(0.7);
            }
          }); 
        */
          root.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
              child.material.color.set(0x7A2E2E);
              child.material.color.multiplyScalar(0.7);
            }
          });

          let root1 = root.clone(true);
        root1.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.set(0xCC8E8E);
            child.material.color.multiplyScalar(2);
          }
        });

        let root2 = root.clone(true);
        root2.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.set(0x7A2E2E);
            child.material.color.multiplyScalar(0.7);
          }
        });
          
        

        particles[0] = root;
        particles[1] = root1;
        particles[2] = root2;

        particles[0].scale.set(50, 50, 50);
        particles[1].scale.set(50, 50, 50);
        particles[2].scale.set(50, 50, 50);
  
        scene0.add(particles[0]);
        scene1.add(particles[1]);
        scene2.add(particles[2]);
      });
    });
  }

  function testAxis() {
    let icosaTest = new Icosahedron();
    icosaTest = icosas[0].mesh.clone();
    console.log(icosaTest);
    icosaTest.scale.set(5,5,5);

    let world = false; 
    if (world) {
      icosaTest.rotateOnWorldAxis(new THREE.Vector3(0,1,0), Math.PI / 4);
      let axis = new THREE.Vector3(1,0, 0).normalize();
      //icosaTest.rotateOnWorldAxis(new THREE.Vector3(Math.sqrt(2) / 2,0, Math.sqrt(2) / 2), Math.PI / 4 );
      icosaTest.rotateOnWorldAxis(axis, Math.PI * 3 / 2);
      scene2.add(icosaTest);
      //icosaTest.rotateOnWorldAxis(new THREE.Vector3(0,1,0), Math.PI / 2);
    }
    else {
      icosaTest.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 4);
      let axis = new THREE.Vector3(1,0, 0).normalize();
      //let axis = new THREE.Vector3(Math.sqrt(2) / 2,0, Math.sqrt(2) / 2).normalize();
      icosaTest.rotateOnAxis(axis, Math.PI * 3 / 2);
      //arrow code starts here
      //const dir = new THREE.Vector3(0, 1, 0);  // direction
      //dir.normalize();

      const origin = new THREE.Vector3(0, 0, 0); // starting point
      const length = 40;
      const color = 0xff0000;

      const arrow = new THREE.ArrowHelper(axis, origin, length, color);
      scene2.add(arrow);
      scene2.add(icosaTest);
      //icosaTest.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 2);
    }
  }

  function addScene02Shapes() {
    // add central light object
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
    const cube0 = new THREE.Mesh( geometry, materials );
    cube0.scale.set(10,10,10);
    cube0.rotation.y = Math.PI / 2;
    //cube0.position.set(0,6,0);


    //const cube1 = new THREE.Mesh( geometry, materials );
    //cube1.scale.set(10,10,10)
    const cube1 = cube0.clone()
    cube1.rotation.y =  - Math.PI / 2;
    //cube2.position.set(0,-6,0);

    objects.push(cube0);
    objects.push(cube1);
    scene0.add( cube0 );  
    scene0.add( cube1 ); 
    
    const cube02 = cube0.clone();
    const cube12 = cube1.clone();
    objects.push(cube02);
    objects.push(cube12);
    scene2.add( cube02 );  
    scene2.add( cube12 ); 

    //SCENE2 EXCLUSIVE shapes
    for (let i = 0; i < 4; i++ ) {
      icosas.push(new Icosahedron());
    }

    icosas[0].createMesh(7,0,'../resources/face0.jpg');
    icosas[0].mesh.scale.set(20,20,20);
    icosas[1].mesh = icosas[0].mesh.clone();
    icosas[2].mesh = icosas[0].mesh.clone();
    icosas[3].mesh = icosas[0].mesh.clone();

    //icosaTest.rotation.set(0, Math.PI / 2, 0);
    let test = false; 
    if (test) {
      testAxis();
    }

    //arrow code starts here
    //const dir = new THREE.Vector3(0, 1, 0);  // direction
    //dir.normalize();

    icosas[0].setPosition(400, Math.floor(Math.random() * 70 + 500), 0);
    icosas[1].setPosition(0, Math.floor(Math.random() * 70 + 500), -400);
    icosas[2].setPosition(-400, Math.floor(Math.random() * 70 + 500), 0);
    icosas[3].setPosition(0, Math.floor(Math.random() * 70 + 500), 400);

    //icosas[0].setPosition(500, 320, 0);
    //icosas[1].setPosition(0, 320, -500);
    //icosas[2].setPosition(-500, 320, 0);
    //icosas[3].setPosition(0, 320, 500);

    for ( let i = 0; i < 4; i++ ) {
      //icosas[i].setRotationY(0, i * Math.PI / 2, 0);
      icosas[i].setOriginVectorXZ();    //originVectorXZ.setElements([0 - icosas[i].positionX, 0, 0 - icosas[i].positionZ]).normalize();
      icosas[i].findCameraVectorXZ(camera.position.x, camera.position.z);
      let aCosTheta = Vector3.dot(icosas[i].cameraVectorXZ, icosas[i].originVectorXZ);
      let angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) );
      Vector3.cross(crossForAngleDir, icosas[i].originVectorXZ, icosas[i].cameraVectorXZ);

      if (crossForAngleDir.y < 0) {
        //console.log(i + ": this motherfucker is negative!");
        angle *= -1;
      }
      icosas[i].setRotationY(angle);     

      icosas[i].findCamOrthoVector(); 
      icosas[i].findPitchAxisVector();
      icosas[i].findCameraVectorXYZ(camera.position.x, camera.position.y, camera.position.z);
      aCosTheta = Vector3.dot(icosas[i].cameraVectorXZ, icosas[i].cameraVectorXYZ);
      angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) );
      icosas[i].setRotationPitch(angle);     
      //console.log(angle * 180 / Math.PI);
      //let rotMatrix = new Matrix4();
      //rotMatrix.setRotate(angle, icosas[i].pitchAxisVector.elements[0],icosas[i].pitchAxisVector.elements[1],icosas[i].pitchAxisVector.elements[2]);

      //console.log(angle * 180 / Math.PI);
      //console.log(icosas[i].cameraVectorXYZ);
      //console.log(icosas[i].pitchAxisVector);
      // icosas[i].setLastCamVectorXZ();

      /*
      next steps: 
        - find the vector orthogonal to the camera vector. This is:
          icosas[i].findCamOrthoVector(); 
        - find the vector orthogonal to the camOrthoVector and cam Vector. Use cross product. 
          icosas[i].findPitchAxisVector();
          
      */
    }

    
    scene2.add(icosas[0].mesh);
    scene2.add(icosas[1].mesh);
    scene2.add(icosas[2].mesh);
    scene2.add(icosas[3].mesh);

    const cylTexture = loader.load('../resources/rusty_metal.jpg');
    const cylGeometry = new THREE.CylinderGeometry(  0.5, 0.5, 4, 3 );
    const cylMaterial = new THREE.MeshBasicMaterial({ map: cylTexture, color: 0x7A2E2E });
    const cylMesh0 = new THREE.Mesh(cylGeometry, cylMaterial);
    scene0.add(cylMesh0);

    const cylMesh2 = cylMesh0.clone();
    scene2.add(cylMesh2);
  }


  function addLights() {
    //point light
    //const color = 0xFFFF22;
    //SCENE0
    let lightColor;
    let color = 0xFFFF00;
    let intensity = 100000;
    const light0 = new THREE.PointLight(color, intensity);
    light0.position.set(0,50,0);
    particleLight0[0] = new THREE.PointLight(color, intensity);

    scene0.add(light0);
    scene0.add(particleLight0[0]);

    const light2 = light0.clone();
    particleLight2[0] = particleLight0[0].clone();

    const spotLightColor = 0xffffff;
    const spotLightInt = 50000;
    spotLight0 = new THREE.SpotLight(spotLightColor, spotLightInt);
    spotLight0.angle = Math.PI / 8;
    spotLight0.penumbra = 0.3;
    spotLight0.distance = 2000;
    spotLight0.decay = 1.5;
    scene0.add(spotLight0);
    scene0.add(spotLight0.target);

    spotLight2 = new THREE.SpotLight(spotLightColor, spotLightInt);
    spotLight2.angle = Math.PI / 8;
    spotLight2.penumbra = 0.3;
    spotLight2.distance = 2000;
    spotLight2.decay = 1.5;
    scene2.add(spotLight2);
    scene2.add(spotLight2.target);

    scene2.add(light2);
    scene2.add(particleLight2[0]);

    //SCENE1
    color = 0xFFFFFF;
    intensity = 0.1; 
    const ambient1 = new THREE.AmbientLight(color, intensity);
    scene1.add(ambient1);

    //this ambient sets for testing purposes only
    //const ambient2Tmp = ambient1.clone();
    //ambient2Tmp.intensity = 1;
    //scene2.add(ambient2Tmp);

    let i = 0
    //for lights on right wall
    for (; i < 3; i++) {
      lightColor = new THREE.Color(1, 1, 1);
      intensity = Math.random() * 40000 + 10000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = 500;
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = Math.floor(Math.random() * 1000 - 500);
      scene1.add(portalLights[i]);
    }

    //for lights on front wall
    for (; i < 6; i++) {
      lightColor = new THREE.Color(1, 1, 1);
      intensity = Math.random() * 40000 + 10000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = -500;
      scene1.add(portalLights[i]);
    }

    //for lights on left wall
    for (; i < 9; i++) {
      lightColor = new THREE.Color(1, 1, 1); //Math.random(), Math.random(), Math.random()
      intensity = Math.random() * 40000 + 10000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = -500;
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = Math.floor(Math.random() * 1000 - 500);
      scene1.add(portalLights[i]);
    }

    //for lights on back wall
    for (; i < 12; i++) {
      lightColor = new THREE.Color(1, 1, 1);
      intensity = Math.random() * 40000 + 10000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = 500;
      scene1.add(portalLights[i]);
    }    
    
  }

  //RESIZE RENDERER TO DISPLAY SIZE FUNCTION
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // code from CSE 160 helper videos
  function sendTextToHTML(text, htmlID) {
    var hmtlElm = document.getElementById(htmlID);
    if (!hmtlElm) {
      console.log("Failed to get " + htmlID + "from HTML");
      return;
    }
    hmtlElm.innerHTML = text;
  }

  function findQuadrant(lookDir) {
    //Vector3.cross(crossForAngleDir, icosas[i].originVectorXZ, icosas[i].cameraVectorXZ);
    lookDirXZ.set(lookDir.x, 0, lookDir.z);

    up1.crossVectors(plusPlusVec, lookDirXZ);
    up2.crossVectors(plusMinusVec, lookDirXZ);
    if (0 < up1.y && up2.y < 0) { // if on wall 0
      return 0;
    }
    up1.crossVectors(minusMinusVec, lookDirXZ);
    if (0 < up2.y && up1.y < 0) { //if on wall 1
      return 1;
    }
    up2.crossVectors(minusPlusVec, lookDirXZ);
    if (0 < up1.y && up2.y < 0) { //if on wall 2
      return 2;
    }
    else { //if on wall3
      return 3;
    } 
  }

  //RENDER FUNCTION
  function render(time) {
    //seconds = performance.now() / 1000.0 - startTime;
    let startTime = performance.now();

    const delta = (time - lastTime) * 0.001;
    lastTime = time;

    //let startTime = time;
    time *= 0.001;

    //console.log("time: " + time);
    //console.log("performance.now(): " + performance.now() * .001);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }      

    if (orbitControls.enabled) {
      orbitControls.update();
    }
    else if (!orbitControls.enabled && pointerControls.isLocked) {
      if (keysDown.has('KeyW')) pointerControls.moveForward(moveSpeed * delta);
      if (keysDown.has('KeyS')) pointerControls.moveForward(-moveSpeed * delta);
      if (keysDown.has('KeyA')) pointerControls.moveRight(-moveSpeed * delta);
      if (keysDown.has('KeyD')) pointerControls.moveRight(moveSpeed * delta);
    }

    // rotate hovering spiky object on y- and x-axis
    //if (object) {
    //  object.rotation.y = time / 4;
    //  object.rotation.x = time / 4;
    //} 
    //const trigger = ((time * 1000) % 50000) - 25000;
    const trigger = -2;

    //let y = ((time * 1000) % 50000) - 25000;
    if (trigger < -1 && !entered) {
        //console.log("scene 2 entered")
        currentTime = time;
        renderScene2();
        renderer.render(scene2, camera);
    }
    else {
      if (!paused) {
        stoppedTime = time;
        paused = true;
      }
      if (!exit) {
        renderScene1();
        renderer.render(scene1, camera);
        entered = true;
      }
      else {
        if (!offset) {
          offsetTime = time - stoppedTime;
          offset = true;
        }
        currentTime = time - offsetTime;  
        renderScene2();
        renderer.render(scene2, camera);
      }
    }
    //renderer.render(scene2, camera);

    //time *= 1000;
    let duration = performance.now() - startTime;
    //let duration = time - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + "    fps: " + Math.floor(10000/duration)/10, "numdot");

    requestAnimationFrame(render);

    function renderScene0() {
        let flag12 = 0;

        //incorporate particles falling
        const y = ((currentTime * 1000) % 50000) - 25000;
        //const y = 0;
        if (particles[0]) {
          particles[0].position.set(0, y, 0);
          particleLight0[0].position.set(0, y, 0);
          particles[0].rotation.y = currentTime / 2;
          particles[0].rotation.x = currentTime / 2;
        }
        //time *= 0.001;
        //console.log("In Render0: time: " + time);
    
        //console.log(time % 12);
        if (currentTime % 12) {
          if (flag12)
            flag12 = 0;
          else 
            flag12 = 1;
        }
        //rotate central column blocks on y-axis
        for (let i = 0; i < objects.length; i++) {
          let spin = (-1) ** i;
          objects[i].rotation.y = spin * currentTime / 12;
          if (flag12 && ((currentTime % 12 < 0.5) || (currentTime % 8 < 0.5))) {
            objects[i].position.x = Math.random() * 6 - 3;
            objects[i].position.y = Math.random() * 6 - 3;
            objects[i].position.z = Math.random() * 6 - 3;
          }
          else {
            objects[i].position.x = 0;
            objects[i].position.y = 0;
            objects[i].position.z = 0;
          }

          //objects[i].position.x = 3 * Math.sin(spin * time / 4);
        }

        if (spotLightOn) {
          camera.getWorldDirection(lookDir);
          spotLight0.position.copy(camera.position);
          targetPos.copy(camera.position).add(lookDir.multiplyScalar(100));
          spotLight0.target.position.copy(targetPos);
          spotLight0.visible = true;
        }
        else {
          spotLight0.visible = false;
        }        
      }

      function renderScene1() {
        let y = 0;
        //portalLights[0].position.set(500, y, 0);

        for (let i = 0; i < portalLights.length; i++) {
          y = (((time + portalLightPositionsY[i]) * 1000) % 10000) - 5000;
          portalLights[i].position.set(portalLightPositionsX[i], y, portalLightPositionsZ[i]);
        }

        scene1Tex.offset.y += 0.0001;
        if (particles[1]) {
          particles[1].scale.set(2, 2, 2);  
          particles[1].position.set(0, 0, 0);
          particles[1].rotation.y = time / 8;
          particles[1].rotation.x = time / 8;
          if ((time % 12 < 0.3)) {
            //scene1Tex.offset.y += time;
            particles[1].position.x = Math.random() * 8 - 2;
            particles[1].position.y = Math.random() * 8 - 2;
            particles[1].position.z = Math.random() * 8 - 2;
          }
          else {
            //scene1Tex.offset.y += 0.0001;
            particles[1].position.x = 0;
            particles[1].position.y = 0;
            particles[1].position.z = 0;
          }
        }
      }

      function renderScene2() {
        const y = ((currentTime * 1000) % 50000) - 24999;
        //console.log(y + 100);
        if (25000 < (y + 100)) {
          risen = true;
        }
        if (!risen) {
          if (particles[2]) {
            particles[2].position.set(0, y, 0);
            particleLight2[0].position.set(0, y, 0);
            particles[2].rotation.y = currentTime / 2;
            particles[2].rotation.x = currentTime / 2;
          }
        }
        else {
            particles[2].scale.set(0, 0, 0);
            particleLight2[0].color.set(0x000000);
        }
    
        //rotate central column blocks on y-axis
        for (let i = 2; i < objects.length; i++) {
            let spin = (-1) ** i;
            objects[i].rotation.y = spin * currentTime / 12;
        }
        //portal.cube02.rotation.y = currentTime / 12;
        //portal.cube12.rotation.y = -1 * currentTime / 12;

        camera.getWorldDirection(lookDir);
        //console.log(camera.position.x);
        if (spotLightOn) {
          //console.log(lookDir.x);
          //console.log(lookDir);
          spotLight2.position.copy(camera.position);
          targetPos.copy(camera.position).add(lookDir.clone().multiplyScalar(100));
          spotLight2.target.position.copy(targetPos);
          spotLight2.visible = true;

          /*
          quadNum = findQuadrant(lookDir);
          if (quadNum === 0) {
            aCosTheta = Vector3.dotThree(lookDir, icosas[0].cameraVectorXYZ.mul(-1));
            angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) );    
            if (angle < spotAngleLimit) {
              isoca0Trigger = true;
            }
            else {
              if (isoca0returned) {
                isoca0Trigger = false;
              }
            }
          }
          */
         /*
          for (let i = 0; i < 4; i++) {
            aCosTheta = Vector3.dotThree(lookDir, icosas[i].cameraVectorXYZ.mul(-1));
            angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) );    
            if (angle < spotAngleLimit) {
              icosas[i].hide = true;
              icosas[i].hold = true;
              //console.log(i + ": " + icosas[i].retreat);
            }
            // if the camera vector is greater than 90 degrees from the vector to the isocahedron
            if (icosas[i].hide && Math.PI / 2 < angle) {
              icosas[i].hold = false;
            }
          } */
        }
        else {
          spotLight2.visible = false;
        }

        for (let i = 0; i < 4; i++ ) {
            icosas[i].rotationY = i * Math.PI / 2;  //setRotationY(0, i * Math.PI / 2, 0);
            //icosas[i].lastCamVectorXZ.setElements([0 - icosas[i].positionX, 0, 0 - icosas[i].positionZ]).normalize();
            icosas[i].findCameraVectorXZ(camera.position.x, camera.position.z);
      
            aCosTheta = Vector3.dot(icosas[i].cameraVectorXZ, icosas[i].originVectorXZ);
            angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) );

            Vector3.cross(crossForAngleDir, icosas[i].originVectorXZ, icosas[i].cameraVectorXZ);
            if (crossForAngleDir.y < 0) {
                angle *= -1;
            } 
            icosas[i].setRotationY(angle);     
            //console.log(icosas[i].rotationX, icosas[i].rotationY + angle, icosas[i].rotationZ);
            //icosas[i].setLastCamVectorXZ(); 

            
            icosas[i].findPitchAxisVector();
            //if (time < 3) {
            //  console.log(icosas[i].pitchAxisVector); //axis are correct
            //}
            icosas[i].findCameraVectorXYZ(camera.position.x, camera.position.y, camera.position.z);
            aCosTheta = Vector3.dot(icosas[i].cameraVectorXZ, icosas[i].cameraVectorXYZ);
            angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) );
            //if (time < 3) {
            //  console.log(i + ": " + (angle * 180 / Math.PI)); //axis are correct
            //}
            icosas[i].setRotationPitch(angle);  

            //this next chunk determines when the isocahedron retreats
            aCosTheta = Vector3.dotThree(lookDir, icosas[i].cameraVectorXYZ.mul(-1));
            angle = Math.acos( Math.max(-1, Math.min(1, aCosTheta)) ); 
            if (spotLightOn) {   
              if (angle < spotAngleLimit) {
                icosas[i].hide = true;
                icosas[i].hold = true;
                //icosas[i].shaken = false;
                //console.log(i + ": " + icosas[i].retreat);
              }
            }
            // if the camera vector is greater than 90 degrees from the vector to the isocahedron
            if ( icosas[i].hide && ((Math.PI * 3 / 8) < angle) ) {
              icosas[i].hold = false;
            }
            //console.log(time);
            // console.log(angle * 180 / Math.PI);
            if (i === 0) {
              if (icosas[0].hide) {
                if (!icosas[0].shaken) {
                  //console.log("beginning " + icosas[0].shaken);
                  icosas[0].shake(currentTime, i);
                }
                else {
                  // initialize the retreat into the wall
                  if (icosas[0].positionX === 400) {
                    icosas[0].retreat = true;
                  }
                  // icosahedron retreats into the wall until 650 reached
                 if (icosas[0].retreat) {
                    icosas[0].setPosition(icosas[0].positionX + 4, icosas[0].positionY, 0);
                    //Rotate the icosahedron as it retreats
                    icosas[0].retreatAngle += Math.PI / 70;
                    icosas[0].setRotationY(icosas[0].retreatAngle);
                    if (icosas[0].positionX === 680) {
                      icosas[0].retreat = false;
                    }
                  }
                  // 
                  else {
                    if (icosas[0].hold === false) {
                      icosas[0].release = true;
                    }
                    if (icosas[0].release) {
                      icosas[0].setPosition(icosas[0].positionX - 4, icosas[0].positionY, 0);
                      if (icosas[0].positionX === 400) {
                        icosas[0].release = false;
                        icosas[0].hide = false;
                        icosas[0].shaken = false;
                        icosas[0].retreatAngle = 0;
                        //console.log("ending " + icosas[0].shaken);
                      }
                    }
                  } // end inner if-else
                } // end outer if-else
              } // end if (icosas[0].hide)
            } //end if (i === 0)

            else if (i === 1) {
              if (icosas[1].hide) {
                if (!icosas[1].shaken) {
                  //console.log("beginning " + icosas[0].shaken);
                  icosas[1].shake(currentTime, i);
                }
                else {
                  // initialize the retreat into the wall
                  if (icosas[1].positionZ === -400) {
                    icosas[1].retreat = true;
                  }
                  // icosahedron retreats into the wall until 650 reached
                  if (icosas[1].retreat) {
                    icosas[1].setPosition(0, icosas[1].positionY, icosas[1].positionZ - 4);
                    //Rotate the icosahedron as it retreats
                    icosas[1].retreatAngle -= Math.PI / 70;
                    icosas[1].setRotationY(icosas[1].retreatAngle);
                    if (icosas[1].positionZ === -680) {
                      icosas[1].retreat = false;
                    }
                  }
                  // 
                  else {
                    if (icosas[1].hold === false) {
                      icosas[1].release = true;
                    }
                    if (icosas[1].release) {
                      icosas[1].setPosition(0, icosas[1].positionY, icosas[1].positionZ + 4);
                      if (icosas[1].positionZ === -400) {
                        icosas[1].release = false;
                        icosas[1].hide = false;
                        icosas[1].shaken = false;
                        icosas[1].retreatAngle = 0;
                      }
                    }
                  }
                }
              } // end if (icosas[1].hide)
            } //end if (i === 1)

            else if (i === 2) {
              if (icosas[2].hide) {
                if (!icosas[2].shaken) {
                  //console.log("beginning " + icosas[0].shaken);
                  icosas[2].shake(currentTime, i);
                }
                else {
                  // initialize the retreat into the wall
                  if (icosas[2].positionX === -400) {
                    icosas[2].retreat = true;
                  }
                  // icosahedron retreats into the wall until 650 reached
                  if (icosas[2].retreat) {
                    icosas[2].setPosition(icosas[2].positionX - 4, icosas[2].positionY, 0);
                    //Rotate the icosahedron as it retreats
                    icosas[2].retreatAngle += Math.PI / 70;
                    icosas[2].setRotationY(icosas[2].retreatAngle);
                    if (icosas[2].positionX === -680) {
                      icosas[2].retreat = false;
                    }
                  }
                  // 
                  else {
                    if (icosas[2].hold === false) {
                      icosas[2].release = true;
                    }
                    if (icosas[2].release) {
                      icosas[2].setPosition(icosas[2].positionX + 4, icosas[2].positionY, 0);
                      if (icosas[2].positionX === -400) {
                        icosas[2].release = false;
                        icosas[2].hide = false;
                        icosas[2].shaken = false;
                        icosas[2].retreatAngle = 0;
                      }
                    }
                  }
                }
              } // end if (icosas[2].hide)
            } //end if (i === 2)

            else { //(i === 3)
              if (icosas[3].hide) {
                if (!icosas[3].shaken) {
                  //console.log("beginning " + icosas[0].shaken);
                  icosas[3].shake(currentTime, i);
                }
                else {
                  // initialize the retreat into the wall
                  if (icosas[3].positionZ === 400) {
                    icosas[3].retreat = true;
                  }
                  // icosahedron retreats into the wall until 650 reached
                  if (icosas[3].retreat) {
                    icosas[3].setPosition(0, icosas[3].positionY, icosas[3].positionZ + 4);
                    //Rotate the icosahedron as it retreats
                    icosas[3].retreatAngle -= Math.PI / 70;
                    icosas[3].setRotationY(icosas[3].retreatAngle);
                    if (icosas[3].positionZ === 680) {
                      icosas[3].retreat = false;
                    }
                  }
                  // 
                  else {
                    if (icosas[3].hold === false) {
                      icosas[3].release = true;
                    }
                    if (icosas[3].release) {
                      icosas[3].setPosition(0, icosas[3].positionY, icosas[3].positionZ - 4);
                      if (icosas[3].positionZ === 400) {
                        icosas[3].release = false;
                        icosas[3].hide = false;
                        icosas[3].shaken = false;
                        icosas[3].retreatAngle = 0;
                      }
                    }
                  }
                }
              } // end if (icosas[2].hide)
            } //end if (i === 3)
            
        }
            //icosas[i].setRotation(icosas[i].rotationX, icosas[i].rotationY, icosas[i].rotationZ);
        //}
      }

      //function moveIsocas
  } //end render(time) FUNCTION


}
main();