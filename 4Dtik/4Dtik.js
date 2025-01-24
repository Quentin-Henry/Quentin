class Timeline {
  static instances = new Map();
  static activeGames = {
    total: 0,
    moved: 0,
  };

  constructor(id, parentTurn = null, startColumn = 0) {
    this.id = id;
    this.currentPlayer = "X";
    this.gameOver = false;
    this.turnCount = startColumn;
    this.startColumn = startColumn;
    this.rowElement = null;
    this.currentTurnElement = null;
    this.isOriginalTimeline = id === 1; // Track if this is Timeline 1

    // Initialize from parent turn if it exists
    if (parentTurn) {
      this.board = [...parentTurn.board];
      this.moveHistory = [...parentTurn.moveHistory];
    } else {
      this.board = Array(9).fill(null);
      this.moveHistory = [];
    }
    Timeline.instances.set(id, this);
    this.initializeTimeline();
    Timeline.activeGames.total++;
    this.hasMoved = false;

    this.updateGameCounter();
  }

  updateGameCounter() {
    const counter =
      document.getElementById("game-counter") || this.createGameCounter();
    counter.textContent = `Active Games: ${Timeline.activeGames.moved}/${Timeline.activeGames.total}`;
  }

  createGameCounter() {
    const counter = document.createElement("div");
    counter.id = "game-counter";
    counter.classList.add("game-counter");
    document.getElementById("multiverse-grid").prepend(counter);
    return counter;
  }
  initializeTimeline() {
    const grid = document.getElementById("multiverse-grid");

    this.rowElement = document.createElement("div");
    this.rowElement.classList.add("timeline-row");
    this.rowElement.dataset.timelineId = this.id;

    const label = document.createElement("div");
    label.classList.add("timeline-label");
    label.textContent = `Timeline ${this.id}`;
    this.rowElement.appendChild(label);

    // Add empty cells for turns before the branch point
    for (let i = 0; i < this.startColumn; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("empty-cell");
      this.rowElement.appendChild(emptyCell);
    }

    // Add the initial board state for this timeline
    const initialTurn = this.createTurnElement(true);
    this.rowElement.appendChild(initialTurn);
    this.currentTurnElement = initialTurn;

    grid.appendChild(this.rowElement);
  }

  collapseTimelines(selectedTurn, originalTimeline) {
    const currentTurnIndex =
      Array.from(this.rowElement.children).indexOf(selectedTurn) - 1;
    const originalTimelineRow = document.querySelector(
      '[data-timeline-id="1"]'
    );
    const originalTurns = Array.from(originalTimelineRow.children);

    // Find corresponding turn in original timeline
    const correspondingTurn = originalTurns[currentTurnIndex + 1]; // +1 for label offset

    if (!correspondingTurn) {
      alert("No corresponding turn found in the original timeline!");
      return;
    }

    // Get both board states
    const selectedBoard = [...this.board];
    const originalBoard = originalTimeline.board;

    // Apply quantum collapse rules
    const collapsedBoard = this.quantumCollapse(selectedBoard, originalBoard);

    // Update original timeline's board
    originalTimeline.board = collapsedBoard;

    // Remove ONLY future turns in original timeline after collapse point
    const turnsToRemove = Array.from(originalTimelineRow.children).slice(
      currentTurnIndex + 2
    ); // +2 for label and to start after current turn
    turnsToRemove.forEach((turn) => turn.remove());

    // Update the visual representation in the original timeline
    const originalBoardElement =
      correspondingTurn.querySelector(".history-board");
    Array.from(originalBoardElement.children).forEach((cell, index) => {
      cell.textContent = collapsedBoard[index] || "";
    });

    // Update original timeline's state to continue from this point
    originalTimeline.turnCount = currentTurnIndex + 1;
    originalTimeline.moveHistory = originalTimeline.moveHistory.slice(
      0,
      currentTurnIndex
    );
    originalTimeline.gameOver = false;
    originalTimeline.currentTurnElement = correspondingTurn;

    originalTimeline.rowElement
      .querySelectorAll(".current-turn")
      .forEach((el) => {
        // Find and update the status of the previous turn
        const status = el.querySelector(".status-indicator");
        if (status) {
          status.textContent = "Past"; // Update to "Past"
        }
        el.classList.remove("current-turn");
      });

    // Add current-turn class to the corresponding turn
    correspondingTurn.classList.add("current-turn");

    // Update status indicator for the current turn
    const status = correspondingTurn.querySelector(".status-indicator");
    if (status) {
      status.textContent = "bs"; // Update to "Your Turn"
    }

    // Remove only this timeline's row
    this.rowElement.remove();

    // Clear the game over state if it exists
    originalTimeline.gameOver = false;
  }
  // Add quantum collapse logic
  quantumCollapse(board1, board2) {
    const collapsedBoard = Array(9).fill(null);

    for (let i = 0; i < 9; i++) {
      const cell1 = board1[i];
      const cell2 = board2[i];

      if (!cell1 && !cell2) {
        // Both empty
        collapsedBoard[i] = null;
      } else if (!cell1 || !cell2) {
        // One empty, one filled
        collapsedBoard[i] = cell1 || cell2;
      } else if (cell1 === cell2) {
        // Same pieces cancel out
        collapsedBoard[i] = null;
      } else {
        // Opposite pieces switch
        collapsedBoard[i] = cell1;
      }
    }

    return collapsedBoard;
  }

  createTurnElement(isInitial = false) {
    const turnElement = document.createElement("div");
    turnElement.classList.add("history-turn");

    const lastMove = this.moveHistory[this.moveHistory.length - 1];
    if (lastMove) {
      turnElement.classList.add(lastMove.player === "X" ? "x-turn" : "o-turn");
    }

    if (!this.gameOver) {
      turnElement.classList.add("current-turn");
    }

    // Status indicator
    const status = document.createElement("div");
    status.classList.add("status-indicator");
    status.textContent = this.gameOver ? "Game Over" : "Your Turn";
    turnElement.appendChild(status);

    // Branch indicator for initial branched turns
    if (this.startColumn > 0 && isInitial) {
      const branchIndicator = document.createElement("div");
      branchIndicator.classList.add("branch-indicator");
      branchIndicator.textContent = "↑";
      turnElement.appendChild(branchIndicator);
    }

    // Turn info
    const turnInfo = document.createElement("div");
    turnInfo.classList.add("turn-indicator");
    turnInfo.textContent = `Turn ${this.turnCount}`;
    if (lastMove) {
      const moveLabel = document.createElement("span");
      moveLabel.classList.add("last-move");
      moveLabel.textContent = ` (${lastMove.player})`;
      turnInfo.appendChild(moveLabel);
    }
    turnElement.appendChild(turnInfo);

    // Action buttons container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action-buttons");
    turnElement.appendChild(buttonContainer);

    // Branch button
    if (
      !turnElement.classList.contains("History-turn") &&
      lastMove &&
      lastMove.player === "O"
    ) {
      const branchButton = document.createElement("button");
      branchButton.classList.add("branch-button");
      branchButton.textContent = "Create Timeline";

      const canBranch = !Array.from(Timeline.instances.values()).some(
        (timeline) =>
          timeline.turnCount === this.turnCount && timeline.id !== this.id
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
          Array.from(this.rowElement.children).indexOf(turnElement) - 1;

        const boardAtThisTurn = Array(9).fill(null);
        for (let i = 0; i < currentTurnIndex; i++) {
          const move = this.moveHistory[i];
          if (move && move.position !== undefined) {
            boardAtThisTurn[move.position] = move.player;
          }
        }

        const moveHistoryAtThisTurn = this.moveHistory.slice(
          0,
          currentTurnIndex
        );

        new Timeline(
          newTimelineId,
          {
            board: boardAtThisTurn,
            moveHistory: moveHistoryAtThisTurn,
          },
          currentTurnIndex
        );
      });
      buttonContainer.appendChild(branchButton);
    }

    // Collapse button
    if (!this.isOriginalTimeline) {
      const collapseButton = document.createElement("button");
      collapseButton.classList.add("collapse-button");
      collapseButton.textContent = "Collapse Timeline";
      collapseButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const originalTimeline = this.findOriginalTimeline();
        if (originalTimeline) {
          this.collapseTimelines(turnElement, originalTimeline);
        }
      });
      buttonContainer.appendChild(collapseButton);
    }

    // Game board
    const board = document.createElement("div");
    board.classList.add("history-board");

    this.board.forEach((cell, index) => {
      const historyCell = document.createElement("div");
      historyCell.classList.add("history-cell");
      historyCell.textContent = cell || "";

      if (!this.gameOver && !this.hasMoved) {
        historyCell.addEventListener("click", () => {
          if (!cell && turnElement.classList.contains("current-turn")) {
            this.makeMove(index);
          }
        });
      }

      board.appendChild(historyCell);
    });

    turnElement.appendChild(board);
    return turnElement;
  }

  lastMove;
  reconstructBoardState(moveHistory) {
    const board = Array(9).fill(null);
    const moves = [...moveHistory];
    moves.forEach((player, index) => {
      board[this.moveHistory[index].position] = player;
    });
    return board;
  }

  // Also update the makeMove method to ensure consistent move history structure
  makeMove(index) {
    if (this.board[index] || this.gameOver) return;

    if (this.currentTurnElement) {
      this.currentTurnElement.classList.remove("current-turn");
    }

    // Human move
    this.board[index] = "X";
    this.moveHistory.push({ player: "X", position: index });
    this.turnCount++;

    const newTurn = this.createTurnElement();
    this.rowElement.appendChild(newTurn);
    this.currentTurnElement = newTurn;

    if (this.checkWinner("X")) {
      this.endGame("You win!");
      return;
    }

    if (this.isBoardFull()) {
      this.endGame("Draw!");
      return;
    }

    // Computer move
    setTimeout(() => {
      const computerMove = this.findBestMove();
      this.board[computerMove] = "O";
      this.moveHistory.push({ player: "O", position: computerMove });
      this.turnCount++;

      if (this.currentTurnElement) {
        this.currentTurnElement.classList.remove("current-turn");
      }

      const computerTurn = this.createTurnElement();
      this.rowElement.appendChild(computerTurn);
      this.currentTurnElement = computerTurn;

      if (this.checkWinner("O")) {
        this.endGame("Computer wins!");
        return;
      }

      if (this.isBoardFull()) {
        this.endGame("Draw!");
        return;
      }
    }, 500);
  }

  computerMove() {
    // Extract computer move logic from makeMove into this new method
    const computerMove = this.findBestMove();
    this.board[computerMove] = "O";
    this.moveHistory.push({ player: "O", position: computerMove });
    this.turnCount++;

    if (this.currentTurnElement) {
      this.currentTurnElement.classList.remove("current-turn");
    }

    const computerTurn = this.createTurnElement();
    this.rowElement.appendChild(computerTurn);
    this.currentTurnElement = computerTurn;

    if (this.checkWinner("O")) {
      this.endGame("Computer wins!");
    } else if (this.isBoardFull()) {
      this.endGame("Draw!");
    }
  }

  findBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = "O";
        let score = this.minimax(this.board, 0, false);
        this.board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  minimax(board, depth, isMaximizing) {
    const scores = {
      O: 10,
      X: -10,
      draw: 0,
    };

    const result = this.checkGameState(board);
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "O";
          let score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "X";
          let score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  checkGameState(board) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "draw";
    }

    return null;
  }

  checkWinner(player) {
    return this.checkGameState(this.board) === player;
  }

  isBoardFull() {
    return this.board.every((cell) => cell !== null);
  }

  endGame(message) {
    this.gameOver = true;
    if (this.currentTurnElement) {
      this.currentTurnElement.classList.remove("current-turn");
      const status = this.currentTurnElement.querySelector(".status-indicator");
      if (status) {
        status.textContent = message;
      }
    }
  }
  findOriginalTimeline() {
    const originalTimelineRow = document.querySelector(
      '[data-timeline-id="1"]'
    );
    return Timeline.instances.get(1);
  }

  checkGameStatus() {
    if (this.checkWinner("X")) {
      this.endGame("X wins!");
    } else if (this.checkWinner("O")) {
      this.endGame("O wins!");
    } else if (this.isBoardFull()) {
      this.endGame("Draw!");
    }
  }
}

// Initialize the first timeline
new Timeline(1);

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
