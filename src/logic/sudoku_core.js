const games_store = require('./initial_games.js'); 

function getInitialGame(difficulty = 'easy') {
    let gameId = "";
    let game = null;
    let idx = null;

    switch(difficulty) {
        case "easy":
            idx = getRandomNumber(games_store.games_easy.length);
            gameId = 'Easy-'+idx;
            game = games_store.games_easy[idx];
            break;
        case "medium":
            idx = getRandomNumber(games_store.games_medium.length);
            gameId = 'Medium-'+idx;
            game = games_store.games_medium[idx];
            break;
        case "hard":
            idx = getRandomNumber(games_store.games_medium.length);
            gameId = 'Hard-'+idx;
            game = games_store.games_hard[idx];
            break;
        default:
          throw new TypeError('Unsupported difficulty: '+difficulty);
    }

    return {
        gameId: gameId,
        game: game
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random()*max);
}

// In order to implement all the functionalities of our Sudoku game,
// We need to keep more information for each 'cell' of the grid, not only
// its value (the number from 0 to 9). Therefore, we will use a Javascript
// object, and we can later add all the properties we may need inside it.
// our SudokuGrid will hold cell objects and not plain ints.
// createCell is a 'factory' method that initializes a cell object
// given a set of properties.
function createCell(cellValue, givenValue = false) {
    return {
        value: cellValue,
        isGivenValue: givenValue, // this means the value came with the initial game, cannot be changed by user later
        notes: [] // contains ints. These are to be displayed as posible values that could go in this cell
    }
}

// Given a string with all the numbers of a full Sudoku grid (81 numbers)
// It will return a Two-dimensional Array with the values (as integers).
// 0 is a valid value an represents an empty cell.
function constructSudokuGrid(sudokuString) {
    var sudokuGame = [];
    var iter = 0;

    //validate sudokuString:
    // - Each character needs to be a number between 0 and 9 
    // - Needs to be 81 characters long
    const validSudokuStringRegex = /^[0-9]{81}$/;
    if (!sudokuString.match(validSudokuStringRegex)) {
        throw new TypeError('sudokuString invalid');
    }

    for (let rows = 0; rows < 9; rows++) {
        var sudokuRow = [];
        for (let cols = 0; cols < 9; cols++) {
          // push cell value
          let val = parseInt(sudokuString[iter]);
          sudokuRow.push(createCell(val, val !== 0)); 
          iter += 1;
        }  
        sudokuGame.push(sudokuRow);
     }

     return sudokuGame;
}

function getCellKey(cellRow, cellCol) {
    return "r" + cellRow + "-c" + cellCol;
}

function getAllRelatedCells(selectedCellRow, selectedCellCol) {
    if (selectedCellRow == null || selectedCellCol == null) return {};

    const relatedCells = {};

    for (let i = 0; i < 9; i++) {
        if (i != selectedCellCol) relatedCells[getCellKey(selectedCellRow, i)] = true;
        if (i != selectedCellRow) relatedCells[getCellKey(i, selectedCellCol)] = true;
    }

    let rowBoxIdx = (selectedCellRow/3>>0);
    let colBoxIdx = (selectedCellCol/3>>0);
    let rowBoxStart = rowBoxIdx * 3;
    let colBoxStart = colBoxIdx * 3;
    for (let r = rowBoxStart; r < rowBoxStart+3; r++) {
        for (let c = colBoxStart; c < colBoxStart+3; c++) {
            if (r !== selectedCellRow && c !== selectedCellCol) relatedCells[getCellKey(r, c)] = true;
        }    
    }

    return relatedCells;
}    

function getConflictingCells(sudokuGrid) {
    const conflictingCells = {};

    console.log("the grid conflicting got");
    console.log(sudokuGrid);

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (isConflicting(sudokuGrid, r, c) ) conflictingCells[getCellKey(r, c)] = true;
        }
    }
    console.log("conflicting");
    console.log(conflictingCells);
    return conflictingCells;
}

function isConflicting(sudokuGrid, rowIndex, colIndex) {
    let currentCell = sudokuGrid[rowIndex][colIndex];

    // if the cell we are evaluating is a given value it cannot be wrong / be conflicting
    // same goes if this is an empty cell
    if (currentCell.isGivenValue || currentCell.value === 0) return false;

    // see if it is duplicated in the same row
    // see if it is duplicated in the same column
    for (let i = 0; i < 9; i++) {
        if (i !== colIndex && sudokuGrid[rowIndex][i].value === currentCell.value) return true;
        if (i !== rowIndex && sudokuGrid[i][colIndex].value === currentCell.value) return true;
    }

    // see if it is duplicated in the same box
    let rowBoxIdx = (rowIndex/3>>0);
    let colBoxIdx = (colIndex/3>>0);
    let rowBoxStart = rowBoxIdx * 3;
    let colBoxStart = colBoxIdx * 3;
    for (let r = rowBoxStart; r < rowBoxStart+3; r++) {
        for (let c = colBoxStart; c < colBoxStart+3; c++) {
            if ((r !== rowIndex || c !== colIndex) && sudokuGrid[r][c].value === currentCell.value) return true;
        }    
    }

    return false;
}

function calculateNotes(sudokuGrid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let cell = sudokuGrid[r][c];
            if (cell.value === 0) {
                cell.notes = findPossibleCellValues(sudokuGrid, r, c);
            }    
        }
    }
}

function findPossibleCellValues(sudokuGrid, rowIndex, colIndex) {
    // I will take advantage of the fact each possible number
    // will be at index = number on this array
    let possibleInOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < 9; i++) {
        possibleInOrder[sudokuGrid[rowIndex][i].value] = 0;
        possibleInOrder[sudokuGrid[i][colIndex].value] = 0;
    }

    let rowBoxIdx = (rowIndex/3>>0);
    let colBoxIdx = (colIndex/3>>0);
    let rowBoxStart = rowBoxIdx * 3;
    let colBoxStart = colBoxIdx * 3;
    for (let r = rowBoxStart; r < rowBoxStart+3; r++) {
        for (let c = colBoxStart; c < colBoxStart+3; c++) {
            possibleInOrder[sudokuGrid[r][c].value] = 0;
        }    
    }

    let possible = [];

    for (let i = 1; i < possibleInOrder.length; i++) {
        if (possibleInOrder[i] !== 0) possible.push(possibleInOrder[i]);
    }

    return possible;
}

// This defines which functions inside this file/module are 
// Visible (and usable) from the outside (ie from the tests class, or from our program logic)
module.exports = {
    getInitialGame,
    createCell,
    getCellKey,
    constructSudokuGrid,
    getAllRelatedCells,
    getConflictingCells,
    calculateNotes
};