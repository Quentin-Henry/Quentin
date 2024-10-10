document.addEventListener("DOMContentLoaded", () => {
  // Handle menu interactions
  const items = document.querySelectorAll(".menu");
  const others = document.querySelectorAll(".con");
  const menuParentAnchors = document.querySelectorAll(".menuParent a");
  const headerAnchors = document.querySelectorAll(".header a");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      // Store the menu identifier
      const menuIdent = item.classList[1];

      // Remove active class from all items and content
      items.forEach((a) => a.classList.remove("active"));

      // Fade out all contents
      others.forEach((a) => {
        a.classList.remove("visible"); // Start fade out
        a.classList.add("fade-out"); // Add fade-out class
      });

      // Wait for fade-out to complete before hiding elements
      setTimeout(() => {
        others.forEach((a) => {
          a.classList.remove("active", "fade-out"); // Remove fade-out class
          a.style.display = "none"; // Hide after fading out
        });

        // Add active class to the clicked item
        item.classList.add("active");

        // Show active content
        const activeContentSels = document.querySelectorAll(`.${menuIdent}`);
        activeContentSels.forEach((activeContentSel) => {
          activeContentSel.classList.add("active");
          // Trigger a reflow to restart the fade-in animation
          void activeContentSel.offsetWidth;
          activeContentSel.classList.add("visible");
          activeContentSel.style.display = "block"; // Ensure it's displayed for fade-in
        });

        // Update styles based on menu item
        if (menuIdent === "two") {
          updateStyles("#0139FE", "white");
        } else if (menuIdent === "four") {
          updateStyles("black", "white");
        } else {
          resetStyles();
        }
      }, 500); // Match this with the CSS transition duration (0.5s)
    });
  });

  // Function to update body and anchor styles
  function updateStyles(bgColor, textColor) {
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    menuParentAnchors.forEach((anchor) => (anchor.style.color = textColor));
    headerAnchors.forEach((anchor) => (anchor.style.color = textColor));
  }

  // Function to reset styles
  function resetStyles() {
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    menuParentAnchors.forEach((anchor) => (anchor.style.color = ""));
    headerAnchors.forEach((anchor) => (anchor.style.color = ""));
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
