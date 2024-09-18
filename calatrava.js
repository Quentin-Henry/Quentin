import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
let divWindow = document.getElementById("model");
let sizeParent = document.getElementById("parent");
console.log(sizeParent);
let h = sizeParent.clientHeight;
let hMath = h * 10;
let w = sizeParent.clientWidth;
console.log(divWindow);
console.log(hMath);
console.log(w);
renderer.setSize(500, 500);
renderer.setClearColor(0xffffff);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

divWindow.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, 500 / 500, 10, 1000);
camera.position.set(0, 0, -1000);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 200;
controls.maxDistance = 300;

controls.autoRotate = true;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const spotLight = new THREE.SpotLight(0xffffff, 300, 100, 1, 1);
spotLight.position.set(0, 50, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const light = new THREE.AmbientLight(0xffffff, 300); // soft white light
scene.add(light);

const loader = new GLTFLoader().setPath("model/");
loader.load(
  "untitled.gltf",
  (gltf) => {
    console.log("loading model");
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    mesh.position.set(0, 1.05, -1);
    scene.add(mesh);

    document.getElementById("progress-container").style.display = "none";
  },
  (xhr) => {
    console.log(`loading ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);

window.addEventListener("resize", () => {
  camera.aspect = sizeParent.clientWidth / sizeParent.clientWidth;
  camera.updateProjectionMatrix();
  renderer.setSize(sizeParent.clientWidth, sizeParent.clientWidth);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
