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
    currentIndex = 0; // Start at the first image if none are displayed
  }

  images[currentIndex].style.display = "none";

  currentIndex = (currentIndex + direction + totalImages) % totalImages;

  images[currentIndex].style.display = "block";
}

// Initialize the carousels by showing the first image
document.querySelectorAll(".carousel-images").forEach((images) => {
  const imagesArray = images.querySelectorAll(".carousel-image");
  imagesArray.forEach((image, index) => {
    if (index !== 0) image.style.display = "none";
  });
});

function playPauseVideo() {
  let videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.muted = true;

    let playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then((_) => {
        let observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio !== 1 && !video.paused) {
                video.pause();
              } else if (video.paused) {
                video.play();
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(video);
      });
    }
  });
}

playPauseVideo();
