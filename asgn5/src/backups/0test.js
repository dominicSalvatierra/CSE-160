import * as THREE from 'three';

function main () {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  //CAMERA
  //set-up
  const fov = 40; 
  const aspect = 2; 
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); 
  camera.position.z = 120;

  //SCENE
  const scene = new THREE.Scene();
  const objects = [];
  const spread = 15;

  //GEOMETRY
  //const boxWidth = 1;
  //const boxHeight = 1;
  //const boxDepth = 1;
  //const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  //LIGHTING 
  //Make array for cubes
  //const cubes = [
  //  makeInstance(geometry, 0x8844aa, -2),
  //  makeInstance(geometry, 0x44aa88, 0),
  //  makeInstance(geometry, 0xaa8844, 2),
  //];
  addShapes();
  addLights();

  //renderer.render(scene, camera);
  requestAnimationFrame(render);


  //INSTANCE FUNCTION for a cube mesh
  //function makeInstance(geometry, color, x) {
  //  const material = new THREE.MeshPhongMaterial({color});
  //  const cube = new THREE.Mesh(geometry, material);
  //  cube.position.x = x;

  //  scene.add(cube);
  //  return cube;
  //}

  function createMaterial() {
    const material= new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x,y,mesh);
  }

  function addShapes() {
    //const width = 8;
    //const height = 8;
    //const depth = 8;
    //addSolidGeometry(-2, -2, new THREE.BoxGeometry(width, height, depth));
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6; 
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5,5,5);
    scene.add(sunMesh);
    objects.push(sunMesh);
  }

  function addLights() {
      //Directional
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1,2,4);
    scene.add(light);
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
    //let startTime = time;
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }      

    cubes.forEach( (cube, ndx ) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    //time *= 1000;
    let duration = performance.now() - startTime;
    //let duration = time - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + "    fps: " + Math.floor(10000/duration)/10, "numdot");

    requestAnimationFrame(render);
  }
}
main();