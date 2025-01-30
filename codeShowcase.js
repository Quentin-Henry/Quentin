const codeExamples = [
  {
    title: "Quantum Probability Time System",
    description:
      "This code creates an experimental time system where clock hands exist in multiple possible positions simultaneously, inspired by quantum mechanics. Unlike traditional clocks that show exact time, this system introduces calculated uncertainty that increases for smaller units of time - seconds are more uncertain than hours, just like quantum particles are more uncertain at smaller scales. This forms the mathematical foundation for the clock's distinctive visual behavior.",
    language: "JavaScript",
    code: `class QuantumTimeSystem extends TimeSystem {
        constructor() {
          super("quantum", "Quantum Probability Time", 50);
          this.planckTime = 5.391e-44; // Planck time in seconds
          this.uncertaintyScale = {
            hours: 0.1, // Lowest uncertainty
            minutes: 0.2, // Medium uncertainty
            seconds: 0.3, // Highest uncertainty
          };
        }
      
        calculateTime(date) {
          const regular = this.getRegularTime(date);
          const dayProgress = this.getDayProgress(date);
      
          // Calculate quantum uncertainties
          const uncertainties = this.calculateUncertainties(regular);
      
          // Generate probability distributions
          const distributions = this.generateDistributions(regular, uncertainties);
      
          // Calculate most probable positions for hands
          const { hourDeg, minuteDeg, secondDeg } = this.calculateHandPositions(
            regular,
            uncertainties
          );
      
          // Format quantum state notation
          const displayText = this.formatQuantumState(regular, uncertainties);
      
          return {
            secondDeg,
            minuteDeg,
            hourDeg,
            displayText,
            extraInfo: this.getQuantumInfo(uncertainties),
            description:
              "The clock's hands exist in multiple positions at once. The uncertainty in each hand's position grows smaller over time, seconds are more uncertain than hours. Based Heisenberg's Uncertainty Principle.",
            // Add probability cloud data for rendering
            probabilityCloud: {
              hours: distributions.hours,
              minutes: distributions.minutes,
              seconds: distributions.seconds,
            },
          };
        }
      
        getRegularTime(date) {
          return {
            hours: date.getHours() % 12,
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            milliseconds: date.getMilliseconds(),
          };
        }
      
        calculateUncertainties(time) {
          // Uncertainty increases for smaller time units
          const timeFactors = {
            hours: Math.sin((time.hours * Math.PI) / 12) * 0.5 + 1,
            minutes: Math.sin((time.minutes * Math.PI) / 30) * 0.5 + 1,
            seconds: Math.sin((time.seconds * Math.PI) / 30) * 0.5 + 1,
          };
      
          return {
            hours: this.uncertaintyScale.hours * timeFactors.hours,
            minutes: this.uncertaintyScale.minutes * timeFactors.minutes,
            seconds: this.uncertaintyScale.seconds * timeFactors.seconds,
          };
        }
      
        generateDistributions(time, uncertainties) {
          const generateGaussian = (mean, uncertainty, points = 360) => {
            const distribution = new Array(points).fill(0);
            for (let i = 0; i < points; i++) {
              const x = (i / points) * 360;
              const delta = (x - mean + 360) % 360;
              const adjustedDelta = delta > 180 ? delta - 360 : delta;
              distribution[i] = Math.exp(
                -(adjustedDelta ** 2) / (2 * uncertainty ** 2)
              );
            }
            return distribution;
          };
      
          return {
            hours: generateGaussian(
              (time.hours * 30 + time.minutes / 2) % 360,
              uncertainties.hours * 30
            ),
            minutes: generateGaussian(
              (time.minutes * 6 + time.seconds / 10) % 360,
              uncertainties.minutes * 6
            ),
            seconds: generateGaussian(
              (time.seconds * 6) % 360,
              uncertainties.seconds * 6
            ),
          };
        }
      
        calculateHandPositions(time, uncertainties) {
          // Add quantum jitter to regular positions
          const jitter = (base, uncertainty) => {
            const randomFactor = (Math.random() - 0.5) * uncertainty;
            return (base + randomFactor + 360) % 360;
          };
      
          return {
            hourDeg: jitter(
              (time.hours * 30 + time.minutes / 2) % 360,
              uncertainties.hours * 30
            ),
            minuteDeg: jitter(
              (time.minutes * 6 + time.seconds / 10) % 360,
              uncertainties.minutes * 6
            ),
            secondDeg: jitter(time.seconds * 6, uncertainties.seconds * 6),
          };
        }
      
        formatQuantumState(time, uncertainties) {
          const formatComponent = (value, uncertainty) => {
            const delta = Math.round(uncertainty * 100) / 100;
            return \`\${value.toString().padStart(2, "0")}±\${delta}\`;
          };
      
          return \`\${formatComponent(
            time.hours,
            uncertainties.hours
          )}:\${formatComponent(
            time.minutes,
            uncertainties.minutes
          )}:\${formatComponent(time.seconds, uncertainties.seconds)}\`;
        }
      
        getQuantumInfo(uncertainties) {
          return \`\${this.baseInfo}\nΔt(h):\${uncertainties.hours.toFixed(
            3
          )} Δt(m):\${uncertainties.minutes.toFixed(
            3
          )} Δt(s):\${uncertainties.seconds.toFixed(3)}\`;
        }
      
        getDayProgress(date) {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const seconds = date.getSeconds();
          const milliseconds = date.getMilliseconds();
          return (
            (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
          );
        }
        getTimeSubdivisions() {
          return {
            hours: "24",
            minutes: "60",
            seconds: "60",
          };
        }
      }`,
  },
  {
    title: "Dynamic Clock Animation System",
    description:
      "The central control system that brings each time concept to life through fluid animations. This code orchestrates the smooth transitions between different counting systems (like switching from regular 12-hour time to binary), manages the clock hands' movements, and ensures each time system's unique mathematical properties are accurately reflected in the interface. It bridges the gap between abstract time concepts and visual representation.",
    language: "JavaScript",
    code: `class ClockController {
        constructor() {
          this.timeSystems = new Map();
          this.currentSystem = null;
          this.setupTimeSystems();
        }
      
        setupTimeSystems() {
          const systems = [
            new RegularTimeSystem(),
            new DecimalTimeSystem(),
            new HexadecimalTimeSystem(),
            new BinaryTimeSystem(),
            new OctalTimeSystem(),
            new FibonacciTimeSystem(),
            new GoldenTimeSystem(),
            new QuantumTimeSystem(),
            new TrueBinaryTimeSystem(),
            new SeptimalTimeSystem(),
            new PrimeTimeSystem(),
            new DuodecimalTimeSystem(),
            new VigesimalTimeSystem(),
            new PiTimeSystem(),
            new HarmonicTimeSystem(),
            new QuinaryTimeSystem(),
          ];
      
          systems.forEach((system) => {
            this.timeSystems.set(system.name, system);
          });
      
          this.currentSystem = this.timeSystems.get("regular");
        }
      
        switchTimeSystem(systemName) {
          const system = this.timeSystems.get(systemName);
          if (system) {
            this.currentSystem = system;
            this.updateClock();
          }
        }
      
        updateClock() {
          const now = new Date();
          const timeData = this.currentSystem.calculateTime(now);
      
          // Update UI elements
          this.updateButtons();
          this.updateTimeDisplay(timeData.displayText);
          this.updateExtraInfo(timeData.extraInfo);
          this.updateDescription(timeData.description);
          this.updateHandRotations(
            timeData.secondDeg,
            timeData.minuteDeg,
            timeData.hourDeg
          );
        }
      
        updateTimeDisplay(text) {
          document.getElementById("timeText").textContent = text;
        }
      
        updateExtraInfo(text) {
          const extraInfoElement = document.getElementById("extraInfo");
          if (extraInfoElement) {
            extraInfoElement.textContent = text;
          }
        }
      
        updateDescription(text) {
          const descriptionElement = document.getElementById("clockDescription");
          if (descriptionElement) {
            descriptionElement.textContent = text;
          }
        }
      
        updateButtons() {
          const subdivisions = this.currentSystem.getTimeSubdivisions();
          const ButtonH = document.getElementById("buttonH");
          ButtonH.innerText = subdivisions.hours + " Hours";
          const ButtonM = document.getElementById("buttonM");
          ButtonM.innerText = subdivisions.minutes + " Minutes";
          const ButtonS = document.getElementById("buttonS");
          ButtonS.innerText = subdivisions.seconds + " Seconds";
          const rotatedImg = document.getElementById("rotatedImg");
          rotatedImg.src = "rotated/Rotated Instances_" + subdivisions.hours + ".png";
        }
      
        updateHandRotations(secondDeg, minuteDeg, hourDeg) {
          // Add CSS transition only to minute and hour hands
          document.querySelector(".minute-hand").style.transition =
            "transform 0.1s linear";
          document.querySelector(".hour-hand").style.transition =
            "transform 0.1s linear";
          document.querySelector(".second-hand").style.transition = "none";
      
          document.querySelector(
            ".second-hand"
          ).style.transform = \`rotate(\${secondDeg}deg)\`;
          document.querySelector(
            ".minute-hand"
          ).style.transform = \`rotate(\${minuteDeg}deg)\`;
          document.querySelector(
            ".hour-hand"
          ).style.transform = \`rotate(\${hourDeg}deg)\`;
        }
      
        startClock() {
          const updateAndSchedule = () => {
            this.updateClock();
            setTimeout(updateAndSchedule, this.currentSystem.intervalMs);
          };
          updateAndSchedule();
        }
      }`,
  },
];

function createCodeShowcase() {
  const container = document.getElementById("code-showcase-root");
  container.className = "code-showcase";

  // Create header
  const header = document.createElement("div");
  header.className = "code-header";
  header.innerHTML = "<h3>Code Samples</h3>";
  container.appendChild(header);

  // Create examples container
  const examplesContainer = document.createElement("div");
  examplesContainer.className = "code-examples";

  codeExamples.forEach((example, index) => {
    const exampleElement = document.createElement("div");
    exampleElement.className = "code-example";

    // Create collapsible button
    const button = document.createElement("button");
    button.className = "code-example-header";
    button.innerHTML = `
        <div class="code-example-title">
          <h4>${example.title}</h4>
          <p>${example.description}</p>
        </div>
        <svg class="chevron" viewBox="0 0 24 24" width="24" height="24">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      `;

    // Create code content
    const content = document.createElement("div");
    content.className = "code-content";
    content.innerHTML = `
        <div class="code-language">${example.language}</div>
        <pre><code>${example.code}</code></pre>
      `;
    content.style.display = "none";

    // Add click handler
    button.addEventListener("click", () => {
      const isExpanded = content.style.display === "block";
      content.style.display = isExpanded ? "none" : "block";
      button.classList.toggle("expanded", !isExpanded);
    });

    exampleElement.appendChild(button);
    exampleElement.appendChild(content);
    examplesContainer.appendChild(exampleElement);
  });

  container.appendChild(examplesContainer);
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", createCodeShowcase);
