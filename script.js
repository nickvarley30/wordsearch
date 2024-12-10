const words = ["JAVASCRIPT", "HTML", "CSS", "CODE", "GRID", "WEB", "GAME", "SEARCH"];
const gridSize = 10;
let selectedCells = [];
let grid = [];

function generateGrid() {
    const gridElement = document.getElementById("grid");
    gridElement.innerHTML = '';
    grid = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(''));

    // Place words in the grid
    words.forEach(word => placeWordInGrid(word));

    // Fill remaining empty cells with random letters
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    // Render the grid
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = grid[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridElement.appendChild(cell);
        }
    }

    // Add event listeners
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", () => selectCell(cell));
    });
}

function placeWordInGrid(word) {
    let placed = false;
    while (!placed) {
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        if (canPlaceWord(word, startRow, startCol, direction)) {
            for (let i = 0; i < word.length; i++) {
                if (direction === "horizontal") {
                    grid[startRow][startCol + i] = word[i];
                } else {
                    grid[startRow + i][startCol] = word[i];
                }
            }
            placed = true;
        }
    }
}

function canPlaceWord(word, row, col, direction) {
    if (direction === "horizontal" && col + word.length > gridSize) return false;
    if (direction === "vertical" && row + word.length > gridSize) return false;

    for (let i = 0; i < word.length; i++) {
        const currentRow = direction === "horizontal" ? row : row + i;
        const currentCol = direction === "horizontal" ? col + i : col;
        if (grid[currentRow][currentCol] !== '') return false;
    }
    return true;
}

function selectCell(cell) {
    cell.classList.toggle("selected");
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellKey = `${row},${col}`;

    if (selectedCells.includes(cellKey)) {
        selectedCells = selectedCells.filter(key => key !== cellKey);
    } else {
        selectedCells.push(cellKey);
    }

    checkSelectedCells();
}

function checkSelectedCells() {
    const selectedWord = selectedCells.map(cellKey => {
        const [row, col] = cellKey.split(",").map(Number);
        return grid[row][col];
    }).join("");

    if (words.includes(selectedWord)) {
        alert(`You found the word: ${selectedWord}`);
        selectedCells = [];
        document.querySelectorAll(".cell.selected").forEach(cell => cell.classList.remove("selected"));
    }
}

function populateWordList() {
    const wordListElement = document.getElementById("wordList");
    wordListElement.innerHTML = words.map(word => `<li>${word}</li>`).join("");
}

generateGrid();
populateWordList();