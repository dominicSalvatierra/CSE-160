import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import AxisGridHelper from './Classes/AxisGridHelper.js';

function main () {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  const gui = new GUI();

  //CAMERA
  //set-up
  const fov = 40; 
  const aspect = 2; 
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); 
  //camera.position.z = 120;
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);
 
  //SCENE
  const scene = new THREE.Scene();
  const objects = [];
  const spread = 15;

  addShapes();
  // add an AxesHelper to each node
  /*
  objects.forEach((node) => {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    node.add(axes);
  }); */
  addLights();
  requestAnimationFrame(render);

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
  }

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
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6; 
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    //objects[0]
    const solarSystem = new THREE.Object3D();
    solarSystem.scale.set(1.5,1.5,1.5);
    scene.add(solarSystem);
    objects.push(solarSystem);

    //objects[1]
    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5,5,5);
    //scene.add(sunMesh);
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    //objects[2]
    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    //objects[3]
    const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    //earthMesh.position.x = 12;
    //scene.add(earthMesh);
    //sunMesh.add(earthMesh);
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    //objects[4]
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);
    objects.push(moonOrbit);

    //objects[5]
    const moonMaterial = new THREE.MeshPhongMaterial({color: 0x555555, emissive: 0x222222});
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.4,0.4,0.4);
    //scene.add(earthMesh);
    //sunMesh.add(earthMesh);
    moonOrbit.add(moonMesh);
    objects.push(earthMesh);

    makeAxisGrid(solarSystem, 'solarSystem', 25);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthOrbit, 'earthOrbit');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    makeAxisGrid(moonMesh, 'moonMesh');
  }

  function addLights() {
    //point light
    const color = 0xFFFF00;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
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

    //cubes.forEach( (cube, ndx ) => {
    //  const speed = 1 + ndx * 0.1;
    //  const rot = time * speed;
    //  cube.rotation.x = rot;
    //  cube.rotation.y = rot;
    //});
    
    objects.forEach((obj) => {
        //console.log(time);
        obj.rotation.y = time;
    });

    //objects[0].rotation.y = time / 2;
    //objects[2].rotation.y = time / 2;
    //objects[4].rotation.y = time / 8;

    renderer.render(scene, camera);

    //time *= 1000;
    let duration = performance.now() - startTime;
    //let duration = time - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + "    fps: " + Math.floor(10000/duration)/10, "numdot");

    requestAnimationFrame(render);
  }
}
main();