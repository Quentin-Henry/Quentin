// Function to move the carousel images
function moveSlide(direction, carouselId) {
  const carouselContainer = document.getElementById(carouselId);
  const carouselImages = carouselContainer.querySelector(".carousel-images");
  const totalImages = carouselImages.children.length;
  const currentTransform = carouselImages.style.transform || "translateX(0%)";
  const currentIndex =
    parseInt(currentTransform.replace("translateX(", "").replace("%)", "")) ||
    0;

  let newIndex = currentIndex + direction * 100;

  // If we're at the last image, loop back to the first
  if (newIndex < -((totalImages - 1) * 100)) {
    newIndex = 0;
  }
  // If we're at the first image, loop to the last
  if (newIndex > 0) {
    newIndex = -((totalImages - 1) * 100);
  }

  carouselImages.style.transform = `translateX(${newIndex}%)`;
}

const gridItems = document.querySelectorAll(".grid-item");
const progressSlider = document.querySelector("#progressSilder"); // Select the slider element
const gridprogressText = document.querySelector("#gridProgressText");
console.log(progressSlider);
let activeCircles = 0; // Keep track of the number of active circles

// Add click event listener to each grid item
gridItems.forEach((item) => {
  item.addEventListener("click", function () {
    // Check if the circle is already selected or not
    const isSelected = this.classList.contains("selected");

    if (isSelected) {
      // If selected, deselect it and reduce the activeCircles count
      activeCircles--;
      this.classList.remove("selected");
    } else {
      // If not selected, check if we're already at 4 active circles
      if (activeCircles < 4) {
        activeCircles++;
        this.classList.add("selected");
      } else {
        // If 4 circles are already selected, remove one before adding the new one
        const selectedItems = document.querySelectorAll(".grid-item.selected");
        // Deselect the first selected circle
        selectedItems[0].classList.remove("selected");
        activeCircles--;
        activeCircles++; // Re-add the new selected circle
        this.classList.add("selected");
      }
    }
    console.log(gridprogressText);
    // Log the active circles count
    console.log(`Active Circles: ${activeCircles}`);
    gridprogressText.innerHTML = `${activeCircles}`;

    // Update the slider width based on the number of active circles
    updateProgressSlider();
  });
});

// Function to update the slider width based on activeCircles
function updateProgressSlider() {
  const percentage = (activeCircles / 4) * 96;
  progressSlider.style.width = `${percentage}%`;
}

document.addEventListener("DOMContentLoaded", function () {
  const svgCanvas = document.getElementById("svgCanvas");
  const innerCircle = svgCanvas.querySelector(".inner-circle");
  const centerX = 100; // The center X position of the circle
  const centerY = 100; // The center Y position of the circle
  const radius = 60; // The radius of the guideline circle (inner circle follows this)

  let isDragging = false;
  let angle = 0; // Initial angle is set to 0

  // Function to calculate the angle based on mouse position relative to the circle center
  function calculateAngle(e) {
    const rect = svgCanvas.getBoundingClientRect(); // Get the bounding box of the SVG
    const dx = e.clientX - rect.left - centerX; // Adjust mouse X relative to SVG's position
    const dy = e.clientY - rect.top - centerY; // Adjust mouse Y relative to SVG's position

    console.log("Mouse Coordinates:", e.clientX, e.clientY);
    console.log("Adjusted Coordinates:", dx, dy);

    return Math.atan2(dy, dx); // Returns angle in radians
  }

  // Function to set the position of the inner circle based on the angle
  function setInnerCirclePosition() {
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    console.log("Inner Circle Position:", x, y); // Log the updated position

    innerCircle.setAttribute("cx", x);
    innerCircle.setAttribute("cy", y);
  }

  // Initialize position of the inner circle at 0 degrees
  setInnerCirclePosition();

  // Handle mouse down event to start dragging
  innerCircle.addEventListener("mousedown", (e) => {
    console.log("Mouse Down:", e.clientX, e.clientY);
    isDragging = true;
    angle = calculateAngle(e); // Initialize the angle based on the initial mouse position
    e.preventDefault(); // Prevent text selection during drag
  });

  // Handle mouse move event to update the position of the inner circle while dragging
  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      angle = calculateAngle(e); // Update angle based on mouse movement
      setInnerCirclePosition(); // Update the inner circle's position
    }
  });
});
