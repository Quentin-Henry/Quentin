document.querySelectorAll(".card").forEach((card) => {
  initializeCard(card);
});

function initializeCard(card) {
  // Apply random rotation
  const randomRotation = Math.floor(Math.random() * 360);
  card.style.transform = `rotate(${randomRotation}deg)`;

  // Set initial position randomly within the viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  // Calculate a random starting position, but within a 10% margin of the viewport
  const margin = 0.1 * viewportWidth; // 10% margin
  const randomX =
    Math.random() * (viewportWidth - cardWidth - 2 * margin) + margin;
  const randomY =
    Math.random() * (viewportHeight - cardHeight - 2 * margin) + margin;

  card.style.left = `${randomX}px`;
  card.style.top = `${randomY}px`;

  // Make the card draggable
  card.addEventListener("mousedown", onMouseDown);

  let offsetX, offsetY;

  function onMouseDown(event) {
    // Save the initial mouse position
    offsetX = event.clientX - card.getBoundingClientRect().left;
    offsetY = event.clientY - card.getBoundingClientRect().top;

    // Attach mousemove and mouseup event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    card.style.cursor = "grabbing";
  }

  function onMouseMove(event) {
    // Calculate the new position
    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    // Get viewport dimensions again in case the window has resized
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    // Define the margin as 10% of the viewport dimensions
    const margin = 0.08 * viewportWidth; // 10% of the viewport width

    // Restrict movement to within the 10% margin boundaries
    newX = Math.min(Math.max(newX, margin), viewportWidth - cardWidth - margin);
    newY = Math.min(
      Math.max(newY, margin),
      viewportHeight - cardHeight - margin
    );

    card.style.left = `${newX}px`;
    card.style.top = `${newY}px`;
  }

  function onMouseUp() {
    // Remove event listeners when mouse button is released
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    card.style.cursor = "grab";
  }
}
