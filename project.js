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
    six: "Tower of Babel",
    seven: "Going Outside",
  };

  const audioEmbed = document.querySelector("#embed2"); // Adjust the selector as necessary
  const embedContainer = document.querySelector("#embedContainer");
  //console.log(audioEmbed);
  let currentFollowerText = "Hover over an image"; // Default follower text

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      const menuIdent = item.classList[1];
      resetStyles();
      items.forEach((menuItem) => menuItem.classList.remove("menuActive"));
      item.classList.add("menuActive");

      if (menuIdent === "two") {
        updateStyles("white", "blue", item);
        setFollowerTextColor("blue");
        setContentTextColor(index, "white");
      } else if (menuIdent === "four") {
        updateStyles("black", "white", item);
        setFollowerTextColor("white");
        setContentTextColor(index, "white");
      } else if (menuIdent === "five") {
        updateStyles("black", "white", item);
        setFollowerTextColor("white");
        setContentTextColor(index, "white");
      } else if (menuIdent === "six") {
        updateStyles("black", "white", item);
        setFollowerTextColor("white");
        setContentTextColor(index, "white");
      } else if (menuIdent === "one") {
        updateStyles("white", "red", item);
        setFollowerTextColor("red");
        setContentTextColor(index, "white");
      } else if (menuIdent === "three") {
        updateStyles("white", "red", item);
        setFollowerTextColor("red");
        setContentTextColor(index, "white");
      } else {
        setFollowerTextColor("black");
      }

      if (menuIdent === "seven") {
        // Try to unmute or control the audio if possible
        if (audioEmbed) {
          embedContainer.innerHTML =
            '<embed id="embed2" data-text="" src="outsideStuff/outside.html" width="100%" height="100%"/>'; // Remove the embed

          audioEmbed.setAttribute("src", "outsideStuff/outside.html"); // Attempt to unmute
        }
      } else {
        if (audioEmbed) {
          embedContainer.innerHTML = ""; // Remove the embed
        }
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

  // Select menu6 and follower2 elements
  const menu6 = document.querySelector(".six");
  const follower2 = document.querySelector("#follower2");

  function updateFollower2Visibility() {
    console.log(menu6.classList); // Log to check class list

    if (menu6.classList.contains("menuActive")) {
      // Position follower in the lower right corner on mobile
      follower2.style.position = "fixed";
      follower2.style.bottom = "7%"; // Updated to 10% from bottom
      follower2.style.left = "2%"; // Updated to 10% from left
      follower2.style.fontSize = "1vw"; // Adjusted font size
      follower2.style.width = "27vw"; // Adjusted width
      follower2.style.pointerEvents = "none"; // Prevent interaction
      follower2.style.color = "white"; // Text color
      console.log("Follower should be on");
      follower2.style.display = "block"; // Show the follower
    } else {
      console.log("Follower should be off");
      follower2.style.display = "none"; // Hide the follower
    }
  }

  // MutationObserver to watch for class changes on the menu
  const observer = new MutationObserver(() => {
    updateFollower2Visibility(); // Call visibility update when class changes
  });

  observer.observe(menu6, {
    attributes: true, // Watch for attribute changes
    attributeFilter: ["class"], // Only look for changes to the 'class' attribute
  });

  // Update follower text based on the center image within the active menu
  function updateFollower2Text() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Get the active content box
    const activeContentBox = document.querySelector(".con.six.active");

    // Debug log to check if the element is being selected
    console.log("Active Content Box: ", activeContentBox);

    if (!activeContentBox) {
      follower2.textContent = "     "; // Default text if no active box found
      console.log("No active content box found.");
      return; // If no active content box, do nothing
    }

    // Get images from the active content box
    const images = activeContentBox.querySelectorAll(".image");
    if (images.length === 0) {
      follower2.textContent = "No images found in the active content box.";
      console.log("No images found in the active content box.");
      return; // If no images, do nothing
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
        `Distance to image with data-description: "${image.getAttribute(
          "data-description"
        )}": ${distance}`
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestImage = image;
      }
    });

    if (closestImage) {
      // Use data-description instead of alt
      const description = closestImage.getAttribute("data-description");
      follower2.textContent = description ? description : "   ";
      console.log("Closest image description:", description); // Log closest image description
    } else {
      follower2.textContent = "No image found"; // Fallback text
    }
  }

  // Setup scroll listener for the active content box
  function setupScrollListener() {
    const activeContentBox = document.querySelector(".con.six.active");
    if (activeContentBox) {
      // Remove previous event listener if it exists
      activeContentBox.removeEventListener("scroll", updateFollower2Text);

      // Add a new event listener for scroll
      activeContentBox.addEventListener("scroll", () => {
        console.log("Scroll event detected in content box."); // Log scroll event
        updateFollower2Text(); // Update follower text on scroll
      });
    } else {
      // If the content box isn't available, retry after a short delay
      setTimeout(setupScrollListener, 100); // Retry after 100ms
    }
  }

  // This function helps to ensure the content box is available before running
  function waitForActiveContentBox() {
    const interval = setInterval(() => {
      const activeContentBox = document.querySelector(".con.active");
      if (activeContentBox) {
        console.log("Active content box found!");
        clearInterval(interval); // Stop the interval once the element is found
        updateFollower2Text(); // Call the function once active box is found
        setupScrollListener(); // Setup the scroll listener once the active box is ready
      }
    }, 100); // Check every 100ms for the active content box

    // If the box is never found, you can log a message for troubleshooting
    setTimeout(() => {
      console.log("No active content box found after waiting.");
      clearInterval(interval); // Stop checking if not found after 5 seconds
    }, 5000);
  }

  // Initial updates
  updateFollower2Visibility(); // Check the visibility of the follower
  waitForActiveContentBox(); // Wait for active content box to appear
});
