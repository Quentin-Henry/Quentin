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
