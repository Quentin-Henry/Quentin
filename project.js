const items = document.querySelectorAll(".menu");
console.log(items);
items.forEach((item) => {
  item.addEventListener("click", function () {
    items.forEach((a) => {
      a.classList.remove("active");
      let others = document.querySelectorAll(".con");
      others.forEach((a) => {
        a.classList.remove("active");
      });
    });
    item.classList.add("active");
    let selected = document.querySelector(".active");
    console.log(selected);
    let selectedClass = selected.classList;
    let menuIdent = selectedClass[1];
    console.log(menuIdent);
    let activeContentSels = document.querySelectorAll("." + menuIdent);
    console.log(activeContentSels);
    activeContentSels.forEach((activeContentSel) => {
      activeContentSel.classList.add("active");
    });
  });
});

function moveSlide(direction, carouselId) {
  const carousel = document.getElementById(carouselId);
  const images = carousel.querySelectorAll(".carousel-image");
  const totalImages = images.length;

  let currentIndex = Array.from(images).findIndex(
    (image) => image.style.display !== "none"
  );

  if (currentIndex === -1) {
    currentIndex = 0;
  }

  images[currentIndex].style.display = "none";

  currentIndex = (currentIndex + direction + totalImages) % totalImages;

  images[currentIndex].style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const questionDiv = document.querySelector(".question");
  let responseSelected = false; // Track if a response has been selected

  // Check localStorage for previous selection and reload count
  const previousResponse = localStorage.getItem("previousResponse");
  let reloadCount = parseInt(localStorage.getItem("reloadCount")) || 0;

  // Increment reload count and store it
  reloadCount++;
  localStorage.setItem("reloadCount", reloadCount);

  // If there was a previous response, mark the response as selected
  if (previousResponse) {
    responseSelected = true; // Mark as response selected
  }

  // If the page has been reloaded four times, reset the reload count
  // and allow spans to be added back
  if (reloadCount >= 4) {
    localStorage.removeItem("previousResponse"); // Clear previous response
    reloadCount = 0; // Reset reload count
    localStorage.setItem("reloadCount", reloadCount); // Store new count
    responseSelected = false; // Allow spans to be added again
  }

  questionDiv.addEventListener("mouseenter", () => {
    // Check if spans already exist
    if (
      !responseSelected &&
      questionDiv.querySelectorAll(".response").length === 0
    ) {
      // Create "yes" span
      const yesSpan = document.createElement("span");
      yesSpan.textContent = "Yes";
      yesSpan.classList.add("response", "Q");

      // Create "no" span
      const noSpan = document.createElement("span");
      noSpan.textContent = "No";
      noSpan.classList.add("response", "Q");

      // Append spans to the div
      questionDiv.appendChild(yesSpan);
      questionDiv.appendChild(noSpan);
    }
  });

  questionDiv.addEventListener("mouseleave", () => {
    // Remove spans when mouse leaves, only if no response is selected
    if (!responseSelected) {
      questionDiv
        .querySelectorAll(".response")
        .forEach((span) => span.remove());
    }
  });

  questionDiv.addEventListener("click", (event) => {
    if (event.target.classList.contains("Q")) {
      // Prevent further clicks from adding spans
      if (responseSelected) return;

      // Determine the opposite response
      const oppositeResponse =
        event.target.textContent === "Yes" ? "No" : "Yes";

      // Remove any existing child span of the opposite
      const existingChildSpan = Array.from(
        questionDiv.querySelectorAll("span")
      ).find((span) => span.textContent === `${oppositeResponse} span clicked`);
      if (existingChildSpan) {
        existingChildSpan.remove();
      }

      // Create a new span based on which one was clicked
      const newSpan = document.createElement("span");
      if (event.target.textContent === "Yes") {
        newSpan.textContent = "Do you like doing what you're told?";
      } else {
        newSpan.textContent = "Do you have a hard time doing what's necessary?";
      }
      questionDiv.appendChild(newSpan);

      // Set the flag and store the response
      responseSelected = true;
      localStorage.setItem("previousResponse", event.target.textContent);
    }
  });

  // Remove spans if a previous response exists
  if (responseSelected) {
    questionDiv.querySelectorAll(".response").forEach((span) => span.remove());
  }
});
