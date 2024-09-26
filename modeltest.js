import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene1 = new THREE.Scene();
const hdriLoader = new RGBELoader();
hdriLoader.load("model/studio_small_08_1k.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene1.background = texture;
  scene1.environment = texture;
  scene2.background = texture;
  scene2.environment = texture;
});

const scene2 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 2 / window.innerHeight,
  0.1,
  1000
);

function createFloor() {
  const geometry = new THREE.PlaneGeometry(15000, 15000);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const floor1 = new THREE.Mesh(geometry, material);
  const floor2 = new THREE.Mesh(geometry, material);

  floor1.rotation.x = -Math.PI / 2;
  floor1.receiveShadow = true;

  floor2.rotation.x = -Math.PI / 2;
  floor2.receiveShadow = true;

  scene1.add(floor1);
  scene2.add(floor2);
}

createFloor();

const camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 2 / window.innerHeight,
  0.1,
  1000
);
const renderer1 = new THREE.WebGLRenderer({ alpha: true });
const renderer2 = new THREE.WebGLRenderer({ alpha: true });

document.getElementById("model1").appendChild(renderer1.domElement);
document.getElementById("model2").appendChild(renderer2.domElement);

const loader1 = new GLTFLoader();
loader1.load(
  "model/calatravaPen3.gltf",
  (gltf) => {
    scene1.add(gltf.scene);
    gltf.scene.position.set(0, 25, 0);
    gltf.scene.rotation.x = 7.8;
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
    animate2();
  },
  undefined,
  (error) => console.error(error)
);

const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene1.add(ambientLight);
scene2.add(ambientLight);

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

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(5, 10, 7);
scene2.add(directionalLight2);

const controls1 = new OrbitControls(camera1, renderer1.domElement);
controls1.minDistance = 100;
controls1.maxDistance = 110;
controls1.minPolarAngle = Math.PI / 10;
controls1.maxPolarAngle = Math.PI / 3.75;
controls1.autoRotate = true;
const controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.minDistance = 90;
controls2.maxDistance = 100;
controls2.minPolarAngle = Math.PI / 10;
controls2.maxPolarAngle = Math.PI / 3.75;
controls2.autoRotate = true;

// Animation for Model 1
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

camera1.position.z = 3;
camera2.position.z = 3;

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
  }
  if (resizeRendererToDisplaySize(renderer2)) {
  }
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
}

animate();
