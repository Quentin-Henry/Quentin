const spans = document.querySelectorAll("h2 span");

// Function to randomly change a span's letter
function changeSpan(span) {
  const originalText = span.textContent; // Store the original letter

  // Generate a random letter from the alphabet
  const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
  span.textContent = randomLetter; // Change to random letter

  // Log the change
  console.log(`Changed span from "${originalText}" to "${randomLetter}"`);

  // Set a random duration between 1 and 6 seconds for reverting
  const randomDuration = Math.random() * 5000 + 1000; // 1000ms to 6000ms

  // Revert back to the original letter after the random duration
  setTimeout(() => {
    span.textContent = originalText; // Change back to the original letter
  }, randomDuration);
}

// Function to start random changes for each span
function startRandomChanges() {
  spans.forEach((span) => {
    setInterval(() => {
      // Generate a random chance (0 to 1)
      if (Math.random() < 0.05) {
        // 10% chance to change
        changeSpan(span);
      }
    }, Math.random() * 120000 + 1000); // Random interval between 1 second and 2 minutes
  });
}

// Start the random changes when the page loads
window.onload = startRandomChanges;

// Existing mouseenter event listener code
spans.forEach((span) => {
  const originalText = span.textContent; // Store the original letter

  span.addEventListener("mouseenter", () => {
    // Generate a random letter from the alphabet
    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
    ); // a-z
    span.textContent = randomLetter; // Change to random letter

    // Log the change
    console.log(`Changed span from "${originalText}" to "${randomLetter}"`);

    // Set a random duration between 1 and 4 seconds for reverting
    const randomDuration = Math.random() * 3000 + 1000; // 1000ms to 4000ms

    // Revert back to the original letter after the random duration
    setTimeout(() => {
      span.textContent = originalText; // Change back to the original letter
    }, randomDuration);
  });
});
