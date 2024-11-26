// Select all spans within h2 elements
const spans = document.querySelectorAll("h2 span");

// Function to generate a random letter based on case
function getRandomLetter(isCapital) {
  if (isCapital) {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65); // A-Z
  }
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
}

// Function to randomly change a span's letter with animation timing
function changeSpan(span, duration) {
  const originalText = span.dataset.original || span.textContent; // Use stored original or current text
  const isCapital = span.classList.contains("cap");

  // Store original text as a data attribute if not already stored
  if (!span.dataset.original) {
    span.dataset.original = originalText;
  }

  const randomLetter = getRandomLetter(isCapital);
  span.textContent = randomLetter;

  //console.log(`Changed span from "${originalText}" to "${randomLetter}"`);

  // Clear any existing timeout to prevent conflicts
  if (span.timeout) {
    clearTimeout(span.timeout);
  }

  // Set new timeout and store its ID
  span.timeout = setTimeout(() => {
    span.textContent = originalText;
  }, duration);
}

// Function to start random changes for each span
function startRandomChanges() {
  spans.forEach((span) => {
    // Store original text immediately
    span.dataset.original = span.textContent;

    setInterval(() => {
      if (Math.random() < 0.05) {
        // 5% chance to change
        changeSpan(span, Math.random() * 5000 + 1000); // 1-6 seconds duration
      }
    }, Math.random() * 120000 + 1000); // Random interval between 1 second and 2 minutes
  });
}

// Start the random changes when the page loads
window.addEventListener("load", startRandomChanges);

// Add hover functionality
spans.forEach((span) => {
  // Store original text as a data attribute
  span.dataset.original = span.textContent;

  span.addEventListener("mouseenter", () => {
    const hoverDuration = Math.random() * 3000 + 1000; // 1-4 seconds duration
    changeSpan(span, hoverDuration);
  });
});

const asterixButton = document.getElementById("asterix");
const aboutMeDiv = document.getElementById("aboutMe");

// Hide about me section initially
aboutMeDiv.style.display = "none";

// Toggle function
function toggleAboutMe() {
  // Toggle the active class on the button
  asterixButton.classList.toggle("active");

  // Toggle the visibility of the about me section
  if (aboutMeDiv.style.display === "none") {
    aboutMeDiv.style.display = "block";
    // Optionally add a fade-in effect
    aboutMeDiv.style.opacity = "0";
    setTimeout(() => {
      aboutMeDiv.style.opacity = "1";
    }, 10);
  } else {
    // Fade out then hide
    aboutMeDiv.style.opacity = "0";
    setTimeout(() => {
      aboutMeDiv.style.display = "none";
    }, 300); // Match this with your CSS transition time
  }
}

// Add click event listener to the asterix button
asterixButton.addEventListener("click", toggleAboutMe);

// Add matching CSS styles
const style = document.createElement("style");
style.textContent = `
    #aboutMe {
        transition: opacity 0.3s ease;
    }

    #asterix {
        cursor: pointer;
    }

 
`;
document.head.appendChild(style);
