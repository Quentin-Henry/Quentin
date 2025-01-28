// Function to toggle the menu (open or close)
function toggleMenu(menu) {
  // If the menu is already open, close it
  if (menu.style.bottom === "0px") {
    closeAllMenus();
  } else {
    // Otherwise, open this menu and close all others
    openMenu(menu);
    closeAllMenusExcept(menu);
  }
}

// Function to open a specific menu
function openMenu(menu) {
  menu.style.bottom = "0";
}

// Function to close a specific menu
function closeMenu(menu) {
  menu.style.bottom = "-100%";
}

// Function to close all menus
function closeAllMenus() {
  Object.values(menus).forEach((menu) => closeMenu(menu));
}

// Function to close all menus except the specified one
function closeAllMenusExcept(exceptMenu) {
  Object.entries(menus).forEach(([key, menu]) => {
    if (menu !== exceptMenu) {
      closeMenu(menu);
    }
  });
}

// Select all buttons and menus
const buttons = {
  openMenuBtn: document.getElementById("openMenuBtn"),
  worldInfoButton: document.getElementById("worldInfoButton"),
  controlsButton: document.getElementById("controlsButton"),
  settingsButton: document.getElementById("settingsButton"),
  newWorldButton: document.getElementById("newWorldButton"),
};

const closeButtons = {
  worldInfoCloseMenuButton: document.getElementById("worldInfocloseMenuBtn"),
  controlsCloseMenuButton: document.getElementById("controlscloseMenuBtn"),
  settingsCloseMenuButton: document.getElementById("settingscloseMenuBtn"),
};

const menus = {
  bottomDrawer: document.getElementById("bottomDrawer"),
  worldInfo: document.getElementById("worldInfo"),
  controls: document.getElementById("controls"),
  settings: document.getElementById("settings"),
};

// Event listener to toggle the bottom drawer
buttons.openMenuBtn.addEventListener("click", () =>
  toggleMenu(menus.bottomDrawer)
);

// Event listeners to toggle each specific menu
buttons.worldInfoButton.addEventListener("click", () =>
  toggleMenu(menus.worldInfo)
);
buttons.controlsButton.addEventListener("click", () =>
  toggleMenu(menus.controls)
);
buttons.settingsButton.addEventListener("click", () =>
  toggleMenu(menus.settings)
);

// Event listeners to close each specific menu (for close buttons)
closeButtons.worldInfoCloseMenuButton.addEventListener("click", () =>
  closeMenu(menus.worldInfo)
);
closeButtons.controlsCloseMenuButton.addEventListener("click", () =>
  closeMenu(menus.controls)
);
closeButtons.settingsCloseMenuButton.addEventListener("click", () =>
  closeMenu(menus.settings)
);

// Event listener to close the bottom drawer
closeButtons.bottomDrawerCloseMenuButton =
  document.getElementById("closeMenuBtn");
closeButtons.bottomDrawerCloseMenuButton.addEventListener("click", () =>
  closeMenu(menus.bottomDrawer)
);

// Function to update the image based on the slider value
function updateIconBasedOnValue(slider, imgId, thresholds, icons) {
  let value = parseFloat(slider.value); // Ensure the value is a float for comparison
  let imgElement = document.getElementById(imgId);

  if (imgElement) {
    let iconIndex;

    // Check thresholds for movement speed and FOV sliders (which have a range divided into thirds)
    if (thresholds === 3) {
      // Movement Speed Slider (1-10)
      iconIndex = Math.floor(value / thresholds);
    } else if (thresholds === 47) {
      // FOV Slider (1-140)
      iconIndex = Math.floor(value / thresholds);
    } else if (thresholds === 0.66) {
      // Volume Slider (0-1)
      // Handle volume slider's custom logic
      if (value === 0) {
        iconIndex = 0; // Show first icon for value 0
      } else if (value <= 0.66) {
        iconIndex = 1; // Show second icon for values between 0 and 0.66
      } else {
        iconIndex = 2; // Show third icon for values between 0.67 and 1
      }
    }

    // Make sure the index doesn't exceed the available icons array length
    iconIndex = Math.min(iconIndex, icons.length - 1);

    // Update the image source
    imgElement.src = icons[iconIndex];
  } else {
    console.error("Image element with id " + imgId + " not found.");
  }
}

// Function to update the image based on the slider value
function updateIconBasedOnValue(slider, imgId, thresholds, icons) {
  let value = parseFloat(slider.value); // Ensure the value is a float for comparison
  let imgElement = document.getElementById(imgId);

  if (imgElement) {
    let iconIndex;

    // Check thresholds for movement speed and FOV sliders (which have a range divided into fourths)
    if (thresholds === 2.5) {
      // Movement Speed Slider (1-10)
      iconIndex = Math.floor(value / thresholds);
    } else if (thresholds === 35) {
      // FOV Slider (1-140)
      iconIndex = Math.floor(value / thresholds);
    } else if (thresholds === 0.25) {
      // Volume Slider (0-1)
      // Handle volume slider's custom logic
      if (value === 0) {
        iconIndex = 0; // Show first icon for value 0
      } else if (value <= 0.25) {
        iconIndex = 1; // Show second icon for values between 0 and 0.25
      } else if (value <= 0.5) {
        iconIndex = 2; // Show third icon for values between 0.26 and 0.5
      } else {
        iconIndex = 3; // Show fourth icon for values between 0.51 and 1
      }
    }

    // Make sure the index doesn't exceed the available icons array length
    iconIndex = Math.min(iconIndex, icons.length - 1);

    // Update the image source
    imgElement.src = icons[iconIndex];
  } else {
    console.error("Image element with id " + imgId + " not found.");
  }
}

function createTooltip(text) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  return tooltip;
}

// Function to handle tooltip display
function handleTooltip(element, tooltipText) {
  let tooltipTimeout;
  let currentTooltip = null;

  element.addEventListener("mouseenter", () => {
    tooltipTimeout = setTimeout(() => {
      const tooltip = createTooltip(tooltipText);
      const rect = element.getBoundingClientRect();

      // Position tooltip above the button
      tooltip.style.position = "absolute";
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 8}px`;
      tooltip.style.transform = "translate(-50%, -100%)";

      document.body.appendChild(tooltip);
      currentTooltip = tooltip;
    }, 1000); // 500ms delay
  });

  element.addEventListener("mouseleave", () => {
    clearTimeout(tooltipTimeout);
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  });
}

// Function to handle menu visibility based on intro state
function handleMenuVisibility(isIntroVisible) {
  const menuElements = document.querySelectorAll(
    "#bottomDrawer, #worldInfo, #controls, #settings, #openMenuBtn"
  );
  menuElements.forEach((menu) => {
    menu.style.visibility = isIntroVisible ? "hidden" : "visible";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Add tooltips to buttons
  handleTooltip(buttons.openMenuBtn, "Open Menu");
  handleTooltip(buttons.worldInfoButton, "World Information");
  handleTooltip(buttons.controlsButton, "Controls");
  handleTooltip(buttons.settingsButton, "Settings");
  handleTooltip(buttons.newWorldButton, "New World");

  // Add tooltips to close buttons
  handleTooltip(closeButtons.worldInfoCloseMenuButton, "Close World Info");
  handleTooltip(closeButtons.controlsCloseMenuButton, "Close Controls");
  handleTooltip(closeButtons.settingsCloseMenuButton, "Close Settings");

  // Add tooltip to bottom drawer close button after it's assigned
  closeButtons.bottomDrawerCloseMenuButton =
    document.getElementById("closeMenuBtn");
  handleTooltip(closeButtons.bottomDrawerCloseMenuButton, "Close Menu");
  // Set up mutation observer for the intro div
  const introElement = document.getElementById("intro");
  if (introElement) {
    // Initially hide menus if intro is visible
    handleMenuVisibility(true);

    // Create a mutation observer to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isClicked = introElement.classList.contains("clicked");
          handleMenuVisibility(!isClicked);
        }
      });
    });

    // Start observing the intro element for class changes
    observer.observe(introElement, { attributes: true });
  }
  // Movement Speed Slider (1-10)
  const movementSpeedSlider = document.getElementById("movementSpeedSlider");
  const walkingIcons = [
    "icon/walkingIcon_1.png", // 1-2.5
    "icon/walkingIcon_2.png", // 2.5-5
    "icon/walkingIcon_3.png", // 5-7.5
    "icon/walkingIcon_4.png", // 7.5-10
  ];
  movementSpeedSlider.addEventListener("input", function () {
    updateIconBasedOnValue(
      movementSpeedSlider,
      "rangeiconimg1",
      2.5,
      walkingIcons
    );
  });

  // FOV Slider (1-140)
  const fovSlider = document.getElementById("fovSlider");
  const fovIcons = [
    "icon/fovIcon_1.png", // 1-35
    "icon/fovIcon_2.png", // 36-70
    "icon/fovIcon_3.png", // 71-105
    "icon/fovIcon_4.png", // 106-140
  ];
  fovSlider.addEventListener("input", function () {
    updateIconBasedOnValue(fovSlider, "rangeiconimg2", 35, fovIcons);
  });

  // Music Volume Slider (0-1)
  const musicVolumeSlider = document.getElementById("musicVolumeSlider");
  const volumeIcons = [
    "icon/volumeIcon_1.png", // 0
    "icon/volumeIcon_2.png", // 0 < value <= 0.25
    "icon/volumeIcon_3.png", // 0.26 <= value <= 0.5
    "icon/volumeIcon_4.png", // 0.51 <= value <= 1
  ];
  musicVolumeSlider.addEventListener("input", function () {
    updateIconBasedOnValue(
      musicVolumeSlider,
      "rangeiconimg3",
      0.25,
      volumeIcons
    );
  });

  // Initialize the images based on initial slider values
  updateIconBasedOnValue(
    movementSpeedSlider,
    "rangeiconimg1",
    2.5,
    walkingIcons
  );
  updateIconBasedOnValue(fovSlider, "rangeiconimg2", 35, fovIcons);
  updateIconBasedOnValue(musicVolumeSlider, "rangeiconimg3", 0.25, volumeIcons);
});

// Modified intro handling in outsidePage.js

// Remove click event listener setup
let introdiv = document.getElementById("intro");

function initializeTerminal() {
  const introDom = document.getElementById("intro");
  if (!introDom) return;

  // Remove the existing diagram if it exists
  const existingDiagram = document.getElementById("diagram");
  if (existingDiagram) {
    existingDiagram.remove();
  }

  // Create the terminal content container
  const terminal = document.createElement("div");
  terminal.className = "terminal-content";
  terminal.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: rgba(0, 0, 0, 0.0);
    color: #00ff00;
    font-family: monospace;
    padding: 20px;
    overflow: auto;
    white-space: pre;
    z-index: 1000;
    pointer-events: none;
  `;

  introDom.appendChild(terminal);

  const codeSnippets = [
    `[SYSTEM] Initializing outdoor simulation environment...`,

    `[SYSTEM] Loading rendering engine...
// Initialize THREE.js
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);`,

    `[SYSTEM] Configuring camera...
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1.0, 1000.0);
camera.position.set(0, 2, 0);`,

    `[SYSTEM] Loading random environment...
const modelIndex = Math.floor(Math.random() * availableModels.length);
const selectedModel = availableModels[modelIndex];
// Loading {selectedModel}...`,

    `[SYSTEM] Initializing physics engine...
this.raycaster = new THREE.Raycaster();
this.raycaster.ray.direction.set(0, -1, 0);
this.objects_ = [];`,

    `[SYSTEM] Setting up environmental audio...
const audioFiles = [
  "audio/footstep_1.mp3",
  "audio/footstep_2.mp3",
  "audio/footstep_3.mp3"
];
this.backgroundMusic.loop = true;`,

    `[SYSTEM] Configuring lighting...
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
const hemiLight = new THREE.HemisphereLight(0xffff80, 0x808080, 0.5);
scene.add(ambientLight);
scene.add(hemiLight);`,

    `[SYSTEM] Initializing input controls...
this.movementSpeed_ = 3;
this.headBobTimer_ = 0;
this.phi_ = 0;
this.theta_ = 0;`,

    `[SYSTEM] Starting render loop...
requestAnimationFrame((t) => {
  const timeElapsedS = timeElapsed * 0.001;
  this.fpsCamera_.update(timeElapsedS);
  this.threejs_.render(this.scene_, this.camera_);
});`,

    `[SYSTEM] All systems initialized.
[SYSTEM] Ready for simulation.

Controls:
WASD - Movement
Mouse - Look around
ESC - Exit fullscreen

go outside? [Y/N]: `,
  ];

  let currentSnippet = 0;
  let displayedText = "";
  let inputEnabled = false;

  function endintro() {
    // Add the clicked class to trigger the transition
    introDom.className = "clicked";
    // Clean up event listeners
    document.removeEventListener("keypress", handleInput);
  }

  function addNextSnippet() {
    if (currentSnippet >= codeSnippets.length) {
      // When done, add blinking cursor
      const cursor = document.createElement("span");
      cursor.style.cssText = `
        display: inline-block;
        width: 8px;
        height: 16px;
        background: #00ff00;
        animation: blink 1s infinite;
        margin-left: 4px;
      `;
      cursor.textContent = "_";
      terminal.appendChild(cursor);

      // Enable input only after all text is displayed
      inputEnabled = true;
      return;
    }

    displayedText += codeSnippets[currentSnippet] + "\n\n";
    terminal.textContent = displayedText;
    currentSnippet++;

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;

    // Faster random delay between snippets (30-80ms)
    const delay = Math.random() * 50 + 30;
    setTimeout(addNextSnippet, delay);
  }

  function handleInput(e) {
    if (!inputEnabled) return;

    if (e.key.toLowerCase() === "y") {
      // Remove the event listener
      document.removeEventListener("keypress", handleInput);
      // Add a brief delay before transition
      setTimeout(() => {
        terminal.style.opacity = "0";
        terminal.style.transition = "opacity 0.5s";
        setTimeout(() => {
          endintro();
        }, 500);
      }, 100);
    } else if (e.key.toLowerCase() === "n") {
      // Optional: Add some response to 'N' input
      displayedText += "\nSimulation declined. Press Y to proceed...\n";
      terminal.textContent = displayedText;
    }
  }

  // Add blinking cursor animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .terminal-content {
      transition: opacity 0.5s;
    }
  `;
  document.head.appendChild(style);

  // Add keyboard input listener
  document.addEventListener("keypress", handleInput);

  // Start the animation
  addNextSnippet();
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", initializeTerminal);
