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
  let value = slider.value;
  let imgElement = document.getElementById(imgId);

  if (imgElement) {
    // Calculate the index for the icons based on the thresholds
    let iconIndex = Math.floor(value / thresholds);

    // Make sure the index does not exceed the maximum available icons
    iconIndex = Math.min(iconIndex, icons.length - 1);

    // Update the image source
    imgElement.src = icons[iconIndex];
  } else {
    console.error("Image element with id " + imgId + " not found.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Movement Speed Slider (1-10)
  const movementSpeedSlider = document.getElementById("movementSpeedSlider");
  const walkingIcons = [
    "icon/walkingIcon_1.png", // 1-3
    "icon/walkingIcon_2.png", // 4-6
    "icon/walkingIcon_3.png", // 7-10
  ];
  movementSpeedSlider.addEventListener("input", function () {
    updateIconBasedOnValue(
      movementSpeedSlider,
      "rangeiconimg1",
      3,
      walkingIcons
    );
  });

  // FOV Slider (1-140)
  const fovSlider = document.getElementById("fovSlider");
  const fovIcons = [
    "icon/fovIcon_1.png", // 1-46
    "icon/fovIcon_2.png", // 47-93
    "icon/fovIcon_3.png", // 94-140
  ];
  fovSlider.addEventListener("input", function () {
    updateIconBasedOnValue(fovSlider, "rangeiconimg2", 47, fovIcons);
  });

  // Music Volume Slider (0-1)
  const musicVolumeSlider = document.getElementById("musicVolumeSlider");
  const volumeIcons = [
    "icon/volumeIcon_1.png", // 0-0.33
    "icon/volumeIcon_2.png", // 0.34-0.66
    "icon/volumeIcon_3.png", // 0.67-1
  ];
  musicVolumeSlider.addEventListener("input", function () {
    updateIconBasedOnValue(
      musicVolumeSlider,
      "rangeiconimg3",
      0.33,
      volumeIcons
    );
  });

  // Initialize the images based on initial slider values
  updateIconBasedOnValue(movementSpeedSlider, "rangeiconimg1", 3, walkingIcons);
  updateIconBasedOnValue(fovSlider, "rangeiconimg2", 47, fovIcons);
  updateIconBasedOnValue(musicVolumeSlider, "rangeiconimg3", 0.33, volumeIcons);
});
