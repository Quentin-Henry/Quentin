// Get necessary DOM elements
const infoButton = document.querySelector(".infoButton");
const follower = document.getElementById("follower");
const content = document.querySelector(".content");
const contentItems = document.querySelectorAll(".contentItem");

// Initialize follower styles

follower.style.display = "none";

// Toggle follower visibility
let isFollowerVisible = false;
infoButton.addEventListener("click", () => {
  isFollowerVisible = !isFollowerVisible;
  follower.style.display = isFollowerVisible ? "block" : "none";
  infoButton.classList.toggle("active");
});

// Function to determine which element is in center with fixed height consideration
function findCenteredElement() {
  const contentRect = content.getBoundingClientRect();
  const viewportHeight = contentRect.height;
  const scrollOffset = content.scrollTop;

  // Calculate which index should be current based on scroll position
  // Since each item is 50vw in height, we can use that for precise calculation
  const itemHeight = window.innerWidth * 0.6; // 50vw in pixels
  const viewportCenter = viewportHeight / 2;

  // Calculate which section we're in based on scroll position
  const currentIndex = Math.floor((scrollOffset + viewportCenter) / itemHeight);

  // Debug logs
  //console.log({
  // scrollOffset,
  // viewportCenter,
  // itemHeight,
  // currentIndex,
  // totalItems: contentItems.length,
  // calculatedPosition: scrollOffset + viewportCenter,
  // nextThreshold: (currentIndex + 1) * itemHeight,
  // previousThreshold: currentIndex * itemHeight,
  //});

  // Safety check to ensure we don't exceed array bounds
  if (currentIndex >= 0 && currentIndex < contentItems.length) {
    return contentItems[currentIndex];
  }

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
