// Words for the waterpark theme
const words = ["WAVE", "SLIDE", "POOL", "FLOAT", "SPLASH", "DIVING", "LIFEGUARD", "SUN", "TOWEL", "WATER"];

// Wordsearch grid dimensions
const gridSize = 10;
const grid = [];
const wordListElement = document.getElementById("word-list");
const gridElement = document.getElementById("wordsearch-grid");

// State to track selected letters
let selectedLetters = [];
let selectedCells = [];

// Fill the word list
words.forEach(word => {
  const listItem = document.createElement("li");
  listItem.textContent = word;
  wordListElement.appendChild(listItem);
});

// Generate empty grid
for (let i = 0; i < gridSize; i++) {
  grid[i] = Array(gridSize).fill("");
}

// Randomly place words in the grid
function placeWords() {
  words.forEach(word => {
    let placed = false;
    while (!placed) {
      const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (direction === "horizontal" && col + word.length <= gridSize) {
        if (canPlaceWord(row, col, word, direction)) {
          placeWord(row, col, word, direction);
          placed = true;
        }
      } else if (direction === "vertical" && row + word.length <= gridSize) {
        if (canPlaceWord(row, col, word, direction)) {
          placeWord(row, col, word, direction);
          placed = true;
        }
      }
    }
  });
}

// Check if a word can be placed
function canPlaceWord(row, col, word, direction) {
  for (let i = 0; i < word.length; i++) {
    if (direction === "horizontal" && grid[row][col + i] !== "" && grid[row][col + i] !== word[i]) {
      return false;
    }
    if (direction === "vertical" && grid[row + i][col] !== "" && grid[row + i][col] !== word[i]) {
      return false;
    }
  }
  return true;
}

// Place a word on the grid
function placeWord(row, col, word, direction) {
  for (let i = 0; i < word.length; i++) {
    if (direction === "horizontal") {
      grid[row][col + i] = word[i];
    } else {
      grid[row + i][col] = word[i];
    }
  }
}

// Fill empty spaces with random letters
function fillGrid() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === "") {
        grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      }
    }
  }
}

// Render the grid to the DOM
function renderGrid() {
  gridElement.innerHTML = "";
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.textContent = grid[row][col];
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.classList.add("cell");
      cell.addEventListener("click", handleCellClick);
      gridElement.appendChild(cell);
    }
  }
}

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  // Check if already selected
  if (selectedCells.includes(cell)) return;

  // Highlight the cell
  cell.classList.add("highlighted");
  selectedLetters.push(grid[row][col]);
  selectedCells.push(cell);

  // Check if the selected letters form a word
  const currentWord = selectedLetters.join("");
  if (words.includes(currentWord)) {
    // Keep the letters permanently highlighted
    selectedCells.forEach(cell => {
      cell.classList.add("found");
      cell.classList.remove("highlighted");
    });

    // Remove the word from the list
    const wordIndex = words.indexOf(currentWord);
    if (wordIndex !== -1) {
      words.splice(wordIndex, 1);
      updateWordList();
    }

    // Reset selection
    selectedLetters = [];
    selectedCells = [];
  } else if (!isWordPrefix(currentWord)) {
    // Clear incorrect selection
    selectedLetters = [];
    selectedCells.forEach(cell => cell.classList.remove("highlighted"));
    selectedCells = [];
  }
}

// Check if a string is a prefix of any word in the list
function isWordPrefix(prefix) {
  return words.some(word => word.startsWith(prefix));
}

// Update the word list in the DOM
function updateWordList() {
  wordListElement.innerHTML = "";
  words.forEach(word => {
    const listItem = document.createElement("li");
    listItem.textContent = word;
    wordListElement.appendChild(listItem);
  });
}

// Initialise the game
placeWords();
fillGrid();
renderGrid();