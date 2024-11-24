// Create style element for our cursor styles
const embedCursorStyles = document.createElement("style");
document.head.appendChild(embedCursorStyles);
embedCursorStyles.textContent = `
  embed {
    cursor: none !important;
  }

  .embed-cursor {
    width: 24px;
    height: 24px;
    position: fixed;
    pointer-events: none;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.15s ease;
    mix-blend-mode: difference;
    left: 0;
    top: 0;
  }

  .embed-cursor::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .embed-cursor::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: cursorPulse 2s ease-out infinite;
  }

  @keyframes cursorPulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }

  .embed-cursor.active {
    opacity: 1;
  }

  .embed-cursor.clicking {
    transform: scale(0.9);
  }
`;

// Create cursor element
const embedCursor = document.createElement("div");
embedCursor.className = "embed-cursor";
document.body.appendChild(embedCursor);

// Track cursor position globally
function updateEmbedCursor(e) {
  requestAnimationFrame(() => {
    embedCursor.style.left = `${e.clientX}px`;
    embedCursor.style.top = `${e.clientY}px`;
  });
}

// Add global cursor tracking immediately
document.addEventListener("mousemove", updateEmbedCursor);

// Handle mouse interactions with embeds
document.querySelectorAll("embed").forEach((embed) => {
  embed.addEventListener("mouseenter", () => {
    embedCursor.classList.add("active");
  });

  embed.addEventListener("mouseleave", () => {
    embedCursor.classList.remove("active");
  });

  embed.addEventListener("mousedown", () => {
    embedCursor.classList.add("clicking");
  });

  embed.addEventListener("mouseup", () => {
    embedCursor.classList.remove("clicking");
  });
});
