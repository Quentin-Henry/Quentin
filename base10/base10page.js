const svg = document.getElementById("polygonSvg");
const polygonGroup = document.getElementById("polygonGroup");
let currentSides = 24; // Default to 24 sides initially
let targetSides = 24; // Initially, target sides is the same as current sides

// Function to draw the polygon based on sides (which equals divisions)
function drawPolygon(sides) {
  polygonGroup.innerHTML = ""; // Clear previous polygon and lines

  // Get the dimensions of the SVG container
  const svgWidth = svg.clientWidth;
  const svgHeight = svg.clientHeight;

  // Always calculate center based on current SVG size
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Calculate the radius (40% of the smallest dimension of the SVG)
  const radius = Math.min(svgWidth, svgHeight) * 0.4;

  // Calculate angle between each side of the polygon
  const angleStep = (2 * Math.PI) / sides;

  // Draw the polygon
  let points = "";
  for (let i = 0; i < sides; i++) {
    const x = centerX + radius * Math.cos(i * angleStep);
    const y = centerY + radius * Math.sin(i * angleStep);
    points += `${x},${y} `;
  }

  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  polygon.setAttribute("points", points.trim());
  polygon.setAttribute("fill", "none"); // No fill
  polygon.setAttribute("stroke", "white"); // White stroke for the polygon
  polygon.setAttribute("stroke-width", 2); // Make the polygon lines a bit thicker for visibility
  polygonGroup.appendChild(polygon);

  // Draw radial lines for divisions (sides == divisions)
  const divisionStep = (2 * Math.PI) / sides;
  for (let i = 0; i < sides; i++) {
    const angle = i * divisionStep;
    const x1 = centerX;
    const y1 = centerY;
    const x2 = centerX + radius * Math.cos(angle);
    const y2 = centerY + radius * Math.sin(angle);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", 1);
    polygonGroup.appendChild(line);
  }
}

// Smoothly transition sides from the current value to the target value with ease-in effect
function transitionPolygon() {
  const steps = 60; // Number of steps for the transition
  let currentStep = 0;

  function easeIn(t) {
    return t * t; // Quadratic ease-in (can adjust for different effects)
  }

  function animate() {
    if (currentStep < steps) {
      const progress = currentStep / steps;
      const easedProgress = easeIn(progress); // Apply ease-in
      const newSides =
        currentSides + (targetSides - currentSides) * easedProgress;

      drawPolygon(Math.round(newSides)); // Draw with the updated sides (rounded to avoid floating point errors)
      currentStep++;
      requestAnimationFrame(animate); // Continue animation
    } else {
      currentSides = targetSides; // Ensure the final value is exactly the target
      drawPolygon(currentSides); // Draw final polygon
    }
  }

  animate(); // Start the animation
}

let toggleButton = document.getElementById("advancedToggleButton");

// Event listeners for buttons
document.getElementById("buttonH").addEventListener("click", (event) => {
  // Dynamically set targetSides based on the button's inner text
  targetSides = parseInt(event.target.innerText); // Convert the inner text to an integer
  transitionPolygon(); // Start the transition
});

document.getElementById("buttonM").addEventListener("click", (event) => {
  targetSides = parseInt(event.target.innerText); // Dynamically set targetSides based on the button's inner text
  transitionPolygon(); // Start the transition
});

document.getElementById("buttonS").addEventListener("click", (event) => {
  targetSides = parseInt(event.target.innerText); // Dynamically set targetSides based on the button's inner text
  transitionPolygon(); // Start the transition
});

// Initial polygon drawing (set to 24 sides by default)
drawPolygon(currentSides);

// Adding the toggle button functionality to trigger the H button click event
toggleButton.addEventListener("click", () => {
  // Simulate a click on the "H" button when the toggle button is clicked
  document.getElementById("buttonH").click();
});

// Initial polygon drawing (set to 24 sides by default)
drawPolygon(currentSides);

// base10page.js

// base10page.js

// Get the elements for the tab and the info container
const infoContainerTab = document.getElementById("infoContainerTab");
const infoContainer = document.querySelector(".infoContainer");
const timeContainer = document.getElementById("TimeElementsContainer");
// Function to toggle the info container
function toggleInfoContainer() {
  if (infoContainer.style.transform === "translateX(0%)") {
    infoContainer.style.transform = "translateX(95%)"; // Slide off screen
    timeContainer.style.width = "100%";
  } else {
    infoContainer.style.transform = "translateX(0%)"; // Slide on screen
    timeContainer.style.width = "65%";
  }
}

// Add click event listener to the tab
infoContainerTab.addEventListener("click", toggleInfoContainer);
