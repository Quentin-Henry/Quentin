// Global state
let circles = [];
const log = document.getElementById("log");

const gameState = {
  choices: [], // Array of {circleId, size, rank} objects
  currentPath: "initial",
  removedCircles: new Set(),
  currentRankings: [], // Keep track of current rankings
};
// Pattern detection functions
const patterns = {
  alwaysSmallest: (choices) => {
    if (choices.length < 2) return false;
    const lastTwo = choices.slice(-2);

    // Get current rankings for these circles
    const rankings = getRankings();

    // Check if both choices were the smallest when chosen
    return lastTwo.every((choice) => {
      const currentRank = rankings.find((r) => r.id === choice.circleId).rank;
      return currentRank === rankings.length;
    });
  },
  alwaysBiggest: (choices) => {
    if (choices.length < 2) return false;
    const lastTwo = choices.slice(-2);

    // Get current rankings for these circles
    const rankings = getRankings();

    // Check if both were ranked 1 (biggest)
    return lastTwo.every((choice) => {
      const currentRank = rankings.find((r) => r.id === choice.circleId).rank;
      return currentRank === 1;
    });
  },
};

// Question paths configuration
const questionPaths = {
  initial: {
    question: "Which one is better?",
    effect: null,
    nextPath: (state) => {
      if (state.choices.length === 1) return "second";
      return "standard";
    },
  },
  second: {
    question: "How about now?",
    effect: null,
    nextPath: (state) => {
      // Log the pattern check results for debugging
      console.log("Checking patterns:", {
        choices: state.choices,
        isSmallest: patterns.alwaysSmallest(state.choices),
        isBiggest: patterns.alwaysBiggest(state.choices),
      });

      if (patterns.alwaysSmallest(state.choices)) {
        console.log("Smallest pattern detected!");
        return "smallestTwice";
      }
      if (patterns.alwaysBiggest(state.choices)) {
        console.log("Biggest pattern detected!");
        return "biggestTwice";
      }
      return "friendly";
    },
  },
  smallestTwice: {
    question: "I dont like that one, choose one of these",
    effect: (circles, state) => {
      // Get the last clicked circle
      const lastChoice = state.choices[state.choices.length - 1];

      // Log the removal action
      console.log("Removing circle:", lastChoice);

      // Add to removed set
      state.removedCircles.add(lastChoice.circleId);

      // Filter out the removed circle and update the DOM
      const circleToRemove = circles.find((c) => c.id === lastChoice.circleId);
      if (circleToRemove && circleToRemove.element) {
        circleToRemove.element.remove();
      }

      return circles.filter((circle) => !state.removedCircles.has(circle.id));
    },
    nextPath: () => "standard",
  },
  biggestTwice: {
    question: "Would it be harder to choose if they were all the same size?",
    effect: (circles, state) => {
      const smallestSize = Math.min(...circles.map((c) => c.size));
      circles.forEach((circle) => {
        circle.size = smallestSize;
        circle.element.style.width = `${smallestSize}px`;
        circle.element.style.height = `${smallestSize}px`;
      });
      return circles;
    },
    nextPath: () => "standard",
  },
  friendly: {
    question: "Which one is friendliest?",
    effect: null,
    nextPath: () => "standard",
  },
  standard: {
    question: (state) => `Which one is better? (${circles.length} choices)`,
    effect: null,
    nextPath: () => "standard",
  },
};

function logMessage(message) {
  const time = new Date().toLocaleTimeString();
  log.innerHTML = `[${time}] ${message}<br>${log.innerHTML}`;
}

function getRankings() {
  gameState.currentRankings = [...circles]
    .sort((a, b) => b.size - a.size)
    .map((circle, index) => ({
      id: circle.id,
      size: circle.size,
      rank: index + 1,
    }));
  return gameState.currentRankings;
}

function checkOverlap(x, y, size) {
  for (let circle of circles) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < size / 2 + circle.size / 2) {
      return true;
    }
  }
  return false;
}

function findValidPosition(size) {
  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    const x = Math.random() * maxX;
    const y = Math.max(100, Math.random() * maxY);

    if (!checkOverlap(x, y, size)) {
      return { x, y };
    }
    attempts++;
  }

  return {
    x: Math.random() * (window.innerWidth - size),
    y:
      Math.max(window.innerHeight / 2, ...circles.map((c) => c.y + c.size)) +
      size,
  };
}

function createCircle(isInitial = false, forcedSize = null) {
  const circle = document.createElement("div");
  circle.className = "circle";

  const size = forcedSize !== null ? forcedSize : Math.random() * 100 + 50;
  const position = findValidPosition(size);

  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = `${position.x}px`;
  circle.style.top = `${position.y}px`;

  const circleData = {
    id: circles.length + 1,
    size: size,
    x: position.x,
    y: position.y,
    element: circle,
  };

  circles.push(circleData);
  circle.addEventListener("click", () => handleChoice(circleData));
  document.body.appendChild(circle);

  const rankings = getRankings();
  const thisCircle = rankings.find((c) => c.id === circleData.id);
  logMessage(
    `New circle created: #${circleData.id} (Size: ${size.toFixed(1)}px, Rank: ${
      thisCircle.rank
    } of ${circles.length})`
  );
}

function handleChoice(clickedCircle) {
  const rankings = getRankings();
  const clickedRanking = rankings.find((r) => r.id === clickedCircle.id);

  // Record choice with current ranking
  const choice = {
    circleId: clickedCircle.id,
    size: clickedCircle.size,
    rank: clickedRanking.rank,
    totalCircles: circles.length, // Store total circles at time of choice
  };
  gameState.choices.push(choice);

  console.log("Choice made:", {
    circleId: choice.circleId,
    currentRank: clickedRanking.rank,
    totalCircles: circles.length,
    allRankings: rankings,
  });

  logMessage(`Circle #${clickedCircle.id} clicked!
           Size: ${clickedCircle.size.toFixed(1)}px
           Rank: ${clickedRanking.rank} of ${circles.length}`);

  // Get current path and determine next path
  const currentPathConfig = questionPaths[gameState.currentPath];
  const nextPath = currentPathConfig.nextPath(gameState);

  // Apply any effects from the next path
  if (questionPaths[nextPath].effect) {
    circles = questionPaths[nextPath].effect(circles, gameState);
  }

  // Update game state
  gameState.currentPath = nextPath;

  // Update question text
  const nextQuestion = questionPaths[nextPath].question;
  document.getElementById("question").textContent =
    typeof nextQuestion === "function" ? nextQuestion(gameState) : nextQuestion;

  // Create new circle if no effect was applied
  if (!questionPaths[nextPath].effect) {
    createCircle(false);
  }
}

// Initialize game
const largeSize = 150;
const smallSize = 50;
createCircle(true, largeSize);
createCircle(true, smallSize);

// Log initial state
logMessage("Quiz started with 2 circles (predetermined sizes)");
const initialRankings = getRankings();
logMessage(
  `Rankings: ${initialRankings
    .map((c) => `\nCircle #${c.id}: ${c.size.toFixed(1)}px (Rank ${c.rank})`)
    .join("")}`
);
