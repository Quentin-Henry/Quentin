// Constants
const GAME_STATES = {
  IN_PROGRESS: "in_progress",
  X_WINS: "x_wins",
  O_WINS: "o_wins",
  DRAW: "draw",
};

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

// UI Component class
class GameUI {
  constructor() {
    this.grid = document.getElementById("multiverse-grid");
    this.initializeStyles();
  }

  initializeStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .game-counter {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
  
        .branch-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;
    document.head.appendChild(style);
  }

  createGameCounter() {
    const counter = document.createElement("div");
    counter.id = "game-counter";
    counter.classList.add("game-counter");
    this.grid.prepend(counter);
    return counter;
  }

  updateGameCounter(moved, total) {
    const counter =
      document.getElementById("game-counter") || this.createGameCounter();
    counter.textContent = `Active Games: ${moved}/${total}`;
  }

  createTurnElement(timeline, isInitial = false) {
    const turnElement = document.createElement("div");
    turnElement.classList.add("history-turn");

    this.addStatusIndicator(turnElement, timeline);
    this.addBranchIndicator(turnElement, timeline, isInitial);
    this.addTurnInfo(turnElement, timeline);
    this.addActionButtons(turnElement, timeline);
    this.addGameBoard(turnElement, timeline);

    return turnElement;
  }

  addStatusIndicator(turnElement, timeline) {
    const status = document.createElement("div");
    status.classList.add("status-indicator");
    status.textContent =
      timeline.gameState === GAME_STATES.IN_PROGRESS
        ? "Your Turn"
        : this.getGameEndMessage(timeline.gameState);
    turnElement.appendChild(status);
  }

  addBranchIndicator(turnElement, timeline, isInitial) {
    if (timeline.startColumn > 0 && isInitial) {
      const indicator = document.createElement("div");
      indicator.classList.add("branch-indicator");
      indicator.textContent = "↑";
      turnElement.appendChild(indicator);
    }
  }

  addTurnInfo(turnElement, timeline) {
    const turnInfo = document.createElement("div");
    turnInfo.classList.add("turn-indicator");
    turnInfo.textContent = `Turn ${timeline.turnCount}`;

    const lastMove = timeline.moveHistory[timeline.moveHistory.length - 1];
    if (lastMove) {
      const moveLabel = document.createElement("span");
      moveLabel.classList.add("last-move");
      moveLabel.textContent = ` (${lastMove.player})`;
      turnInfo.appendChild(moveLabel);
    }
    turnElement.appendChild(turnInfo);
  }

  addActionButtons(turnElement, timeline) {
    const container = document.createElement("div");
    container.classList.add("action-buttons");

    const lastMove = timeline.moveHistory[timeline.moveHistory.length - 1];
    if (lastMove && lastMove.player === "O") {
      const branchButton = document.createElement("button");
      branchButton.classList.add("branch-button");
      branchButton.textContent = "Create Timeline";

      const canBranch = !Array.from(TimelineManager.instances.values()).some(
        (t) => t.turnCount === timeline.turnCount && t.id !== timeline.id
      );

      branchButton.disabled = !canBranch;
      branchButton.title = canBranch
        ? "Create new timeline"
        : "Can't create timeline until all active games have moved";

      branchButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const newTimelineId =
          document.querySelectorAll(".timeline-row").length + 1;
        const currentTurnIndex =
          Array.from(timeline.rowElement.children).indexOf(turnElement) - 1;

        // Reconstruct the board state at this historical turn
        const boardAtTurn = timeline.reconstructBoardAtTurn(
          currentTurnIndex - 1
        );
        const historyAtTurn = timeline.moveHistory.slice(
          0,
          currentTurnIndex - 1
        );

        TimelineManager.createTimeline(
          newTimelineId,
          {
            board: boardAtTurn,
            moveHistory: historyAtTurn,
          },
          currentTurnIndex
        );
      });

      container.appendChild(branchButton);
    }

    if (!timeline.isOriginalTimeline) {
      const collapseButton = document.createElement("button");
      collapseButton.classList.add("collapse-button");
      collapseButton.textContent = "Collapse Timeline";
      collapseButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const originalTimeline = TimelineManager.instances.get(1);
        if (originalTimeline) {
          TimelineManager.collapseTimelines(
            timeline,
            originalTimeline,
            turnElement
          );
        }
      });
      container.appendChild(collapseButton);
    }

    turnElement.appendChild(container);
  }

  addGameBoard(turnElement, timeline) {
    console.log("Creating board", {
      isCurrentTurn: turnElement.classList.contains("current-turn"),
      timelineState: timeline.gameState,
    });

    const board = document.createElement("div");
    board.classList.add("history-board");

    timeline.board.forEach((cell, index) => {
      const boardCell = document.createElement("div");
      boardCell.classList.add("history-cell");
      boardCell.textContent = cell || "";

      // Make cell clickable
      boardCell.style.cursor = "pointer";

      // Add click handler to all empty cells in current turn
      boardCell.addEventListener("click", (e) => {
        console.log("Cell clicked:", {
          index,
          isCurrent: turnElement.classList.contains("current-turn"),
          isEmpty: !cell,
        });

        if (turnElement.classList.contains("current-turn") && !cell) {
          timeline.makeMove(index);
        }
      });

      board.appendChild(boardCell);
    });

    turnElement.appendChild(board);
    return board;
  }

  getGameEndMessage(gameState) {
    const messages = {
      [GAME_STATES.X_WINS]: "You win!",
      [GAME_STATES.O_WINS]: "Computer wins!",
      [GAME_STATES.DRAW]: "Draw!",
    };
    return messages[gameState] || "Game Over";
  }
}

// Game Logic class
class GameLogic {
  static checkGameState(board) {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? GAME_STATES.X_WINS : GAME_STATES.O_WINS;
      }
    }

    return board.every((cell) => cell !== null)
      ? GAME_STATES.DRAW
      : GAME_STATES.IN_PROGRESS;
  }

  static findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        const score = this.minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  static minimax(board, depth, isMaximizing) {
    const scores = { O: 10, X: -10, draw: 0 };
    const result = this.checkGameState(board);

    if (result !== GAME_STATES.IN_PROGRESS) {
      return scores[result.split("_")[0]] || 0;
    }

    if (isMaximizing) {
      return this.maximizingMove(board, depth);
    }
    return this.minimizingMove(board, depth);
  }

  static maximizingMove(board, depth) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        bestScore = Math.max(bestScore, this.minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return bestScore;
  }

  static minimizingMove(board, depth) {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        bestScore = Math.min(bestScore, this.minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return bestScore;
  }

  static validateMove(board, index) {
    console.log("Validating move", {
      index,
      currentValue: board[index],
      isValid: index >= 0 && index < 9 && !board[index],
    });
    return index >= 0 && index < 9 && !board[index];
  }
}

// Timeline Management class
class TimelineManager {
  static instances = new Map();
  static activeGames = { total: 0, moved: 0 };

  static createTimeline(id, parentTurn = null, startColumn = 0) {
    const timeline = new Timeline(id, parentTurn, startColumn);
    this.instances.set(id, timeline);
    this.activeGames.total++;
    return timeline;
  }

  static collapseTimelines(sourceTimeline, targetTimeline, turnElement) {
    const currentTurnIndex = this.getTurnIndex(turnElement, sourceTimeline);
    const targetTurn = this.findCorrespondingTurn(
      targetTimeline,
      currentTurnIndex
    );

    if (!targetTurn) {
      throw new Error("No corresponding turn found in target timeline");
    }

    const collapsedBoard = this.quantumCollapse(
      sourceTimeline.board,
      targetTimeline.board
    );
    this.updateTargetTimeline(targetTimeline, collapsedBoard, currentTurnIndex);

    sourceTimeline.rowElement.remove();
    this.instances.delete(sourceTimeline.id);
    this.activeGames.total--;
  }

  static getTurnIndex(turnElement, timeline) {
    return Array.from(timeline.rowElement.children).indexOf(turnElement) - 1;
  }

  static findCorrespondingTurn(timeline, index) {
    return Array.from(timeline.rowElement.children)[index + 1];
  }

  static updateTargetTimeline(timeline, board, turnIndex) {
    timeline.board = board;
    timeline.turnCount = turnIndex + 1;
    timeline.moveHistory = timeline.moveHistory.slice(0, turnIndex);
    timeline.gameState = GAME_STATES.IN_PROGRESS;

    // Remove future turns
    const turns = Array.from(timeline.rowElement.children);
    turns.slice(turnIndex + 2).forEach((turn) => turn.remove());

    // Update current turn
    timeline.currentTurnElement = turns[turnIndex + 1];
    timeline.currentTurnElement.classList.add("current-turn");
  }

  static quantumCollapse(board1, board2) {
    return board1.map((cell1, i) => {
      const cell2 = board2[i];
      if (!cell1 && !cell2) return null;
      if (!cell1 || !cell2) return cell1 || cell2;
      return cell1 === cell2 ? null : cell1;
    });
  }
}

// Main Timeline class
class Timeline {
  constructor(id, parentTurn = null, startColumn = 0) {
    this.id = id;
    this.gameState = GAME_STATES.IN_PROGRESS;
    this.turnCount = startColumn;
    this.startColumn = startColumn;
    this.board = parentTurn ? [...parentTurn.board] : Array(9).fill(null);
    this.moveHistory = parentTurn ? [...parentTurn.moveHistory] : [];
    this.rowElement = null;
    this.currentTurnElement = null;
    this.isOriginalTimeline = id === 1;

    this.ui = new GameUI();
    this.initialize();
  }

  reconstructBoardAtTurn(turnIndex) {
    const board = Array(9).fill(null);

    // Only apply moves up to the specified turn
    for (let i = 0; i <= turnIndex; i++) {
      if (this.moveHistory[i]) {
        const { player, position } = this.moveHistory[i];
        board[position] = player;
      }
    }
    return board;
  }

  initialize() {
    const grid = document.getElementById("multiverse-grid");
    this.rowElement = document.createElement("div");
    this.rowElement.classList.add("timeline-row");
    this.rowElement.dataset.timelineId = this.id;

    const label = document.createElement("div");
    label.classList.add("timeline-label");
    label.textContent = `Timeline ${this.id}`;
    this.rowElement.appendChild(label);

    // Add empty cells for turns before branch point
    for (let i = 0; i < this.startColumn; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("empty-cell");
      this.rowElement.appendChild(emptyCell);
    }

    // Add initial board state and make it current turn for all timelines
    const initialTurn = this.ui.createTurnElement(this, true);
    initialTurn.classList.add("current-turn");
    this.rowElement.appendChild(initialTurn);
    this.currentTurnElement = initialTurn;

    grid.appendChild(this.rowElement);
    this.ui.updateGameCounter(
      TimelineManager.activeGames.moved,
      TimelineManager.activeGames.total
    );
  }

  makeMove(index) {
    if (
      !GameLogic.validateMove(this.board, index) ||
      this.gameState !== GAME_STATES.IN_PROGRESS
    ) {
      return;
    }

    this.board[index] = "X";
    this.moveHistory.push({ player: "X", position: index });
    this.turnCount++;
    TimelineManager.activeGames.moved++; // Track completed moves

    // Update turn display
    if (this.currentTurnElement) {
      this.currentTurnElement.classList.remove("current-turn");
    }
    const newTurn = this.ui.createTurnElement(this);
    newTurn.classList.add("current-turn");
    this.rowElement.appendChild(newTurn);
    this.currentTurnElement = newTurn;

    // Update game counter
    this.ui.updateGameCounter(
      TimelineManager.activeGames.moved,
      TimelineManager.activeGames.total
    );

    if (this.checkGameEnd()) {
      TimelineManager.activeGames.total--; // Remove from active games if ended
      return;
    }

    setTimeout(() => {
      const computerMove = GameLogic.findBestMove(this.board);
      this.executeComputerMove(computerMove);
    }, 500);
  }

  executePlayerMove(index) {
    this.board[index] = "X";
    this.moveHistory.push({ player: "X", position: index });
    this.turnCount++;
    this.updateTurnDisplay();
  }

  executeComputerMove(index) {
    this.board[index] = "O";
    this.moveHistory.push({ player: "O", position: index });
    this.turnCount++;

    if (this.currentTurnElement) {
      this.currentTurnElement.classList.remove("current-turn");
    }
    const newTurn = this.ui.createTurnElement(this);
    newTurn.classList.add("current-turn");
    this.rowElement.appendChild(newTurn);
    this.currentTurnElement = newTurn;

    if (this.checkGameEnd()) {
      TimelineManager.activeGames.total--;
    }

    TimelineManager.activeGames.moved = 0; // Reset move counter after computer's turn
    this.ui.updateGameCounter(
      TimelineManager.activeGames.moved,
      TimelineManager.activeGames.total
    );
  }

  updateTurnDisplay() {
    if (this.currentTurnElement) {
      this.currentTurnElement.classList.remove("current-turn");
    }
    this.currentTurnElement = this.ui.createTurnElement(this);
    this.rowElement.appendChild(this.currentTurnElement);
  }

  checkGameEnd() {
    const newState = GameLogic.checkGameState(this.board);
    if (newState !== GAME_STATES.IN_PROGRESS) {
      this.gameState = newState;
      return true;
    }
    return false;
  }
}

// Initialize game
TimelineManager.createTimeline(1);
