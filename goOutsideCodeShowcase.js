const codeExamples = [
  {
    title: "Immersive Environment Controller",
    description:
      "The core interaction system that creates an intuitive, explorable experience. This code manages user movement, environmental audio, and real-time terrain adaptation - creating a natural feeling of presence that makes the digital space feel inhabitable. The system uses raycasting to ensure the camera (user's view) always maintains a realistic relationship with the terrain, simulating natural walking motion.",
    language: "JavaScript",
    code: `class FirstPersonCamera {
    constructor(camera, objects) {
      this.camera_ = camera;
      this.input_ = new InputController();
      this.objects_ = objects;
      this.raycaster = new THREE.Raycaster();
      
      // Natural movement parameters
      this.headBobTimer_ = 0;
      this.lastValidHeight = 2;
      this.movementSpeed_ = 3;
      
      // Audio immersion setup
      this.footstepAudioFiles = [
        "audio/footstep_1.mp3",
        "audio/footstep_2.mp3",
        // ... more footstep variations
      ];
      this.lastStepTime = 0;
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
    }
  
    adjustCameraYPosition() {
      if (this.objects_ && this.objects_.length > 0) {
        this.raycaster.ray.origin.copy(this.camera_.position);
        this.raycaster.ray.direction.set(0, -2, 0).normalize();
  
        const intersects = this.raycaster.intersectObjects(this.objects_, true);
  
        if (intersects.length > 0) {
          const heightAboveGround = 3;
          let groundHeight = intersects[0].point.y + heightAboveGround;
          let headBobOffset = Math.sin(this.headBobTimer_ * 10) * 0.08;
          
          // Smoothly adjust camera height to match terrain
          this.camera_.position.y = groundHeight + headBobOffset;
          this.lastValidHeight = this.camera_.position.y + headBobOffset;
        }
      }
    }`,
  },
  {
    title: "Spatial Memory System",
    description:
      "A 'world' selection system that ensures users never experience the same space twice in succession, creating a sense of exploration and discovery. The system maintains a memory of recently visited environments and uses this to inform future selections, making each journey through the project unique while preventing immediate repetition.",
    language: "JavaScript",
    code: `function getRandomModelIndex() {
    // Track last two environments to prevent repetition
    let lastModelIndex = localStorage.getItem("lastModelIndex") 
      ? parseInt(localStorage.getItem("lastModelIndex")) 
      : null;
    let secondLastModelIndex = localStorage.getItem("secondLastModelIndex")
      ? parseInt(localStorage.getItem("secondLastModelIndex"))
      : null;
  
    let availableIndexes = [];
  
    // Filter out recently visited environments
    for (let i = 0; i < glbModels.length; i++) {
      if (i !== lastModelIndex && i !== secondLastModelIndex) {
        availableIndexes.push(i);
      }
    }
  
    // Select new environment
    const randomIndex = availableIndexes[
      Math.floor(Math.random() * availableIndexes.length)
    ];
  
    // Update memory of visited spaces
    secondLastModelIndex = lastModelIndex;
    lastModelIndex = randomIndex;
    localStorage.setItem("lastModelIndex", lastModelIndex);
    localStorage.setItem("secondLastModelIndex", secondLastModelIndex);
  
    return randomIndex;
  }`,
  },
  {
    title: "Adaptive Interface System",
    description:
      "A responsive control system that adapts to different interaction contexts, enhancing the feeling of presence while ensuring accessibility. The system intelligently manages input states, adjusts to user behavior, and provides appropriate feedback - creating an interface that feels natural while remaining highly usable.",
    language: "JavaScript",
    code: `class InputController {
    constructor(target) {
      this.target_ = target || document;
      this.isHoveringD = false;
      this.freezeFrame = false;
      
      // Dynamic movement parameters
      this.current_ = {
        leftButton: false,
        rightButton: false,
        mouseXDelta: 0,
        mouseYDelta: 0,
        mouseX: 0,
        mouseY: 0,
      };
      
      // Context-aware event handling
      this.target_.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('D')) {
          this.isHoveringD = true;
          this.freezeFrame = true;
        }
      });
  
      this.target_.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('D')) {
          this.isHoveringD = false;
          this.freezeFrame = false;
        }
      });
    }
  
    update(timeElapsedS) {
      if (this.previous_ !== null && !this.isHoveringD) {
        // Update movement only when appropriate
        this.current_.mouseXDelta = 
          this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = 
          this.current_.mouseY - this.previous_.mouseY;
  
        this.previous_ = { ...this.current_ };
      }
    }`,
  },
];

function createCodeShowcase() {
  const container = document.getElementById("code-showcase-root");
  if (!container) return; // Guard clause if container not found

  container.className = "code-showcase";

  // Create header
  const header = document.createElement("div");
  header.className = "code-header";
  header.innerHTML = "<h3>Technical Implementation</h3>";
  container.appendChild(header);

  // Create examples container
  const examplesContainer = document.createElement("div");
  examplesContainer.className = "code-examples";

  codeExamples.forEach((example) => {
    const exampleElement = document.createElement("div");
    exampleElement.className = "code-example";

    // Create collapsible button
    const button = document.createElement("button");
    button.className = "code-example-header";
    button.innerHTML = `
        <div class="code-example-title">
          <h4>${example.title}</h4>
          <p>${example.description}</p>
        </div>
        <svg class="chevron" viewBox="0 0 24 24" width="24" height="24">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      `;

    // Create code content
    const content = document.createElement("div");
    content.className = "code-content";
    content.innerHTML = `
        <div class="code-language">${example.language}</div>
        <pre><code>${example.code}</code></pre>
      `;
    content.style.display = "none";

    // Add click handler
    button.addEventListener("click", () => {
      const isExpanded = content.style.display === "block";
      content.style.display = isExpanded ? "none" : "block";
      button.classList.toggle("expanded", !isExpanded);
    });

    exampleElement.appendChild(button);
    exampleElement.appendChild(content);
    examplesContainer.appendChild(exampleElement);
  });

  container.appendChild(examplesContainer);
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", createCodeShowcase);
