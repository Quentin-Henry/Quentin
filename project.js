document.addEventListener("DOMContentLoaded", () => {
  // Select menu items and relevant sections
  const items = document.querySelectorAll(".menu");
  const contentBoxes = document.querySelectorAll(".con");
  const body = document.body;
  const menuParent = document.querySelector(".menuParent");
  const headers = document.querySelectorAll(".header h2");

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Identify the menu item clicked
      const menuIdent = item.classList[1];

      // Reset styles for all items
      resetStyles();

      // Change styles and show the corresponding content box
      if (menuIdent === "two") {
        updateStyles("#0139FE", "white"); // Blue background, white text
        setContentTextColor(index, "white"); // Change text color to white in content box
      } else if (menuIdent === "four") {
        updateStyles("black", "white"); // Black background, white text
        setContentTextColor(index, "white"); // Change text color to white in content box
      }

      // Show corresponding content box
      showContentBox(index);
    });
  });

  function updateStyles(bgColor, textColor) {
    body.style.backgroundColor = bgColor; // Change body background

    items.forEach((item) => (item.style.color = textColor)); // Change menu text color
    headers.forEach((header) => (header.style.color = textColor)); // Change header text color
  }

  function resetStyles() {
    body.style.backgroundColor = ""; // Reset body background
    menuParent.style.backgroundColor = ""; // Reset menu background
    items.forEach((item) => (item.style.color = "")); // Reset menu text color
    headers.forEach((header) => (header.style.color = "")); // Reset header text color
    contentBoxes.forEach((box) => {
      box.classList.remove("active"); // Remove active class from all content boxes
      box.classList.remove("visible"); // Remove visible class from all content boxes
      box.style.color = ""; // Reset text color for all content boxes
    });
  }

  function showContentBox(index) {
    contentBoxes[index].classList.add("active"); // Add active class to the corresponding content box
    contentBoxes[index].classList.add("visible"); // Add visible class to the corresponding content box
  }

  function setContentTextColor(index, color) {
    contentBoxes[index].style.color = color; // Change text color of the active content box
  }

  // Video handling for different browsers
  const isFirefox = typeof InstallTrigger !== "undefined";
  document.getElementById("mainVideo").style.display = isFirefox
    ? "none"
    : "block";
  document.getElementById("firefoxVideo").style.display = isFirefox
    ? "block"
    : "none";

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

  // Question interaction
  const questionDiv = document.querySelector(".question");
  let responseSelected = localStorage.getItem("previousResponse") !== null;

  // Reset reload count after 4 visits
  let reloadCount = (parseInt(localStorage.getItem("reloadCount")) || 0) + 1;
  if (reloadCount >= 4) {
    localStorage.removeItem("previousResponse");
    reloadCount = 0;
  }
  localStorage.setItem("reloadCount", reloadCount);

  // Mouse enter and leave events for questionDiv
  questionDiv.addEventListener("mouseenter", () => {
    if (
      !responseSelected &&
      questionDiv.querySelectorAll(".response").length === 0
    ) {
      ["Yes", "No"].forEach((response) => {
        const span = document.createElement("span");
        span.textContent = response;
        span.classList.add("response", "Q");
        questionDiv.appendChild(span);
      });
    }
  });

  questionDiv.addEventListener("mouseleave", () => {
    if (!responseSelected) {
      questionDiv
        .querySelectorAll(".response")
        .forEach((span) => span.remove());
    }
  });

  questionDiv.addEventListener("click", (event) => {
    if (event.target.classList.contains("Q") && !responseSelected) {
      const oppositeResponse =
        event.target.textContent === "Yes" ? "No" : "Yes";
      questionDiv
        .querySelector(`span:contains('${oppositeResponse}')`)
        ?.remove();

      const newSpan = document.createElement("span");
      newSpan.textContent =
        event.target.textContent === "Yes"
          ? "Do you usually do what you're told to do?"
          : "Do you have a hard time doing what's necessary?";
      questionDiv.appendChild(newSpan);

      responseSelected = true;
      localStorage.setItem("previousResponse", event.target.textContent);
    }
  });

  if (responseSelected) {
    questionDiv.querySelectorAll(".response").forEach((span) => span.remove());
  }
});
