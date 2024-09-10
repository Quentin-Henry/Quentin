import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
let divWindow = document.getElementById("contentBoxC");

renderer.setSize(300, 300);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);

divWindow.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 40;
controls.maxDistance = 100;
controls.minPolarAngel = 0.5;
controls.maxPolarAngel = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const light = new THREE.AmbientLight(0xfff000);
light.intensity = 1;
scene.add(light);

new THREE.PMREMGenerator(renderer).fromScene(scene).texture;

const loader = new GLTFLoader().setPath("model/");
loader.load("CalatravaBottleOpener5.glb", (glb) => {
  const mesh = glb.scene;
  mesh.position.set(0, 0, 0);
  scene.add(mesh);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
