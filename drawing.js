const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const drawToggle = document.getElementById("drawToggle");
const clearBtn = document.getElementById("clearBtn");
let isDrawing = false;
let isDrawMode = false;
let lastX = 0;
let lastY = 0;

// Set default drawing styles
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 2;
ctx.lineCap = "round";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Restore context settings after resize
  ctx.strokeStyle = ctx.strokeStyle;
  ctx.lineWidth = ctx.lineWidth;
  ctx.lineCap = "round";
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

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
}

drawToggle.addEventListener("click", () => {
  isDrawMode = !isDrawMode;
  drawToggle.classList.toggle("active");
  clearBtn.classList.toggle("visible");
  canvas.style.pointerEvents = isDrawMode ? "auto" : "none";
});

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
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
