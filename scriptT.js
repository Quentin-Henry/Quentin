document.addEventListener("DOMContentLoaded", () => {
  // Select all video containers
  const videoContainers = document.querySelectorAll(".video-container");

  videoContainers.forEach((container) => {
    const video = container.querySelector("video");
    const audio = container.querySelector("audio");

    // Function to play audio and change opacity
    function playAudio() {
      audio.currentTime = 0; // Reset audio to start
      audio.play();
      video.classList.add("hovered"); // Increase opacity
    }

    // Function to pause audio and reset opacity
    function pauseAudio() {
      audio.pause();
      video.classList.remove("hovered"); // Reset opacity
    }

    // Add event listeners for hover
    container.addEventListener("mouseover", playAudio);
    container.addEventListener("mouseleave", pauseAudio);
  });
});
