// Carousel initialization
const carousels = document.querySelectorAll(".carousel");
carousels.forEach((carousel) => {
  const images = carousel.querySelectorAll(".carousel-image");
  images.forEach((image, index) => {
    image.style.display = index === 0 ? "block" : "none";
  });
});

// Move slide function
window.moveSlide = (direction, carouselId) => {
  const carousel = document.getElementById(carouselId);
  const images = carousel.querySelectorAll(".carousel-image");
  let currentIndex = Array.from(images).findIndex(
    (image) => image.style.display === "block"
  );

  images[currentIndex].style.display = "none";
  currentIndex = (currentIndex + direction + images.length) % images.length;
  images[currentIndex].style.display = "block";
};

const newCarousel = document.getElementById("carouselB"); // Renamed variable for carousel
const newImages = newCarousel.querySelectorAll(".carousel-imageB"); // Renamed variable for images
let currentImageIndex = 0; // Renamed variable for current image index
let hoverIntervalId; // Renamed variable for the interval ID

// Function to change to the next image
function showNextImage() {
  // Hide the current image
  newImages[currentImageIndex].style.display = "none";

  // Move to the next image, wrap around using modulo
  currentImageIndex = (currentImageIndex + 1) % newImages.length;

  // Show the next image
  newImages[currentImageIndex].style.display = "block";
}

// Start the carousel when hovering
newCarousel.addEventListener("mouseenter", () => {
  hoverIntervalId = setInterval(showNextImage, 700); // Change image every 0.3s
});

// Stop the carousel when mouse leaves
newCarousel.addEventListener("mouseleave", () => {
  clearInterval(hoverIntervalId); // Stop the image cycling
  // Keep only the current image visible
  newImages.forEach((img, index) => {
    img.style.display = index === currentImageIndex ? "block" : "none";
  });
});

// Initially hide all images except the first one
newImages.forEach((img, index) => {
  if (index !== 0) {
    img.style.display = "none"; // Hide all but the first image
  }
});
