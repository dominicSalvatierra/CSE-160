import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
//import Pyramid from './Shapes/Pyramid.js'
import * as Pyramid from './Shapes/createPyramidGeometry.js';


function main () {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
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
  const moveSpeed = 10;
  let lastTime = 0;
  let entered = false;
  let stoppedTime = 0;
  let offsetTime = 0;
  let currentTime = 0;
  let paused = false;
  let offset = false;

  camera.position.set(0, 1, 40);
  camera.up.set(0, 1.5, 0);
  camera.lookAt(0, 1.5, -1000);
  //orbitControls.update();

  orbitControls.target.set(0, 0, 0);
  switchToOrbit();
 
  //SCENE
  const scene0 = new THREE.Scene();
  const scene1 = new THREE.Scene();
  let objects = [];
  let particles = [];
  let particleLight = [];
  let portalLights = [];
  let portalLightPositionsX = [];
  let portalLightPositionsY = [];
  let portalLightPositionsZ = [];
  //let object;
  let scene1Tex;
  let exit = false;

  //console.log(19.99 % 10);
  
  

  addActionsForHtmlUI();
  addSkyBox();
  addLattice();
  addObjects();
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

    const geometry0 = new THREE.BoxGeometry( 1000, 50000, 1000 );
    const skyBox0 = new THREE.Mesh( geometry0, materials );
    scene0.add( skyBox0 );    

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
    }

    // to front wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material1);
      mesh.position.set(0, -2, -step);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);
    }

    // to left wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material2);
      mesh.position.set(-step, -2, 0);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);
    }

    // to back wall
    for (let step = 16; step < 500; step += 4) {
      const mesh = new THREE.Mesh(geometry, material3);
      mesh.position.set(0, -2, step);
      mesh.scale.set(2, 2, 2);
      scene0.add(mesh);
    }
  }

  //0x882222
  //0x918267
  //0x4E5F68
  //0x999990
  function addObjects() {
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
    //cube1.scale.set(10,10,10);

    const cube2 = new THREE.Mesh( geometry, materials );
    cube2.scale.set(10,10,10)
    cube2.rotation.y =  - Math.PI / 2;
    //cube2.position.set(0,-6,0);

    objects.push(cube0);
    //objects.push(cube1);
    objects.push(cube2);
    scene0.add( cube0 );  
    //scene.add( cube1 );  
    scene0.add( cube2 );  


    // add obj loaded "mainframe"
    const objLoader = new OBJLoader();
    /*objLoader.load('./Shapes/Mainframe.obj', (root) => {
      root.position.y = 300;
      root.scale.set(30,30,30);
      object = root;

      root.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(0x1010FF);
        }
      }); 
      //scene.add(root);
    }); */

    /*
    for (let i = 0; i < 2; i++ ) {
      objLoader.load('./Shapes/Mainframe.obj', (root) => {
        root.scale.set(50,50,50);
        root.position.y = 10;
        //root.position.x = i * 10 - 30;
        particles[i] = root;
  
        root.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x1010FF,
              emissive: 0x555022,
              emissiveIntensity: 0.0,
            });
          }
        });
      });
      scene0.add(particles[1]);
    }
    scene1.add(particles[1]);
    */
    objLoader.load('./Shapes/Mainframe.obj', (root) => {
      root.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            color: 0x1010FF,
            emissive: 0x555022,
            emissiveIntensity: 0.05,
          });
        }
      });        
      let root1 = root.clone(true);
      //const particle1Tex = loader.load('../resources/stars0.jpg');
      //particle1Tex.colorSpace = THREE.SRGBColorSpace;

      root1.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            //map: particle1Tex,
            //side: THREE.FrontSide,
            color: 0x050000,
            //emissive: 0x555022,
            //emissiveIntensity: 0.0,
          });
        }
      }); 

      particles[0] = root;
      particles[1] = root1;

      particles[0].scale.set(50, 50, 50);
      particles[1].scale.set(50, 50, 50);

      scene0.add(particles[0]);
      scene1.add(particles[1]);
    });
  }


  function addLights() {
    //point light
    //const color = 0xFFFF22;
    //SCENE0
    let lightColor;
    let color = 0xFFFF00;
    let intensity = 100000;
    const light1 = new THREE.PointLight(color, intensity);
    light1.position.set(0,50,0);

    particleLight[0] = new THREE.PointLight(color, intensity);
    scene0.add(light1);
    scene0.add(particleLight[0]);

    //SCENE1
    //color = 0xFFFFFF;
    //intensity = 0; 
    //const ambient1 = new THREE.AmbientLight(color, intensity);
    //scene1.add(ambient1);

    let i = 0
    //for lights on right wall
    for (; i < 12; i++) {
      lightColor = new THREE.Color(1,1,1);
      intensity = Math.random() * 10000 + 90000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = 500;
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = Math.floor(Math.random() * 1000 - 500);
      scene1.add(portalLights[i]);
    }

    //for lights on front wall
    for (; i < 24; i++) {
      lightColor = new THREE.Color(1,1,1);
      intensity = Math.random() * 10000 + 90000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = -500;
      scene1.add(portalLights[i]);
    }

    //for lights on left wall
    for (; i < 36; i++) {
      lightColor = new THREE.Color(1,1,1); //Math.random(), Math.random(), Math.random()
      intensity = Math.random() * 10000 + 90000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = -500;
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = Math.floor(Math.random() * 1000 - 500);
      scene1.add(portalLights[i]);
    }

    //for lights on back wall
    for (; i < 48; i++) {
      lightColor = new THREE.Color(1,1,1);
      intensity = Math.random() * 10000 + 90000;
      portalLights[i] = new THREE.PointLight(lightColor, intensity);
      portalLightPositionsX[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsY[i] = Math.floor(Math.random() * 1000 - 500);
      portalLightPositionsZ[i] = 500;
      scene1.add(portalLights[i]);
    }    
    

    //console.log(portalLightPositions);

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
    const trigger = ((time * 1000) % 50000) - 25000;
    //const trigger = 0;

    //let y = ((time * 1000) % 50000) - 25000;
    if (trigger < -1 && !entered) {
        currentTime = time;
        renderScene0();
        renderer.render(scene0, camera);
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
        renderScene0();
        renderer.render(scene0, camera);
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
        if (particles[0]) {
          particles[0].position.set(0, y, 0);
          particleLight[0].position.set(0, y, 0);
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
            objects[i].position.x = Math.random() * 6 - 2;
            objects[i].position.y = Math.random() * 6 - 2;
            objects[i].position.z = Math.random() * 6 - 2;
          }
          else {
            objects[i].position.x = 0;
            objects[i].position.y = 0;
            objects[i].position.z = 0;
          }
          //objects[i].position.x = 3 * Math.sin(spin * time / 4);
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
        }
      }
  } //end render(time) FUNCTION
}
main();