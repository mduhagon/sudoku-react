const games_store = require('./initial_games.js'); 

function getInitialGame(difficulty = 'easy') {
    switch(difficulty) {
        case "easy":
            return getRandomElementFromArray(games_store.games_easy);
        case "medium":
            return getRandomElementFromArray(games_store.games_medium);
        case "hard":
            return getRandomElementFromArray(games_store.games_hard);
        default:
          throw new TypeError('Unsupported difficulty: '+difficulty);
      }
}

function getRandomElementFromArray(array) {
    let randomIndex = Math.floor(Math.random()*array.length);
    return array[randomIndex];
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
        display: null // this will be used to 'link' a core cell to a React Cell
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
          sudokuRow.push(createCell(parseInt(sudokuString[iter]))); 
          iter += 1;
        }  
        sudokuGame.push(sudokuRow);
     }

     return sudokuGame;
}

// Given a Sudoku grid, returns an object/dictionary
// containing the 9 'boxes' or 3x3 sub-grids that make up
// the whole board. This will be used for highlight and 
// validation functions, where all the cells in the same
// box as a given cell have to be considered.
function extractBoxesFromGrid(sudokuGrid) {
    let boxes = {};
    for(let iterRows = 0; iterRows < 3; iterRows++) {
        for(let iterCols = 0; iterCols < 3; iterCols++) {
            let boxKey = 'box_' + iterRows + '_' + iterCols;
            boxes[boxKey] = getBoxSubArray(iterRows, iterCols, sudokuGrid);
        }
    }

    return boxes;
}

function getBoxSubArray(boxRow, boxCol, sudokuGrid) {
    let subArray = [];

    let rowStart = boxRow * 3;
    let colStart = boxCol * 3;
    let rowEnd = rowStart + 3;
    let colEnd = colStart + 3;

    for(let iterRows = rowStart; iterRows < rowEnd; iterRows++) {
        for(let iterCols = colStart; iterCols < colEnd; iterCols++) {
            subArray.push(sudokuGrid[iterRows][iterCols]);
        }    
    }    

    return subArray;
}

// Given a sudokuGrid like the one produced by constructSudokuGrid(),
// And the row Index and Cell Index of a selected cell, we want to return 
// An Array containing all the cells in the same ROW as the selected one
function getRelatedRowCells(sudokuGrid, selectedCellRow, selectedCellCol) {
    let rowCells = [];
    for (let i = 0; i < 9; i++) {
        rowCells.push(sudokuGrid[selectedCellRow][i]);
    }
    return rowCells;
}

// Given a sudokuGrid like the one produced by constructSudokuGrid(),
// And the row Index and Cell Index of a selected cell, we want to return 
// An Array containing all the cells in the same COLUMN as the selected one
function getRelatedColCells(sudokuGrid, selectedCellRow, selectedCellCol) {
    let colCells = [];
    for (let i = 0; i < 9; i++) {
        colCells.push(sudokuGrid[i][selectedCellCol]);
    }
    return colCells;
}

function getRelatedBoxCells(boxes, selectedCellRow, selectedCellCol) {
    let boxCells = [];
    let boxIndex = getBoxIndex(selectedCellRow, selectedCellCol);
    let boxArray = boxes[boxIndex];

    for (let i = 0; i < boxArray.length; i++) {
        boxCells.push(boxArray[i]);
    }
    return boxCells;
}

// given a cell, retuns which box it belongs to,    
// the boxIndex can be used as an index / key for this.boxes
function getBoxIndex(cellRowIndex, cellColIndex) {
    let rowBoxIdx = (cellRowIndex/3>>0);
    let colBoxIdx = (cellColIndex/3>>0);
    return 'box_' + rowBoxIdx + '_' + colBoxIdx;
}

// Given an Array of N cells (uni-dimensional)
// Return a new array containing all cells with duplicate value (a value that occurs more than once)
// If there are no duplicates return an empty array
function getDuplicateCells(cellArray) {
    let duplicates = [];
    for (let i = 0; i < cellArray.length; i++) {
        let current = cellArray[i];
        if (current.value == 0) continue; // 0 is the special empty value, does not count as duplicate
        for (let y = 0; y < cellArray.length; y++) {
            if (i != y && current.value === cellArray[y].value) {
                //current is duplicate, store in result and move on to next element
                duplicates.push(current);
                break;
            }
        }    
    }
    return duplicates;
}

// This defines which functions inside this file/module are 
// Visible (and usable) from the outside (ie from the tests class, or from our program logic)
module.exports = {
    getInitialGame,
    createCell,
    constructSudokuGrid,
    extractBoxesFromGrid,
    getRelatedRowCells,
    getRelatedColCells,
    getDuplicateCells,
    getRelatedBoxCells,
    getBoxIndex
 };