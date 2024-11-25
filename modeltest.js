import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

// Set pure white backgrounds
scene1.background = new THREE.Color(0xffffff);
scene2.background = new THREE.Color(0xffffff);

// HDRI Loading - only for environment, not background
const hdriLoader = new RGBELoader();
hdriLoader.load("model/studio_small_08_1k.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene1.environment = texture;
  scene2.environment = texture;
});

// Set up cameras with correct aspect ratio
const camera1 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

// Set up renderers with proper size and settings
const renderer1 = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
const renderer2 = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

// Enable physically correct lighting and tone mapping
renderer1.physicallyCorrectLights = true;
renderer2.physicallyCorrectLights = true;
renderer1.toneMapping = THREE.ACESFilmicToneMapping;
renderer2.toneMapping = THREE.ACESFilmicToneMapping;
renderer1.toneMappingExposure = 1.5; // Increased exposure
renderer2.toneMappingExposure = 1.5;
renderer1.outputEncoding = THREE.sRGBEncoding;
renderer2.outputEncoding = THREE.sRGBEncoding;

// Get container elements
const container1 = document.getElementById("model1");
const container2 = document.getElementById("model2");

// Set initial renderer sizes based on container
renderer1.setSize(container1.clientWidth, container1.clientHeight);
renderer2.setSize(container2.clientWidth, container2.clientHeight);

container1.appendChild(renderer1.domElement);
container2.appendChild(renderer2.domElement);

// Enhanced lighting setup for better visibility with white background
function createLights(scene) {
  // Ambient light for base illumination
  const ambient = new THREE.AmbientLight(0xffffff, 1.5); // Increased intensity
  scene.add(ambient);

  // Key light
  const keyLight = new THREE.DirectionalLight(0xffffff, 2); // Increased intensity
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  // Back light
  const backLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
  backLight.position.set(0, 5, -10);
  scene.add(backLight);

  // Additional rim light for better separation from white background
  const rimLight = new THREE.DirectionalLight(0xffffff, 1);
  rimLight.position.set(0, -5, -10);
  scene.add(rimLight);
}

createLights(scene1);
createLights(scene2);

// Load models
const loader1 = new GLTFLoader();
loader1.load(
  "model/calatravaPen3.gltf",
  (gltf) => {
    scene1.add(gltf.scene);
    gltf.scene.position.set(0, 25, 0);
    gltf.scene.rotation.x = 7.8;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera1.position.set(
      center.x,
      center.y + maxDim * 0.5,
      center.z + maxDim * 1.5
    );
    camera1.lookAt(center);

    animate1();
  },
  undefined,
  (error) => console.error(error)
);

const loader2 = new GLTFLoader();
loader2.load(
  "model/untitled.gltf",
  (gltf) => {
    scene2.add(gltf.scene);
    gltf.scene.position.set(0, 30, 0);
    gltf.scene.rotation.x = 0.5;
    gltf.scene.rotation.z = -0.5;
    gltf.scene.rotation.y = 0.2;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera2.position.set(
      center.x,
      center.y + maxDim * 0.5,
      center.z + maxDim * 1.5
    );
    camera2.lookAt(center);

    animate2();
  },
  undefined,
  (error) => console.error(error)
);

// Controls with increased polar angle range
const controls1 = new OrbitControls(camera1, renderer1.domElement);
controls1.minDistance = 50;
controls1.maxDistance = 200;
controls1.minPolarAngle = 0; // Allow full vertical rotation
controls1.maxPolarAngle = Math.PI; // Allow full vertical rotation
controls1.autoRotate = true;
controls1.enablePan = false;
controls1.autoRotateSpeed = 2.0; // Slightly faster rotation

const controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.minDistance = 50;
controls2.maxDistance = 200;
controls2.minPolarAngle = 0; // Allow full vertical rotation
controls2.maxPolarAngle = Math.PI; // Allow full vertical rotation
controls2.autoRotate = true;
controls2.enablePan = false;
controls2.autoRotateSpeed = 2.0;

function onWindowResize() {
  const width1 = container1.clientWidth;
  const height1 = container1.clientHeight;
  renderer1.setSize(width1, height1);
  camera1.aspect = width1 / height1;
  camera1.updateProjectionMatrix();

  const width2 = container2.clientWidth;
  const height2 = container2.clientHeight;
  renderer2.setSize(width2, height2);
  camera2.aspect = width2 / height2;
  camera2.updateProjectionMatrix();
}

window.addEventListener("resize", onWindowResize);

function animate1() {
  requestAnimationFrame(animate1);
  controls1.update();
  renderer1.render(scene1, camera1);
}

function animate2() {
  requestAnimationFrame(animate2);
  controls2.update();
  renderer2.render(scene2, camera2);
}

onWindowResize();
