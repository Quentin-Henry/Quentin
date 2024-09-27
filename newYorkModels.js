import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 2 / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
const container = document.getElementById("modelB1");
container.appendChild(renderer.domElement);

// Resize the renderer to fill the container
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;

  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

const loader = new GLTFLoader();
loader.load(
  "model/StreetCorner.glb",
  (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0); // Adjust position based on model
    gltf.scene.scale.set(1, 1, 1); // Adjust scale if necessary
    animate(); // Start animation after the model is loaded
  },
  undefined,
  (error) => console.error(error)
);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1; // Adjust based on your model size
controls.maxDistance = 4; // Adjust based on your model size

controls.autoRotate = true;

// Set initial camera position
camera.position.set(0, 7, 10); // Adjust as necessary based on model size

function animate() {
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    // Camera aspect ratio updated inside the resize check
  }

  controls.update();
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
