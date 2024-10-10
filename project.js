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

    // Change styles if "Calatrava" is active
    if (menuIdent === "two") {
      document.body.style.backgroundColor = "#0139FE";
      document.body.style.color = "white";

      // Change text color of anchor tags within menuParent and header
      const menuParentAnchors = document.querySelectorAll(".menuParent a");
      const headerAnchors = document.querySelectorAll(".header a");
      menuParentAnchors.forEach((anchor) => (anchor.style.color = "white"));
      headerAnchors.forEach((anchor) => (anchor.style.color = "white"));
    } else if (menuIdent === "four") {
      // Change this to your actual class or condition
      // Change body background to black and text to white
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";

      // Change text color of anchor tags within menuParent and header
      const menuParentAnchors = document.querySelectorAll(".menuParent a");
      const headerAnchors = document.querySelectorAll(".header a");
      menuParentAnchors.forEach((anchor) => (anchor.style.color = "white"));
      headerAnchors.forEach((anchor) => (anchor.style.color = "white"));
    } else {
      // Reset styles for other classes
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.querySelector(".menuParent").style.backgroundColor = "";
      document.querySelector(".header").style.backgroundColor = "";

      // Reset text color of anchor tags
      const menuParentAnchors = document.querySelectorAll(".menuParent a");
      const headerAnchors = document.querySelectorAll(".header a");
      menuParentAnchors.forEach((anchor) => (anchor.style.color = ""));
      headerAnchors.forEach((anchor) => (anchor.style.color = ""));
    }
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

  reloadCount++;
  localStorage.setItem("reloadCount", reloadCount);

  if (previousResponse) {
    responseSelected = true;
  }

  if (reloadCount >= 4) {
    localStorage.removeItem("previousResponse");
    reloadCount = 0;
    localStorage.setItem("reloadCount", reloadCount);
    responseSelected = false;
  }

  questionDiv.addEventListener("mouseenter", () => {
    if (
      !responseSelected &&
      questionDiv.querySelectorAll(".response").length === 0
    ) {
      const yesSpan = document.createElement("span");
      yesSpan.textContent = "Yes";
      yesSpan.classList.add("response", "Q");

      const noSpan = document.createElement("span");
      noSpan.textContent = "No";
      noSpan.classList.add("response", "Q");

      questionDiv.appendChild(yesSpan);
      questionDiv.appendChild(noSpan);
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
    if (event.target.classList.contains("Q")) {
      if (responseSelected) return;

      const oppositeResponse =
        event.target.textContent === "Yes" ? "No" : "Yes";

      const existingChildSpan = Array.from(
        questionDiv.querySelectorAll("span")
      ).find((span) => span.textContent === `${oppositeResponse} span clicked`);
      if (existingChildSpan) {
        existingChildSpan.remove();
      }

      const newSpan = document.createElement("span");
      if (event.target.textContent === "Yes") {
        newSpan.textContent = "Do you usually do what your told to do?";
      } else {
        newSpan.textContent = "Do you have a hard time doing what's necessary?";
      }
      questionDiv.appendChild(newSpan);

      responseSelected = true;
      localStorage.setItem("previousResponse", event.target.textContent);
    }
  });

  if (responseSelected) {
    questionDiv.querySelectorAll(".response").forEach((span) => span.remove());
  }
});
