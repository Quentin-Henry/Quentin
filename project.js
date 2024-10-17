document.addEventListener("DOMContentLoaded", () => {
  // Select menu items and relevant sections
  const items = document.querySelectorAll(".menu");
  const contentBoxes = document.querySelectorAll(".con");
  const body = document.body;
  const menuParent = document.querySelector(".menuParent");
  const headers = document.querySelectorAll(".header h2");
  const follower = document.getElementById("follower");

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  let isVisible = true; // Track visibility state

  // Text mapping based on menuIdent
  const textMapping = {
    one: "Lanternfly",
    two: "Calatrava",
    three: "Christina",
    four: "New York",
  };

  let currentFollowerText = "Hover over an image"; // Default follower text

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Identify the menu item clicked
      const menuIdent = item.classList[1];

      // Reset styles for all items
      resetStyles();

      // Remove 'menuActive' class from all menu items
      items.forEach((menuItem) => menuItem.classList.remove("menuActive"));

      // Add 'menuActive' class to the clicked menu item
      item.classList.add("menuActive");

      // Change styles and show the corresponding content box
      if (menuIdent === "two") {
        updateStyles("#0139FE", "white", item); // Blue background, white text
        setFollowerTextColor("white"); // Change follower text color to white
        setContentTextColor(index, "white"); // Change text color to white in content box
      } else if (menuIdent === "four") {
        updateStyles("black", "white", item); // Black background, white text
        setFollowerTextColor("white"); // Change follower text color to white
        setContentTextColor(index, "white"); // Change text color to white in content box
      } else {
        setFollowerTextColor("black"); // Default follower text color
        // Only change text color for inactive items
        items.forEach((menuItem) => {
          if (!menuItem.classList.contains("menuActive")) {
            menuItem.style.color = ""; // Reset color for inactive items
          }
        });
      }

      // Show corresponding content box
      showContentBox(index);

      // Update the follower text based on the menuIdent
      currentFollowerText = textMapping[menuIdent] || "Hover over an image"; // Set follower text based on menuIdent
      follower.textContent = currentFollowerText; // Update follower text
    });
  });

  function updateStyles(bgColor, textColor, activeItem) {
    body.style.backgroundColor = bgColor; // Change body background
    // Only change the color of inactive items
    items.forEach((item) => {
      if (item !== activeItem) {
        item.style.color = textColor; // Change menu text color for inactive items
      }
    });
    headers.forEach((header) => (header.style.color = textColor)); // Change header text color
  }

  function resetStyles() {
    body.style.backgroundColor = ""; // Reset body background
    menuParent.style.backgroundColor = ""; // Reset menu background
    items.forEach((item) => {
      item.style.color = ""; // Reset menu text color
    });
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

  function setFollowerTextColor(color) {
    follower.style.color = color; // Change the color of the follower text
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

  // Mouse follower functionality
  document.addEventListener("mousemove", (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
  });

  function updateFollowerPosition() {
    // Move the follower toward the cursor position
    followerX += (mouseX - followerX) * 0.1; // 0.1 for smoothness
    followerY += (mouseY - followerY) * 0.1; // 0.1 for smoothness

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(updateFollowerPosition);
  }

  // Start the animation loop for the follower
  updateFollowerPosition();

  const images = document.querySelectorAll(".image");
  images.forEach((image) => {
    image.addEventListener("mouseover", () => {
      if (isVisible) {
        follower.textContent = image.getAttribute("data-text"); // Show image text
      }
    });

    image.addEventListener("mouseleave", () => {
      if (isVisible) {
        follower.textContent = currentFollowerText; // Restore menuIdent text when not hovering
      }
    });
  });

  // Toggle visibility on click, unless the click is on a button, anchor tag, or element with class 'menu'
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest("button") &&
      !event.target.closest("a") &&
      !event.target.closest(".menu")
    ) {
      isVisible = !isVisible; // Toggle visibility state
      follower.style.display = isVisible ? "block" : "none"; // Show or hide follower
    }
  });
});
