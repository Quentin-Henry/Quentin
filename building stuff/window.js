const windowBottom = document.getElementById("windowBottom");
const windowTop = document.getElementById("windowTop");
const airCon = document.getElementById("airCon");

let isDragging = false;
let startY;
let startTop;
let isLocked = false; // Flag to check if the div is locked
let currentPercentage = 0; // To track the current percentage

// Buffer percentage
const bufferPercentage = 0.025;

// Function to track the position of the bottom of the draggable div
function trackPosition() {
  const windowTopRect = windowTop.getBoundingClientRect();
  const windowBottomRect = windowBottom.getBoundingClientRect();
  const bottomYPosition = windowBottomRect.bottom - windowTopRect.top; // Y position relative to windowTop
  const windowTopHeight = windowTopRect.height; // Total height of windowTop

  // Calculate percentage
  const percentageOpen = ((bottomYPosition / windowTopHeight) * 100).toFixed(2); // Convert to percentage
  const clampedPercentage = Math.max(0, Math.min(100, percentageOpen));
  currentPercentage = clampedPercentage; // Store current percentage

  console.log("Bottom Y Position Percentage:", clampedPercentage + "%");

  // Condition to show/hide airCon
  if (clampedPercentage >= 65 && clampedPercentage <= 69) {
    airCon.classList.add("visible");
  } else {
    airCon.classList.remove("visible");
  }
}

windowBottom.addEventListener("mousedown", (e) => {
  if (!isLocked) {
    // Only allow dragging if not locked
    isDragging = true;
    startY = e.clientY;
    startTop =
      windowBottom.getBoundingClientRect().top -
      windowTop.getBoundingClientRect().top;
    windowBottom.style.cursor = "grabbing";
  }
});

window.addEventListener("mousemove", (e) => {
  if (isDragging && !isLocked) {
    const deltaY = e.clientY - startY;
    let newTop = startTop + deltaY;

    // Get the height of the windowTop
    const windowTopHeight = windowTop.clientHeight;

    // Calculate buffer limits
    const minTop = 0 + windowTopHeight * bufferPercentage;
    const maxTop =
      windowTopHeight -
      windowBottom.clientHeight -
      windowTopHeight * bufferPercentage;

    // Constrain the movement within the windowTop limits with buffer
    if (newTop >= minTop && newTop <= maxTop) {
      windowBottom.style.top = `${newTop}px`;
      trackPosition(); // Call the tracking function on movement
    }
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  windowBottom.style.cursor = "grab";
});

window.addEventListener("mouseleave", () => {
  isDragging = false;
  windowBottom.style.cursor = "grab";
});

// Click event for airCon
airCon.addEventListener("click", () => {
  if (currentPercentage >= 65 && currentPercentage <= 69) {
    // Check if within range
    if (isLocked) {
      airCon.classList.remove("full-visible"); // Remove full visibility
      airCon.classList.remove("visible"); // Hide airCon
      isLocked = false; // Unlock draggable div
    } else {
      airCon.classList.add("full-visible"); // Set full visibility
      isLocked = true; // Lock draggable div
    }
  }
});

// Hover event for airCon to show half visibility
airCon.addEventListener("mouseover", () => {
  if (!isLocked && currentPercentage >= 65 && currentPercentage <= 69) {
    airCon.classList.add("visible"); // Show 50% visibility on hover
  }
});

airCon.addEventListener("mouseout", () => {
  if (!isLocked) {
    airCon.classList.remove("visible"); // Remove 50% visibility when not hovering
  }
});
