const windowBottom = document.getElementById("windowBottom");
const windowTop = document.getElementById("windowTop");

let isDragging = false;
let startY;
let startTop;

// Configuration
const MOVEMENT_RANGE = {
  min: 10, // Minimum position from the top (in percentage)
  max: 74, // Maximum position from the top (in percentage)
};

function handleDragStart(e) {
  isDragging = true;
  startY = e.clientY;

  // Get the current top position as a raw pixel value
  const currentTop = windowBottom.style.top
    ? parseFloat(windowBottom.style.top)
    : parseFloat(getComputedStyle(windowBottom).top);

  startTop = currentTop;
  windowBottom.style.cursor = "grabbing";
}

function handleDrag(e) {
  if (!isDragging) return;

  const deltaY = e.clientY - startY;
  let newTop = startTop + deltaY;

  // Convert to percentage of parent height
  const parentHeight = windowTop.offsetHeight;
  const positionPercentage = (newTop / parentHeight) * 100;

  // Apply constraints based on percentage
  if (
    positionPercentage >= MOVEMENT_RANGE.min &&
    positionPercentage <= MOVEMENT_RANGE.max
  ) {
    windowBottom.style.top = `${newTop}px`;
  }
}

function handleDragEnd() {
  isDragging = false;
  windowBottom.style.cursor = "grab";
}

// Event listeners
windowBottom.addEventListener("mousedown", handleDragStart);
window.addEventListener("mousemove", handleDrag);
window.addEventListener("mouseup", handleDragEnd);
window.addEventListener("mouseleave", handleDragEnd);
