// Keep track of the opened windows
let openedWindows = [];

// Open the corresponding window when an app icon is clicked
function openWindow(windowId) {
  const window = document.getElementById(`window${windowId}`);
  window.style.display = "block";

  // Add a random color to each window
  const colors = ["#ff6347", "#7fff00", "#1e90ff", "#ff1493", "#00ced1"];
  window.style.backgroundColor = colors[windowId - 1];

  // Keep track of opened windows
  openedWindows.push(window);

  // Enable drag functionality
  makeDraggable(window);
}

// Close a window
function closeWindow(windowId) {
  const window = document.getElementById(`window${windowId}`);
  window.style.display = "none";

  // Remove the window from openedWindows list
  openedWindows = openedWindows.filter((w) => w !== window);
}

// Make a window draggable
function makeDraggable(element) {
  const header = element.querySelector(".window-header");
  let offsetX, offsetY;

  header.addEventListener("mousedown", (e) => {
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    const onMouseMove = (e) => {
      element.style.left = e.clientX - offsetX + "px";
      element.style.top = e.clientY - offsetY + "px";
    };

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", onMouseMove);
      },
      { once: true }
    );
  });
}

// Minimize a window
function minimizeWindow(windowId) {
  const window = document.getElementById(`window${windowId}`);
  const content = window.querySelector(".window-content");
  const header = window.querySelector(".window-header");
  const minimizeBtn = window.querySelector(".minimize-btn");

  // Minimize window: hide content, adjust size, change button to restore
  content.style.display = "none";
  window.style.width = "150px"; // Adjust window size for minimized state
  window.style.height = "50px"; // Adjust window height for minimized state
  header.querySelector("span").style.display = "none"; // Hide the title

  // Change minimize button to restore button
  minimizeBtn.textContent = "+";
  minimizeBtn.setAttribute("onclick", `restoreWindow(${windowId})`);
}

// Restore a window from minimized state
function restoreWindow(windowId) {
  const window = document.getElementById(`window${windowId}`);
  const content = window.querySelector(".window-content");
  const header = window.querySelector(".window-header");
  const minimizeBtn = window.querySelector(".minimize-btn");

  // Restore window: show content, restore size, restore title
  content.style.display = "block";
  window.style.width = "300px"; // Original size
  window.style.height = "auto"; // Original height
  header.querySelector("span").style.display = "inline"; // Show title

  // Change restore button back to minimize button
  minimizeBtn.textContent = "_";
  minimizeBtn.setAttribute("onclick", `minimizeWindow(${windowId})`);
}
