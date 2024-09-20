import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 2 / window.innerHeight,
  0.1,
  1000
);
const camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 2 / window.innerHeight,
  0.1,
  1000
);
const renderer1 = new THREE.WebGLRenderer({ alpha: true });
const renderer2 = new THREE.WebGLRenderer({ alpha: true });

// Append the canvas to the div
document.getElementById("model1").appendChild(renderer1.domElement);
document.getElementById("model2").appendChild(renderer2.domElement);

// Load GLTF Models
const loader1 = new GLTFLoader();
loader1.load(
  "model/CalatravaPen3.gltf",
  (gltf) => {
    scene1.add(gltf.scene);
    gltf.scene.position.set(0, -1, 0);
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
    gltf.scene.position.set(0, -1, 0);
    animate2();
  },
  undefined,
  (error) => console.error(error)
);

// Add Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene1.add(ambientLight);
scene2.add(ambientLight);

// Add Spotlights
const spotlight1 = new THREE.SpotLight(0xffffff);
spotlight1.position.set(5, 5, 5);
spotlight1.castShadow = true;
scene1.add(spotlight1);

const spotlight2 = new THREE.SpotLight(0xffffff, 1);
spotlight2.position.set(5, 5, 5);
spotlight2.castShadow = true;
scene2.add(spotlight2);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 10); // White light
directionalLight1.position.set(5, 10, 7); // Position above and to the side
scene1.add(directionalLight1);

// Add Directional Light for Model 2
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(5, 10, 7);
scene2.add(directionalLight2);

// Set up Orbit Controls with zoom limits
const controls1 = new OrbitControls(camera1, renderer1.domElement);
controls1.minDistance = 100; // Minimum zoom distance
controls1.maxDistance = 110; // Maximum zoom distance

const controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.minDistance = 90; // Minimum zoom distance
controls2.maxDistance = 100; // Maximum zoom distance

// Animation for Model 1
function animate1() {
  requestAnimationFrame(animate1);
  controls1.update();
  renderer1.render(scene1, camera1);
}

// Animation for Model 2
function animate2() {
  requestAnimationFrame(animate2);
  controls2.update();
  renderer2.render(scene2, camera2);
}

// Set initial camera positions
camera1.position.z = 3;
camera2.position.z = 3;

// Handle window resize
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera1.aspect = width / height;
    camera1.updateProjectionMatrix();
    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
  }
  return needResize;
}

function animate() {
  requestAnimationFrame(animate);
  if (resizeRendererToDisplaySize(renderer1)) {
    // Update camera aspect ratio on resize
  }
  if (resizeRendererToDisplaySize(renderer2)) {
    // Update camera aspect ratio on resize
  }
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
}

animate();
