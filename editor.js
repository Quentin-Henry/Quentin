// Create a simpler editor HTML focused on drawing controls
const editorHTML = `
<div id="pageEditor" class="page-editor" style="display: none;>
<div id="pageWraper">
<div id="editorHeader" class="page-editor__header">
Pen
<span id="closeEditor" class="page-editor__close">×</span>
</div>
<div class="page-editor__content">
<div class="page-editor__control-group" id="color">
    <div>
  <label class="page-editor__label">Color</label>
  <input
    type="color"
    id="strokeColor"
    class="page-editor__input custom-color-input"
    value="#ffffff"
  /></div>
 <div> <label class="page-editor__label">Opacity</label>
  <input
    type="range"
    id="strokeOpacity"
    class="page-editor__range opacity-slider"
    min="0"
    max="100"
    value="100"
  />
  <span id="strokeOpacityValue" class="page-editor__value none"
    >30%</span
  ></div>
  <div><label class="page-editor__label">Width</label>
  <input
    type="range"
    id="strokeWidth"
    class="page-editor__range growing-slider"
    min="1"
    max="20"
    value="2"
  />
  <span id="strokeWidthValue" class="page-editor__value none">2px</span></div>
</div>
</div>
</div>
`;

// Simplified editor styles
const editorStyles = `
.page-editor {
    position: fixed;
    top: 100px;
    left: 100px;
    width: 250px;
    width: 300px;
    height: fit-content;
    background: rgba(72, 72, 72, 0.443) !important;
    border: 1px solid #3b3b3b;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: helvetica, sans-serif;
    font-size: 14px !important;
    color: #ffffff !important;
    backdrop-filter: blur(15px);
    
  }
  
  .page-editor__header {
    padding: 20px;
    padding-bottom: 0px;
    cursor: move;
    display: flex;
    justify-content: space-between;
    border-radius: 4px 4px 0 0;
    font-size: 20px !important;
    font-weight: bold !important;
    color: #d7d7d7;
    align-items: center;
  }
  
  .page-editor__close {
    cursor: pointer;
    font-size: 20px !important;
  }
  
  .page-editor__close:hover {
    color: #ffffff8d !important;
  }
  
  #pageWraper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  
  .page-editor__content {
    padding: 20px;
    height: 100%;
  }
  
  .page-editor__control-group {
    margin-bottom: 15px;
    font-size: 14px !important;
    height: 100%;
  }
  
  .page-editor__label {
    display: block;
    margin-bottom: 5px;
    font-size: 10px !important;
    font-weight: bold !important;
    color: #909090;
    padding-bottom: 7px;
  }
  
  .page-editor__input,
  .page-editor__range {
    width: 100%;
    padding: 5px;
    border-radius: 3px;
    font-size: 14px !important;
  }
  
  .page-editor__value {
    display: inline-block;
    margin-top: 5px;
    font-size: 12px !important;
  }
  
  #color {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 30px;
  }
  
  .none {
    display: none;
  }
  
  .custom-color-input {
    /* Modify the overall appearance */
    width: 100%;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
  }
  
  /* Target the color swatch specifically */
  .custom-color-input::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  .custom-color-input::-webkit-color-swatch {
    border: none;
    border-radius: 8px;
    box-shadow: inset 3px 4px 7px -3px rgb(0, 0, 0),
      inset -3px -3px 10px -2px #ffffff38;
  }
  
  /* Firefox specific styling */
  .custom-color-input::-moz-color-swatch {
    border: none;
    border-radius: 8px;
  }
  
  /* Optional hover effects */
  .custom-color-input:hover {
    transform: scale(1.01);
  
    transition: transform 0.2s ease;
  }
  
  /* Optional focus styling */
  .custom-color-input:focus {
    outline: 1px solid #ffffff;
    outline-offset: 2px;
  }
  
  /* Optional disabled state */
  .custom-color-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .growing-slider {
    /* Base slider styling */
    width: 95%;
    height: 3px; /* Increased to accommodate larger thumb */
    -webkit-appearance: none;
    appearance: none;
    background: #d7d7d788;
    outline: none;
    border-radius: 5px;
    box-shadow: inset 1px 4px 5px -2px rgba(24, 24, 24, 0.723),
      inset -3px -3px 5px -1px #b9b9b9;
  }
  
  /* Thumb styling for Webkit (Chrome, Safari, etc.) */
  .growing-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 40px; /* Fixed width */
    height: var(--thumb-height, 20px);
    border-radius: 8px;
    background: rgb(160, 160, 160);
    cursor: pointer;
    border: none;
    box-shadow: inset 4px 4px 7px -2px rgb(206, 206, 206),
      inset -4px -4px 10px -4px #585858d4, 0px 0px 10px -2px #20202086;
  
    /* Smooth height transition */
    transition: height 0.1s ease;
  }
  
  /* Thumb styling for Firefox */
  .growing-slider::-moz-range-thumb {
    width: 20px; /* Fixed width */
    height: var(--thumb-height, 20px);
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    border: none;
    transition: height 0.1s ease;
  }
  
  /* Track styling for Firefox */
  .growing-slider::-moz-range-track {
    background: #e0e0e0;
    height: 40px;
    border-radius: 10px;
  }
  
  .opacity-slider {
    width: 95%;
    height: 3px; /* Increased to accommodate larger thumb */
    -webkit-appearance: none;
    appearance: none;
    background: #d7d7d788;
    outline: none;
    border-radius: 5px;
    box-shadow: inset 1px 4px 5px -2px rgba(24, 24, 24, 0.723),
      inset -3px -3px 5px -1px #b9b9b9;
  }
  
  /* Thumb styling for Webkit (Chrome, Safari, etc.) */
  .opacity-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 40px;
    height: 20px;
    border-radius: 8px;
    /* Use rgba for opacity */
    background: rgba(160, 160, 160, var(--thumb-opacity, 1));
    cursor: pointer;
    border: none;
    /* Smooth opacity transition */
    transition: background-color 0.1s ease;
    box-shadow: inset 4px 4px 7px -2px rgb(206, 206, 206),
      inset -4px -4px 10px -4px #585858d4, 0px 0px 10px -2px #20202086;
  }
  
  /* Thumb styling for Firefox */
  .opacity-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    border: 2px solid #ffffff;
    /* Use rgba for opacity */
    background: rgba(33, 150, 243, var(--thumb-opacity, 0.1));
    cursor: pointer;
    border: none;
    transition: background-color 0.1s ease;
  }
  
  /* Track styling for Firefox */
  .opacity-slider::-moz-range-track {
    background: #e0e0e0;
    height: 20px;
    border-radius: 10px;
  }
  



`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = editorStyles;
document.head.appendChild(styleSheet);

// Add the editor HTML to the document
document.body.insertAdjacentHTML("beforeend", editorHTML);

// Protect the edit button
const editBtn = document.querySelector(".editButton");
editBtn.classList.add("protected-ui");

// Get DOM elements
const editor = document.getElementById("pageEditor");
const editorHeader = document.getElementById("editorHeader");
const closeBtn = document.getElementById("closeEditor");
const strokeColorInput = document.getElementById("strokeColor");
const strokeOpacityInput = document.getElementById("strokeOpacity");
const strokeOpacityValue = document.getElementById("strokeOpacityValue");
const strokeWidthInput = document.getElementById("strokeWidth");
const strokeWidthValue = document.getElementById("strokeWidthValue");

// Dragging functionality
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

function dragStart(e) {
  initialX = e.clientX - xOffset;
  initialY = e.clientY - yOffset;

  if (e.target === editorHeader) {
    isDragging = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    xOffset = currentX;
    yOffset = currentY;
    editor.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }
}

// Event listeners for dragging
editorHeader.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

// Function to update drawing styles
function updateDrawingStyles() {
  const color = strokeColorInput.value;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const drawingStyleEvent = new CustomEvent("drawingStyleUpdate", {
    detail: {
      color: { r, g, b },
      opacity: strokeOpacityInput.value,
      width: strokeWidthInput.value,
    },
  });

  window.dispatchEvent(drawingStyleEvent);

  // Update display values
  strokeOpacityValue.textContent = `${strokeOpacityInput.value}%`;
  strokeWidthValue.textContent = `${strokeWidthInput.value}px`;
}

// Default styles
const defaultStyles = {
  strokeColor: "#FFFFFF",
  strokeOpacity: 100,
  strokeWidth: 2,
};

// Reset functionality
function resetStyles() {
  strokeColorInput.value = defaultStyles.strokeColor;
  strokeOpacityInput.value = defaultStyles.strokeOpacity;
  strokeWidthInput.value = defaultStyles.strokeWidth;
  updateDrawingStyles();
}

// Event listeners for controls
strokeColorInput.addEventListener("input", updateDrawingStyles);
strokeOpacityInput.addEventListener("input", updateDrawingStyles);
strokeWidthInput.addEventListener("input", updateDrawingStyles);

// Toggle editor visibility
editBtn.addEventListener("click", () => {
  const isVisible = editor.style.display === "block";
  editor.style.display = isVisible ? "none" : "block";
});

// Close editor
closeBtn.addEventListener("click", () => {
  editor.style.display = "none";
});

// Initialize with default styles
updateDrawingStyles();

document
  .querySelector(".growing-slider")
  .addEventListener("input", function (e) {
    const minHeight = 20; // Minimum thumb height in pixels
    const maxHeight = 100; // Maximum thumb height in pixels

    // Calculate height based on slider value (0-100)
    const value = e.target.value;
    const height = minHeight + (maxHeight - minHeight) * (value / 100);

    // Set the CSS variable for thumb height
    e.target.style.setProperty("--thumb-height", `${height}px`);
  });

document
  .querySelector(".opacity-slider")
  .addEventListener("input", function (e) {
    const minOpacity = 0.3; // Minimum opacity at left end
    const maxOpacity = 1.0; // Maximum opacity at right end

    // Reverse the opacity calculation since we're starting from right
    const value = e.target.value;
    const opacity =
      maxOpacity - (maxOpacity - minOpacity) * ((100 - value) / 100);

    // Set the CSS variable for thumb opacity
    e.target.style.setProperty("--thumb-opacity", opacity);
  });
