// Get necessary DOM elements
const infoButton = document.querySelector(".infoButton");
const follower = document.getElementById("follower");
const content = document.querySelector(".content");
const contentItems = document.querySelectorAll(".contentItem");
const liveIndicator = document.getElementById("liveIndicator");
// Initialize follower styles

follower.style.display = "none";

// Toggle follower visibility
let isFollowerVisible = false;
infoButton.addEventListener("click", () => {
  isFollowerVisible = !isFollowerVisible;
  follower.style.display = isFollowerVisible ? "block" : "none";
  infoButton.classList.toggle("active");
});

// Create tooltip element
const tooltip = document.createElement("div");
tooltip.id = "liveTooltip";
tooltip.textContent =
  "This indicator will let you know if something is interactive or not";
document.body.appendChild(tooltip);

// Add click handler for the tooltip
let tooltipTimeout;
liveIndicator.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click from affecting elements underneath
  tooltip.classList.add("visible");

  // Hide tooltip after 3 seconds
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    tooltip.classList.remove("visible");
  }, 3000);
});

// Hide tooltip when clicking anywhere else
document.addEventListener("click", () => {
  tooltip.classList.remove("visible");
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
});

// Modify findCenteredElement to check for both embeds and .MTarget
function findCenteredElement() {
  const contentRect = content.getBoundingClientRect();
  const viewportHeight = contentRect.height;
  const scrollOffset = content.scrollTop;
  const itemHeight = window.innerWidth * 0.6;
  const viewportCenter = viewportHeight / 2;
  const currentIndex = Math.floor((scrollOffset + viewportCenter) / itemHeight);

  if (currentIndex >= 0 && currentIndex < contentItems.length) {
    const centeredElement = contentItems[currentIndex];

    // Check for either embed tags or .MTarget elements
    const hasInteractiveContent =
      centeredElement.querySelector("embed") !== null ||
      centeredElement.querySelector(".MTarget") !== null ||
      centeredElement.querySelector(".carousel") !== null;

    // Update live indicator based on presence of either type
    if (hasInteractiveContent) {
      liveIndicator.classList.add("active");
    } else {
      liveIndicator.classList.remove("active");
    }

    return centeredElement;
  }

  // If no centered element, ensure live indicator is inactive
  liveIndicator.classList.remove("active");
  return null;
}

// Function to update follower text with added logging
function updateFollowerText() {
  const centeredElement = findCenteredElement();
  if (centeredElement) {
    const text = centeredElement.getAttribute("data-text") || "Content item";
    // Only update if text has changed
    if (follower.textContent !== text) {
      //console.log("Switching to:", text);
      //console.log("Element:", centeredElement);
      follower.textContent = text;
    }
  }
}

// Add scroll event listener to content div with reduced sensitivity
let scrollTimeout;
content.addEventListener("scroll", () => {
  // Debounce the scroll event
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(() => {
    updateFollowerText(); // Removed the visibility check
  }, 20);
});

// Initial update
updateFollowerText();
