class BaseSelector {
  constructor(container) {
    if (!container) {
      console.error("Container not found for BaseSelector");
      return;
    }

    // Store the existing menu items before doing anything else
    this.originalMenuItems = Array.from(container.children);
    console.log("Found original menu items:", this.originalMenuItems.length);

    this.bases = [
      {
        value: "p′",
        name: "Prime",
        sides: 1,
        id: "BasePrime",
        system: "prime",
      },
      { value: "5", name: "Quinary", sides: 5, id: "Base5", system: "quinary" },
      {
        value: "7",
        name: "Septimal",
        sides: 7,
        id: "Base7",
        system: "septimal",
      },
      {
        value: "8*",
        name: "Binary",
        sides: 8,
        id: "base2",
        system: "trueBinary",
      },
      { value: "8", name: "Octal", sides: 8, id: "Base8", system: "octal" },
      {
        value: "10",
        name: "Decimal",
        sides: 10,
        id: "Base10",
        system: "decimal",
      },
      {
        value: "12",
        name: "Dozenal",
        sides: 12,
        id: "Base12",
        system: "duodecimal",
      },
      {
        value: "12*",
        name: "Harmonic",
        sides: 12,
        id: "BaseHarmonic",
        system: "harmonic",
      },
      {
        value: "16",
        name: "Hexadecimal",
        sides: 16,
        id: "Base16",
        system: "hexadecimal",
      },
      {
        value: "20",
        name: "Vigesimal",
        sides: 20,
        id: "Base20",
        system: "vigesimal",
      },
      {
        value: "60",
        name: "Standard",
        sides: 24,
        id: "Base60",
        system: "regular",
      },
      {
        value: "Ψ",
        name: "Quantum Probabilistic",
        sides: 24,
        id: "BaseΨ",
        system: "quantum",
      },
      {
        value: "φ",
        name: "Fibonacci",
        sides: 13,
        id: "Baseφ",
        system: "golden",
      },
      { value: "π", name: "Pi", sides: 31, id: "BasePi", system: "pi" },
    ];

    this.currentIndex = 10;
    this.currentSides = this.bases[this.currentIndex].sides;
    this.targetSides = this.bases[this.currentIndex].sides;

    // Create our new selector UI
    const selectorUI = document.createElement("div");
    selectorUI.className = "base-selector";
    selectorUI.innerHTML = this.createHTML(); // Fixed method name here

    // Insert the selector UI before the existing menu items
    container.insertBefore(selectorUI, container.firstChild);

    // Move original menu items to a hidden container but keep them in the DOM
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.display = "none";
    hiddenContainer.id = "hiddenMenuItems";
    this.originalMenuItems.forEach((item) => hiddenContainer.appendChild(item));
    container.appendChild(hiddenContainer);

    // Get DOM elements
    this.baseValue = selectorUI.querySelector(".base-value");
    this.baseName = selectorUI.querySelector(".base-name");
    this.polygonGroup = selectorUI.querySelector(".polygon-group");
    this.upButton = selectorUI.querySelector(".up-button");
    this.downButton = selectorUI.querySelector(".down-button");

    this.initializeEventListeners();
    this.updateDisplay();
    this.drawPolygon(this.currentSides);
  }

  createHTML() {
    // Changed from createSelectorHTML to createHTML
    return `
        <div class="base-display">
          <div class="base-text">
            <span class="base-prefix">Base</span>
            <span class="base-value"></span>
          </div>
          <div class="base-controls">
            <button class="nav-button up-button">↑</button>
            <button class="nav-button down-button">↓</button>
          </div>
        </div>
        <svg class="base-polygon" viewBox="0 0 250 250">
          <g class="polygon-group"></g>
        </svg>
        <div class="base-name"></div>
      `;
  }

  initializeEventListeners() {
    this.upButton.addEventListener("click", () => this.navigate(-1));
    this.downButton.addEventListener("click", () => this.navigate(1));

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigate(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigate(1);
      }
    });
  }

  navigate(direction) {
    this.currentIndex =
      (this.currentIndex + direction + this.bases.length) % this.bases.length;
    this.targetSides = this.bases[this.currentIndex].sides;
    this.updateDisplay();
    this.animatePolygon();
    this.updateClock();
  }

  updateDisplay() {
    this.baseValue.textContent = this.bases[this.currentIndex].value;
    this.baseName.textContent = this.bases[this.currentIndex].name;

    // Update active state
    const menuItems = document.querySelectorAll(".clockMenuItem");
    menuItems.forEach((item) => item.classList.remove("active"));

    const currentBase = this.bases[this.currentIndex];
    const activeMenuItem = document.getElementById(currentBase.id);
    if (activeMenuItem) {
      activeMenuItem.classList.add("active");
    }
  }

  updateClock() {
    const currentBase = this.bases[this.currentIndex];
    console.log("Updating to base:", currentBase.id);

    // Find the original menu item
    const menuItem = document.querySelector(
      `#hiddenMenuItems #${currentBase.id}`
    );

    if (menuItem) {
      console.log("Found menu item:", menuItem);
      // Directly trigger click event
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      menuItem.dispatchEvent(clickEvent);
    } else {
      console.error("Menu item not found:", currentBase.id);
    }
  }

  drawPolygon(sides) {
    const svgSize = 250;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const radius = svgSize * 0.4;

    this.polygonGroup.innerHTML = "";

    // Draw radial lines
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", centerX);
      line.setAttribute("y1", centerY);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "white");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("opacity", "0.3");
      this.polygonGroup.appendChild(line);
    }

    // Draw polygon
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", points.join(" "));
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "white");
    polygon.setAttribute("stroke-width", "2");
    this.polygonGroup.appendChild(polygon);
  }

  animatePolygon() {
    const startSides = this.currentSides;
    const endSides = this.targetSides;
    const totalSteps = 30;
    let currentStep = 0;

    const animate = () => {
      if (currentStep < totalSteps) {
        const progress = currentStep / totalSteps;
        const easedProgress = progress * progress;
        this.currentSides = Math.round(
          startSides + (endSides - startSides) * easedProgress
        );

        this.drawPolygon(this.currentSides);
        currentStep++;
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

// Add styles
const style = document.createElement("style");
style.textContent = `
  .base-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
  }

  .base-display {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .base-text {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    user-select: none;
  }

  .base-prefix {
    opacity: 0.5;
  }

  .base-value {
    width: 4rem;
    text-align: center;
    font-family: monospace;
  }

  .base-controls {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-button {
    padding: 0.25rem 0.5rem;
    background: transparent;
    border: 1px solid #2b2b2b;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .base-polygon {
    width: 8rem;
    height: 8rem;
  }

  .base-name {
    font-size: 1.125rem;
    opacity: 0.75;
  }
`;

document.head.appendChild(style);

// Initialize only after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing BaseSelector...");
  const menuContainer = document.querySelector("#clockMenu");
  if (menuContainer) {
    console.log("Found menu container, creating BaseSelector");
    window.baseSelector = new BaseSelector(menuContainer);
  } else {
    console.error("Could not find menu container (#clockMenu)");
  }
});
