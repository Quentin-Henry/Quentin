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
    five: "digital Sundial",
  };

  let currentFollowerText = "Hover over an image"; // Default follower text

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      const menuIdent = item.classList[1];
      resetStyles();
      items.forEach((menuItem) => menuItem.classList.remove("menuActive"));
      item.classList.add("menuActive");

      if (menuIdent === "two") {
        updateStyles("#0139FE", "white", item);
        setFollowerTextColor("white");
        setContentTextColor(index, "white");
      } else if (menuIdent === "four") {
        updateStyles("black", "white", item);
        setFollowerTextColor("white");
        setContentTextColor(index, "white");
      } else if (menuIdent === "five") {
        updateStyles("black", "white", item);
        setFollowerTextColor("white");
        setContentTextColor(index, "white");
      } else {
        setFollowerTextColor("black");
      }

      showContentBox(index);
      currentFollowerText = textMapping[menuIdent] || "Hover over an image";
      follower.textContent = currentFollowerText;
    });
  });

  function updateStyles(bgColor, textColor, activeItem) {
    body.style.backgroundColor = bgColor;

    items.forEach((item) => {
      if (item !== activeItem) {
        item.style.color = textColor;
      }
    });
    headers.forEach((header) => (header.style.color = textColor));
  }

  function resetStyles() {
    body.style.backgroundColor = "";
    menuParent.style.backgroundColor = "";
    items.forEach((item) => {
      item.style.color = "";
    });
    headers.forEach((header) => (header.style.color = ""));
    contentBoxes.forEach((box) => {
      box.classList.remove("active");
      box.classList.remove("visible");
      box.style.color = "";
    });
  }

  function showContentBox(index) {
    contentBoxes[index].classList.add("active");
    contentBoxes[index].classList.add("visible");
  }

  function setContentTextColor(index, color) {
    contentBoxes[index].style.color = color;
  }

  function setFollowerTextColor(color) {
    follower.style.color = color;
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

  // Mobile behavior
  const isMobile = window.matchMedia("(max-width: 768px)").matches; // Adjust based on your mobile breakpoint
  if (isMobile) {
    // Position follower in the lower right corner on mobile with updated styles
    follower.style.position = "fixed";
    follower.style.bottom = "10%"; // Updated to 10% bottom
    follower.style.right = "10%"; // Updated to 10% right
    follower.style.fontSize = "3vw"; // Updated font size
    follower.style.width = "30vw"; // Updated width
    follower.style.pointerEvents = "none"; // Prevent interaction

    function updateFollowerTextColor() {
      const rect = follower.getBoundingClientRect();
      const x = Math.floor(rect.left + rect.width / 2);
      const y = Math.floor(rect.top + rect.height / 2);
    }

    // Update follower text based on the center image within the active menu
    function updateFollowerTextOnMobile() {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Get the active content box
      const activeContentBox = document.querySelector(".con.active");
      if (!activeContentBox) {
        follower.textContent = "      ";
        console.log("No active content box found.");
        return; // If no active content box, do nothing
      }

      // Get images only from the active content box
      const images = activeContentBox.querySelectorAll(".image");
      if (images.length === 0) {
        follower.textContent = "No images found in the active content box.";
        console.log("No images found in the active content box.");
        return; // If no images found, do nothing
      }

      let closestImage = null;
      let closestDistance = Infinity;

      images.forEach((image) => {
        const rect = image.getBoundingClientRect();
        const imageCenterX = rect.left + rect.width / 2;
        const imageCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(centerX - imageCenterX, 2) +
            Math.pow(centerY - imageCenterY, 2)
        );

        // Log the distance for debugging
        console.log(
          `Distance to ${image.getAttribute("data-text")}: ${distance}`
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestImage = image;
        }
      });

      if (closestImage) {
        follower.textContent = closestImage.getAttribute("data-text");
        console.log(
          "Closest image to center:",
          closestImage.getAttribute("data-text")
        ); // Log closest image text
      } else {
        follower.textContent = "No image found"; // Fallback text
      }

      // Update text color based on the pixels behind
      updateFollowerTextColor();
    }

    // Update follower text on scroll and resizing
    function setupScrollListener() {
      const activeContentBox = document.querySelector(".con.active");
      if (activeContentBox) {
        activeContentBox.removeEventListener(
          "scroll",
          updateFollowerTextOnMobile
        );
        activeContentBox.addEventListener("scroll", () => {
          console.log("Scroll event detected in contentBox."); // Log scroll event
          updateFollowerTextOnMobile(); // Update on scroll
        });
      }
    }

    window.addEventListener("resize", () => {
      updateFollowerTextOnMobile();
      updateFollowerTextColor(); // Update color on resize
    });
    window.addEventListener("load", () => {
      updateFollowerTextOnMobile();
      updateFollowerTextColor(); // Initial color update on load
    });

    // Add click event listeners to menu items
    const items = document.querySelectorAll(".menu");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        updateFollowerTextOnMobile(); // Update follower text on menu item click
        setupScrollListener(); // Setup the scroll listener for the new active content box
      });
    });

    updateFollowerTextOnMobile(); // Additional initial update
    setupScrollListener(); // Setup initial scroll listener
  } else {
    // ... (existing desktop code)

    // ... (rest of the JavaScript code)

    // ... (existing desktop code)

    // ... (rest of the JavaScript code)

    // Regular mouse follower functionality for desktop
    document.addEventListener("mousemove", (event) => {
      mouseX = event.pageX;
      mouseY = event.pageY;
    });

    function updateFollowerPosition() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;

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
  }

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
