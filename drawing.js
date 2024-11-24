const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const drawToggle = document.getElementById("drawToggle");
const clearBtn = document.getElementById("clearBtn");
let isDrawing = false;
let isDrawMode = false;
let lastX = 0;
let lastY = 0;

// Create a style element for our CSS with a more specific name
const drawingModeStyles = document.createElement("style");
document.head.appendChild(drawingModeStyles);
drawingModeStyles.textContent = `
  .drawing-mode-active {
    cursor: none !important;
  }

  .custom-cursor {
    width: 20px;
    height: 20px;
    border: 2px solid white;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.1s ease, width 0.2s ease, height 0.2s ease;
  }

  .custom-cursor.active {
    opacity: 1;
  }
`;

// Create custom cursor element
const cursor = document.createElement("div");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);
cursor.style.display = "none"; // Add this line to fix Safari initial visibility

// Function to update cursor size based on stroke width
function updateCursorSize(width) {
  // Base size of 20px, scaled proportionally with width
  // but with a more controlled growth rate using Math.log
  const baseSize = 20;
  const scaleFactor = 1 + Math.log10(width);
  const newSize = baseSize * scaleFactor;

  cursor.style.width = `${newSize}px`;
  cursor.style.height = `${newSize}px`;

  // Scale the border width slightly with the cursor size
  const borderWidth = Math.max(2, Math.min(4, width / 4));
  cursor.style.borderWidth = `${borderWidth}px`;
}

// Function to update cursor opacity based on stroke opacity
function updateCursorOpacity(opacity) {
  // Never let the cursor get fully transparent
  // Minimum opacity of 0.3, scaled up to 1 based on stroke opacity
  const minOpacity = 0.5;
  const cursorOpacity = minOpacity + (1 - minOpacity) * (opacity / 100);
  cursor.style.opacity = cursorOpacity;
}

// Update cursor position with dynamic scale based on current size
function updateCursor(e) {
  if (isDrawMode) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    if (isDrawing) {
      // Get the current size of the cursor
      const currentSize = parseFloat(cursor.style.width);
      const scaleRatio = 0.8; // 20% smaller when drawing
      cursor.style.transform = `translate(-50%, -50%) scale(${scaleRatio})`;
    } else {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    }
  }
}

// Set default drawing styles
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 2;
ctx.lineCap = "round";

// Initialize cursor with default values
updateCursorSize(ctx.lineWidth);
updateCursorOpacity(100);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Restore context settings after resize
  ctx.strokeStyle = ctx.strokeStyle;
  ctx.lineWidth = ctx.lineWidth;
  ctx.lineCap = "round";
}

function startDrawing(e) {
  if (!isDrawMode) return;
  isDrawing = true;
  [lastX, lastY] = [e.clientX, e.clientY];
}

function draw(e) {
  if (!isDrawing || !isDrawMode) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  [lastX, lastY] = [e.clientX, e.clientY];
}

function stopDrawing() {
  isDrawing = false;
  if (cursor) {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
  }
}

function toggleDrawingMode() {
  isDrawMode = !isDrawMode;

  // Toggle button states
  drawToggle.classList.toggle("active");
  clearBtn.classList.toggle("visible");

  // Toggle canvas interaction
  canvas.style.pointerEvents = isDrawMode ? "auto" : "none";

  // Toggle cursor visibility
  if (isDrawMode) {
    canvas.classList.add("drawing-mode-active");
    cursor.style.display = "block"; // Show first
    setTimeout(() => cursor.classList.add("active"), 0); // Then fade in
    document.addEventListener("mousemove", updateCursor);
  } else {
    canvas.classList.remove("drawing-mode-active");
    cursor.classList.remove("active");
    setTimeout(() => (cursor.style.display = "none"), 200); // Hide after fade out
    document.removeEventListener("mousemove", updateCursor);
  }
}

drawToggle.addEventListener("click", toggleDrawingMode);

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Listen for drawing style updates
window.addEventListener("drawingStyleUpdate", (e) => {
  const { color, opacity, width } = e.detail;
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
    opacity / 100
  })`;
  ctx.lineWidth = width;

  // Update cursor color to match drawing color
  cursor.style.borderColor = ctx.strokeStyle;

  // Update cursor size and opacity
  updateCursorSize(width);
  updateCursorOpacity(opacity);
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
