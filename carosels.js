// Carousel initialization and page turning functionality
function initializeCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  const images = carousel.querySelectorAll(".carousel-image");
  let currentIndex = 0;

  // Remove any existing buttons if present
  const existingButtons = carousel.querySelectorAll("button");
  existingButtons.forEach((button) => button.remove());

  // Initialize first image
  images.forEach((image, index) => {
    image.style.display = index === 0 ? "block" : "none";
  });

  // Create invisible click zones
  const leftZone = document.createElement("div");
  leftZone.className = "click-zone click-zone-left";
  const rightZone = document.createElement("div");
  rightZone.className = "click-zone click-zone-right";

  // Create page indicator
  const pageIndicator = document.createElement("div");
  pageIndicator.className = "page-indicator none";
  updatePageIndicator();

  // Add zones to carousel
  carousel.appendChild(leftZone);
  carousel.appendChild(rightZone);
  carousel.appendChild(pageIndicator);

  function moveSlide(direction) {
    images[currentIndex].style.display = "none";
    currentIndex = (currentIndex + direction + images.length) % images.length;
    images[currentIndex].style.display = "block";
    updatePageIndicator();
  }

  function updatePageIndicator() {
    pageIndicator.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  // Event listeners for click zones
  leftZone.addEventListener("click", () => moveSlide(-1));
  rightZone.addEventListener("click", () => moveSlide(1));

  // Mouse interaction effects
  leftZone.addEventListener("mouseover", () => leftZone.classList.add("hover"));
  leftZone.addEventListener("mouseout", () =>
    leftZone.classList.remove("hover")
  );
  rightZone.addEventListener("mouseover", () =>
    rightZone.classList.add("hover")
  );
  rightZone.addEventListener("mouseout", () =>
    rightZone.classList.remove("hover")
  );
}

// Initialize all carousels on page load
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach((carousel, index) => {
    carousel.id = carousel.id || `carousel-${index}`;
    initializeCarousel(carousel.id);
  });
});

// Carousel class to manage individual carousel instances
class HoverCarousel {
  constructor(carouselId, options = {}) {
    this.carousel = document.getElementById(carouselId);
    this.images = this.carousel.querySelectorAll(".carousel-imageB");
    this.currentIndex = 0;
    this.intervalId = null;
    this.interval = options.interval || 700; // Default to 700ms if not specified

    this.initialize();
    this.setupEventListeners();
  }

  initialize() {
    // Hide all images except the first one
    this.images.forEach((img, index) => {
      img.style.display = index === 0 ? "block" : "none";
    });
  }

  setupEventListeners() {
    this.carousel.addEventListener("mouseenter", () => this.startCarousel());
    this.carousel.addEventListener("mouseleave", () => this.stopCarousel());
  }

  showNextImage() {
    // Hide current image
    this.images[this.currentIndex].style.display = "none";

    // Move to next image
    this.currentIndex = (this.currentIndex + 1) % this.images.length;

    // Show next image
    this.images[this.currentIndex].style.display = "block";
  }

  startCarousel() {
    this.intervalId = setInterval(() => this.showNextImage(), this.interval);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Keep only current image visible
    this.images.forEach((img, index) => {
      img.style.display = index === this.currentIndex ? "block" : "none";
    });
  }
}

// Function to initialize multiple carousels
function initializeCarousels(carouselIds, options = {}) {
  const carousels = {};

  carouselIds.forEach((id) => {
    carousels[id] = new HoverCarousel(id, options);
  });

  return carousels;
}

// Initialize all carousels on page load
document.addEventListener("DOMContentLoaded", () => {
  // You can add as many carousel IDs as needed
  const carouselIds = ["carouselB", "carouselB2"];

  // Initialize with custom options if needed
  const options = {
    interval: 700, // Change interval if desired
  };

  const carousels = initializeCarousels(carouselIds, options);
});

// Alternative: Auto-initialize all carousels with a specific class
document.addEventListener("DOMContentLoaded", () => {
  const carouselElements = document.querySelectorAll(".hover-carousel");
  const carouselIds = Array.from(carouselElements).map((el) => el.id);

  if (carouselIds.length > 0) {
    initializeCarousels(carouselIds);
  }
});
