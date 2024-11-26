const contentWrap = document.querySelector(".pageContentwrap");
const paragraphs = document.querySelectorAll(".contentParagraph");
const contentHeader = document.querySelector(".contentHeader");
const mainHeader = document.querySelector(".header");
const headers = document.querySelectorAll("h1, h2, h3");

// Initial load animations
function handleInitialLoad() {
  headers.forEach((header) => {
    header.classList.add("fade-initial");
    setTimeout(() => {
      header.classList.add("fade-in");
      header.dataset.hasAnimated = "true";
    }, 100);
  });

  paragraphs.forEach((paragraph) => {
    paragraph.classList.add("fade-initial");
    setTimeout(() => {
      paragraph.classList.add("fade-in");
      paragraph.dataset.hasAnimated = "true";
    }, 100);
  });
}

handleInitialLoad();

// Intersection Observer for elements that come into view later
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.hasAnimated) {
        entry.target.classList.add("fade-in");
        entry.target.dataset.hasAnimated = "true";
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: contentWrap,
    threshold: 0.1,
  }
);

// Observe elements
headers.forEach((header) => {
  if (!header.dataset.hasAnimated) fadeObserver.observe(header);
});

paragraphs.forEach((paragraph) => {
  if (!paragraph.dataset.hasAnimated) fadeObserver.observe(paragraph);
});

// Improved scroll animation setup
let lastScrollTop = contentWrap.scrollTop;
let scrollVelocity = 0;
const opacityThreshold = 20;

// Add a scroll direction tracker
let scrollDirection = 0; // 1 for down, -1 for up

contentWrap.addEventListener("scroll", () => {
  // Header opacity logic
  if (contentWrap.scrollTop < opacityThreshold) {
    mainHeader.style.opacity = "1";
  } else {
    mainHeader.style.opacity = "0.3";
  }

  // Calculate scroll velocity and direction
  const currentScrollTop = contentWrap.scrollTop;
  const scrollDelta = currentScrollTop - lastScrollTop;

  // Update scroll direction
  scrollDirection = scrollDelta > 0 ? 1 : -1;

  // Calculate velocity (reduced magnitude for smoother effect)
  scrollVelocity = scrollDelta * -0.1;

  lastScrollTop = currentScrollTop;
});

function animate() {
  paragraphs.forEach((paragraph) => {
    // Ensure the scroll wrapper exists
    let wrapper = paragraph.querySelector(".scroll-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "scroll-wrapper";
      wrapper.innerHTML = paragraph.innerHTML;
      paragraph.innerHTML = "";
      paragraph.appendChild(wrapper);
    }

    const rect = paragraph.getBoundingClientRect();
    const viewportCenter = contentWrap.clientHeight / 2;

    // Check if element is being scrolled past (below viewport center)
    const isBeingScrolledPast = rect.top < viewportCenter;

    if (rect.top < contentWrap.clientHeight && rect.bottom > 0) {
      // Only apply animation to elements being scrolled past
      if (isBeingScrolledPast) {
        // Apply consistent direction based on scroll direction
        const adjustedVelocity = Math.abs(scrollVelocity) * scrollDirection;
        wrapper.style.transform = `translateY(${adjustedVelocity}px)`;
      } else {
        // Reset transform for elements above viewport center
        wrapper.style.transform = "translateY(0)";
      }
    }
  });

  // Decay the scroll velocity more gradually
  scrollVelocity *= 0.85;

  requestAnimationFrame(animate);
}

animate();
