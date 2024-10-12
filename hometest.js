const spans = document.querySelectorAll("h2 span");

// Function to change a random number of spans to random letters
function changeRandomSpans() {
  // Favor changing fewer spans (1 or 2) but allow up to 10
  const numberOfChanges =
    Math.random() < 0.7
      ? Math.floor(Math.random() * 2) + 1 // 1 or 2 with 70% probability
      : Math.floor(Math.random() * 10) + 1; // Up to 10

  const changedIndices = new Set(); // Track changed indices to avoid duplicates

  for (let i = 0; i < numberOfChanges; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * spans.length);
    } while (changedIndices.has(randomIndex)); // Ensure unique index

    changedIndices.add(randomIndex);
    const span = spans[randomIndex];
    const originalText = span.textContent; // Store the original letter

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
  }
}

// Function to change a random number of spans at random intervals between 1 and 20 seconds
function startRandomChanges() {
  setInterval(() => {
    changeRandomSpans();
  }, Math.random() * 19000 + 1000); // 1000ms to 20000ms
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
