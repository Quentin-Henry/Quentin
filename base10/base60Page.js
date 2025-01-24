// Initialize polygon visualization
const svg = document.getElementById("polygonSvg");
const polygonGroup = document.getElementById("polygonGroup");
let currentSides = 24; // Default to 24 sides initially
let targetSides = 24;

// Function to draw the polygon based on sides
function drawPolygon(sides) {
  polygonGroup.innerHTML = "";
  const svgWidth = svg.clientWidth;
  const svgHeight = svg.clientHeight;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = Math.min(svgWidth, svgHeight) * 0.4;
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
  polygon.setAttribute("fill", "none");
  polygon.setAttribute("stroke", "white");
  polygon.setAttribute("stroke-width", 2);
  polygonGroup.appendChild(polygon);

  // Draw radial lines
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    const x2 = centerX + radius * Math.cos(angle);
    const y2 = centerY + radius * Math.sin(angle);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", centerX);
    line.setAttribute("y1", centerY);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", 1);
    polygonGroup.appendChild(line);
  }
}

// Smooth transition between polygon states
function transitionPolygon() {
  const steps = 60;
  let currentStep = 0;

  function animate() {
    if (currentStep < steps) {
      const progress = currentStep / steps;
      const easedProgress = progress * progress;
      const newSides =
        currentSides + (targetSides - currentSides) * easedProgress;

      drawPolygon(Math.round(newSides));
      currentStep++;
      requestAnimationFrame(animate);
    } else {
      currentSides = targetSides;
      drawPolygon(currentSides);
    }
  }

  animate();
}

// Info container functionality
const infoContainer = document.querySelector(".infoContainer");
const timeContainer = document.getElementById("TimeElementsContainer");
const infoContainerTab = document.getElementById("infoContainerTab");

function toggleInfoContainer() {
  const isOpen = infoContainer.style.transform === "translateX(0%)";
  infoContainer.style.transform = isOpen ? "translateX(95%)" : "translateX(0%)";
  timeContainer.style.width = isOpen ? "100%" : "65%";
  infoContainer.classList.toggle("active");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize BaseSelector
  const menuContainer = document.querySelector("#clockMenu");
  const baseSelector = new BaseSelector(menuContainer);

  // Set up event listeners
  infoContainerTab.addEventListener("click", toggleInfoContainer);

  // Time division buttons
  ["buttonH", "buttonM", "buttonS"].forEach((buttonId) => {
    document.getElementById(buttonId).addEventListener("click", (event) => {
      targetSides = parseInt(event.target.innerText);
      transitionPolygon();
    });
  });

  // Initial polygon drawing
  drawPolygon(currentSides);
});
