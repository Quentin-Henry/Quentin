import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let divWindow = document.getElementById("contentG");
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

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
controls.minDistance = 1;
controls.maxDistance = 20;
controls.minPolarAngel = 0.5;
controls.maxPolarAngel = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const loader = new GLTFLoader().setPath("model/");
loader.load("WebTest2.gltf", (gltf) => {
  const mesh = gltf.scene;
  mesh.position.set(0, 0, 0);
  scene.add(mesh);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
