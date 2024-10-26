import * as THREE from "https://cdn.skypack.dev/three@0.136";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js";

import { FirstPersonControls } from "https://cdn.skypack.dev/three@0.136/examples/jsm/controls/FirstPersonControls.js";

const KEYS = {
  a: 65,
  s: 83,
  w: 87,
  d: 68,
};

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

class InputController {
  constructor(target) {
    this.target_ = target || document;
    this.initialize_();
  }

  initialize_() {
    this.current_ = {
      leftButton: false,
      rightButton: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
      mouseX: 0,
      mouseY: 0,
    };
    this.previous_ = null;
    this.keys_ = {};
    this.previousKeys_ = {};
    this.target_.addEventListener(
      "mousedown",
      (e) => this.onMouseDown_(e),
      false
    );
    this.target_.addEventListener(
      "mousemove",
      (e) => this.onMouseMove_(e),
      false
    );
    this.target_.addEventListener("mouseup", (e) => this.onMouseUp_(e), false);
    this.target_.addEventListener("keydown", (e) => this.onKeyDown_(e), false);
    this.target_.addEventListener("keyup", (e) => this.onKeyUp_(e), false);
  }

  onMouseMove_(e) {
    this.current_.mouseX = e.pageX - window.innerWidth / 2;
    this.current_.mouseY = e.pageY - window.innerHeight / 2;

    if (this.previous_ === null) {
      this.previous_ = { ...this.current_ };
    }

    this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
    this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
  }

  onMouseDown_(e) {
    this.onMouseMove_(e);

    switch (e.button) {
      case 0: {
        this.current_.leftButton = true;
        break;
      }
      case 2: {
        this.current_.rightButton = true;
        break;
      }
    }
  }

  onMouseUp_(e) {
    this.onMouseMove_(e);

    switch (e.button) {
      case 0: {
        this.current_.leftButton = false;
        break;
      }
      case 2: {
        this.current_.rightButton = false;
        break;
      }
    }
  }

  onKeyDown_(e) {
    this.keys_[e.keyCode] = true;
  }

  onKeyUp_(e) {
    this.keys_[e.keyCode] = false;
  }

  key(keyCode) {
    return !!this.keys_[keyCode];
  }

  isReady() {
    return this.previous_ !== null;
  }

  update(_) {
    if (this.previous_ !== null) {
      this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
      this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

      this.previous_ = { ...this.current_ };
    }
  }
}

class FirstPersonCamera {
  constructor(camera, objects) {
    this.camera_ = camera;
    this.input_ = new InputController();
    this.rotation_ = new THREE.Quaternion();
    this.translation_ = new THREE.Vector3(0, 2, 0);
    this.phi_ = 0;
    this.phiSpeed_ = 8;
    this.theta_ = 0;
    this.thetaSpeed_ = 5;
    this.headBobActive_ = false;
    this.headBobTimer_ = 0;
    this.objects_ = objects;
    this.raycaster = new THREE.Raycaster();
    this.updateHeadBob_ = this.updateHeadBob_.bind(this); // Bind the method

    this.lastValidHeight = this.camera_.position.y; // Store last valid height

    this.footstepAudioFiles = [
      "audio/footstep_1.mp3",
      "audio/footstep_2.mp3",
      "audio/footstep_3.mp3",
      "audio/footstep_4.mp3",
      "audio/footstep_5.mp3",
      "audio/footstep_6.mp3",
      "audio/footstep_7.mp3",
      "audio/footstep_8.mp3",
      "audio/footstep_9.mp3",
      "audio/footstep_10.mp3",
      "audio/footstep_11.mp3",
      "audio/footstep_12.mp3",
      "audio/footstep_13.mp3",
      "audio/footstep_14.mp3",
      // Add more footstep audio files as needed
    ];
    this.lastStepTime = 0;
    this.isMoving = false; // Track if a movement key is pressed

    // Create audio elements
    this.footstepAudio = new Audio(); // For footstep sounds
    this.backgroundMusic = new Audio("audio/forest.mp3"); // Load background music
    this.backgroundMusic.loop = true; // Set to loop
    this.backgroundMusic.volume = 0.7; // Set volume (0.0 to 1.0)
  }

  update(timeElapsedS) {
    this.updateRotation_(timeElapsedS);
    this.updateCamera_(timeElapsedS);
    this.updateTranslation_(timeElapsedS);
    this.updateHeadBob_(timeElapsedS);
    this.input_.update(timeElapsedS);
  }

  updateCamera_(_) {
    this.camera_.quaternion.copy(this.rotation_);
    const down = new THREE.Vector3(0, -1, 0);
    this.raycaster.set(this.camera_.position, down);

    let isAboveModel = false; // Flag to check if the camera is above the model

    if (this.objects_ && this.objects_.length > 0) {
      const intersects = this.raycaster.intersectObjects(this.objects_, true);
      if (intersects.length > 0) {
        const heightAboveGround = 1.5;
        this.camera_.position.y = intersects[0].point.y + heightAboveGround;
        this.lastValidHeight = this.camera_.position.y; // Update last valid height
        isAboveModel = true; // Camera is above the model
      } else {
        this.camera_.position.y = this.lastValidHeight; // Keep the last valid height
      }
    } else {
      console.warn("No objects found for raycasting");
      this.camera_.position.y = this.lastValidHeight; // Fallback
    }

    // Mute or unmute background music based on camera height
    if (isAboveModel) {
      this.backgroundMusic.volume = 0.7; // Set to desired volume
    } else {
      this.backgroundMusic.volume = 0; // Mute
    }

    // Update camera translation based on the translation vector
    this.camera_.position.copy(this.translation_);
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.rotation_);

    const dir = forward.clone();
    forward.multiplyScalar(100);
    forward.add(this.translation_);

    let closest = forward;
    const result = new THREE.Vector3();
    const ray = new THREE.Ray(this.translation_, dir);
    for (let i = 0; i < this.objects_.length; ++i) {
      if (ray.intersectBox(this.objects_[i].geometry.boundingBox, result)) {
        if (result.distanceTo(ray.origin) < closest.distanceTo(ray.origin)) {
          closest = result.clone();
        }
      }
    }

    this.camera_.lookAt(closest);
  }
  updateHeadBob_(timeElapsedS) {
    if (this.headBobActive_) {
      const wavelength = Math.PI;
      const nextStep =
        1 + Math.floor(((this.headBobTimer_ + 0.000001) * 10) / wavelength);
      const nextStepTime = (nextStep * wavelength) / 10;
      this.headBobTimer_ = Math.min(
        this.headBobTimer_ + timeElapsedS,
        nextStepTime
      );

      // Check if we just completed a cycle
      if (this.headBobTimer_ >= nextStepTime) {
        this.headBobActive_ = false;
        this.playFootstepAudio(); // Play footstep sound
      }
    }
  }

  playFootstepAudio(timeElapsedS) {
    const currentTime = Date.now();

    // Play footstep sound every half second (500 ms)
    if (this.isMoving && currentTime - this.lastStepTime >= 500) {
      const randomIndex = Math.floor(
        Math.random() * this.footstepAudioFiles.length
      );
      const footstepAudio = new Audio(this.footstepAudioFiles[randomIndex]); // Select a random audio
      footstepAudio.currentTime = 0; // Reset audio to start
      footstepAudio.play();
      this.lastStepTime = currentTime;
    }
  }
  updateTranslation_(timeElapsedS) {
    const forwardVelocity =
      (this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0);
    const strafeVelocity =
      (this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0);

    if (forwardVelocity !== 0 || strafeVelocity !== 0) {
      this.isMoving = true;
      this.playFootstepAudio(timeElapsedS); // Play audio when moving
    } else {
      this.isMoving = false;
    }

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * timeElapsedS * 3);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * timeElapsedS * 3);

    this.translation_.add(forward);
    this.translation_.add(left);

    // After moving, adjust the camera's Y position based on the ground below
    this.adjustCameraYPosition();

    if (forwardVelocity != 0 || strafeVelocity != 0) {
      this.headBobActive_ = true;
    }
  }

  handleKeyUp_(e) {
    if (
      e.keyCode === KEYS.w ||
      e.keyCode === KEYS.s ||
      e.keyCode === KEYS.a ||
      e.keyCode === KEYS.d
    ) {
      this.playFootstepAudio(); // Play final footstep sound on key release
    }
  }

  adjustCameraYPosition() {
    // Perform raycasting downwards
    const down = new THREE.Vector3(0, -1, 0); // Direction down
    this.raycaster.set(this.camera_.position, down); // Set ray from camera position

    // Check for intersections with the objects in the scene
    if (this.objects_ && this.objects_.length > 0) {
      const intersects = this.raycaster.intersectObjects(this.objects_, true);
      if (intersects.length > 0) {
        // Set camera's Y position to be above the ground
        const heightAboveGround = 3; // Desired height above the surface
        this.camera_.position.y = intersects[0].point.y + heightAboveGround;
      } else {
        // If no intersection, set camera to a default height
        this.camera_.position.y = this.translation_.y; // Adjust accordingly
      }
    } else {
      console.warn("No objects found for raycasting");
      this.camera_.position.y = this.translation_.y; // Fallback
    }
  }

  updateRotation_(timeElapsedS) {
    const xh = this.input_.current_.mouseXDelta / window.innerWidth;
    const yh = this.input_.current_.mouseYDelta / window.innerHeight;

    this.phi_ += -xh * this.phiSpeed_;
    this.theta_ = clamp(
      this.theta_ + -yh * this.thetaSpeed_,
      -Math.PI / 3,
      Math.PI / 3
    );

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);

    const q = new THREE.Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this.rotation_.copy(q);
  }
}

class FirstPersonCameraDemo {
  constructor() {
    this.initialize_();
  }

  initialize_() {
    this.initializeRenderer_();
    this.initializeLights_();
    this.initializeScene_();
    this.initializePostFX_();
    this.initializeDemo_();

    this.previousRAF_ = null;
    this.raf_();
    this.onWindowResize_();
  }

  initializeDemo_() {
    // this.controls_ = new FirstPersonControls(
    //     this.camera_, this.threejs_.domElement);
    // this.controls_.lookSpeed = 0.8;
    // this.controls_.movementSpeed = 5;

    this.fpsCamera_ = new FirstPersonCamera(this.camera_, this.objects_);
  }

  initializeRenderer_() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.threejs_.shadowMap.enabled = true;
    this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs_.setPixelRatio(window.devicePixelRatio);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
    this.threejs_.physicallyCorrectLights = true;
    this.threejs_.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(this.threejs_.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize_();
      },
      false
    );

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(0, 2, 0);

    this.scene_ = new THREE.Scene();

    this.uiCamera_ = new THREE.OrthographicCamera(
      -1,
      1,
      1 * aspect,
      -1 * aspect,
      1,
      1000
    );
    this.uiScene_ = new THREE.Scene();
  }

  initializeScene_() {
    this.scene_.background = new THREE.Color(0xffffff); // Set background to white

    const glbModels = [
      {
        path: "model/forestSnow.glb",
        position: new THREE.Vector3(0, -4, 0),
        scale: new THREE.Vector3(1, 1, 1),
        audio: "audio/forest.mp3",
        //"Rocks with snow" (https://skfb.ly/oOquD) by Lassi Kaukonen is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
      },
      {
        path: "model/i_ergidali_i_hovi.glb",
        position: new THREE.Vector3(0, -4, 0),
        scale: new THREE.Vector3(2, 2, 2),
        audio: "audio/river-in-the-forest.mp3",
      },
      {
        path: "model/eglise_saint-alain_le_vieux_lavaur_81.glb",
        position: new THREE.Vector3(1, -4, 1),
        scale: new THREE.Vector3(1, 1, 1),
        audio: "audio/ambience_farm.mp3",
        //"Eglise Saint-Alain le vieux, Lavaur (81)" (https://skfb.ly/6U6uL) by Archéomatique is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).
      },
      // Add more model configurations as needed
    ];

    const randomModelConfig =
      glbModels[Math.floor(Math.random() * glbModels.length)];

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(randomModelConfig.path, (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Add the mesh directly to this.objects_
          this.objects_.push(child);
        }
      });
      this.scene_.add(model);

      this.playBackgroundMusic(randomModelConfig.audio);

      // Set the position and scale from the model configuration
      model.position.copy(randomModelConfig.position);
      model.scale.copy(randomModelConfig.scale);
    });

    // Initialize this.objects_ as an empty array
    this.objects_ = [];
  }

  playBackgroundMusic(audioPath) {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause(); // Stop any currently playing music
      this.backgroundMusic.currentTime = 0; // Reset the audio to the start
    }

    this.backgroundMusic = new Audio(audioPath); // Create a new audio instance
    this.backgroundMusic.loop = true; // Set to loop
    this.backgroundMusic.volume = 0.7; // Set volume (0.0 to 1.0)
    this.backgroundMusic.play(); // Start playing the new background music
  }

  initializeLights_() {
    const distance = 50.0;
    const angle = Math.PI / 4.0;
    const penumbra = 0.5;
    const decay = 1.0;

    let light = new THREE.SpotLight(
      0xffffff,
      100.0,
      distance,
      angle,
      penumbra,
      decay
    );
    light.castShadow = true;
    light.shadow.bias = -0.00001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 100;

    light.position.set(25, 25, 0);
    light.lookAt(0, 0, 0);
    this.scene_.add(light);

    const upColour = 0xffff80;
    const downColour = 0x808080;
    light = new THREE.HemisphereLight(upColour, downColour, 0.5);
    light.color.setHSL(0.6, 1, 0.6);
    light.groundColor.setHSL(0.095, 1, 0.75);
    light.position.set(0, 4, 0);
    this.scene_.add(light);
  }

  initializePostFX_() {}

  onWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();

    this.uiCamera_.left = -this.camera_.aspect;
    this.uiCamera_.right = this.camera_.aspect;
    this.uiCamera_.updateProjectionMatrix();

    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  raf_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.step_(t - this.previousRAF_);
      this.threejs_.autoClear = true;
      this.threejs_.render(this.scene_, this.camera_);
      this.threejs_.autoClear = false;
      this.threejs_.render(this.uiScene_, this.uiCamera_);
      this.previousRAF_ = t;
      this.raf_();
    });
  }

  step_(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    // this.controls_.update(timeElapsedS);
    this.fpsCamera_.update(timeElapsedS);
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new FirstPersonCameraDemo();
});
