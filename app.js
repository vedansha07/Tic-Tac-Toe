let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

// Player and AI symbols
let player = "O";
let ai = "X";
let count = 0; // Track moves for detecting draw

// Winning patterns in tic-tac-toe
const winPatterns = [
  [0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7],
  [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]
];

// Reset game state
const resetGame = () => {
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};

// Add event listener to each box for player move
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText === "") {
      box.innerText = player;
      box.disabled = true;
      count++;
      if (checkWinner()) return;
      if (count < 9) {
        setTimeout(aiMove, 250); // AI moves after 0.25 seconds
      }
    }
  });
});

// AI move using Minimax or random move (20% chance of mistake -> changed to 80% win probability)
const aiMove = () => {
  let bestMove;
  if (Math.random() < 0.8) {
    // 80% chance AI picks the best move
    bestMove = minimax([...boxes].map((b) => b.innerText), ai).index;
  } else {
    // 20% chance AI makes a random move
    let availableMoves = [...boxes].map((b, i) => (b.innerText === "" ? i : null)).filter(i => i !== null);
    bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  if (bestMove !== -1) {
    boxes[bestMove].innerText = ai;
    boxes[bestMove].disabled = true;
    count++;
    checkWinner();
  }
};

// Minimax algorithm to calculate best move for AI
const minimax = (board, currentPlayer) => {
  let availableSpots = board.map((val, idx) => (val === "" ? idx : null)).filter((val) => val !== null);

  if (checkWin(board, player)) return { score: -10 };
  if (checkWin(board, ai)) return { score: 10 };
  if (availableSpots.length === 0) return { score: 0 };

  let moves = [];
  for (let spot of availableSpots) {
    let move = { index: spot };
    board[spot] = currentPlayer;
    move.score = currentPlayer === ai ? minimax(board, player).score : minimax(board, ai).score;
    board[spot] = "";
    moves.push(move);
  }

  return moves.reduce((bestMove, move) => {
    if ((currentPlayer === ai && move.score > bestMove.score) ||
        (currentPlayer === player && move.score < bestMove.score)) {
      return move;
    }
    return bestMove;
  }, { score: currentPlayer === ai ? -Infinity : Infinity });
};

// Check if a player has won
const checkWin = (board, currentPlayer) => {
  return winPatterns.some(pattern => pattern.every(index => board[index] === currentPlayer));
};

// Determine game outcome
const checkWinner = () => {
  let board = [...boxes].map((b) => b.innerText);
  if (checkWin(board, player)) {
    showWinner(player);
    return true;
  }
  if (checkWin(board, ai)) {
    showWinner(ai);
    return true;
  }
  if (count === 9) {
    gameDraw();
    return true;
  }
  return false;
};

// Handle game draw
const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Disable all boxes
const disableBoxes = () => {
  boxes.forEach(box => box.disabled = true);
};

// Enable all boxes and clear text
const enableBoxes = () => {
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Display winner message
const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Event listeners for buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
