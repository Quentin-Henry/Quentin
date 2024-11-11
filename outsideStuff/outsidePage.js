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
