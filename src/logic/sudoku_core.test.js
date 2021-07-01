const sudoku_core = require('./sudoku_core');

test('getInitialGame returns a valid game string', () => {
    let initialGame = sudoku_core.getInitialGame();
    expect(initialGame.game.length).toEqual(81);
});

test('constructSudokuGrid can parse a valid input string', () => {
    let inputString = '016002400320009000040103000005000069009050300630000800000306010000400072004900680';
    let expectedGridInts = [
        [ 0, 1, 6, 0, 0, 2, 4, 0, 0 ],
        [ 3, 2, 0, 0, 0, 9, 0, 0, 0 ],
        [ 0, 4, 0, 1, 0, 3, 0, 0, 0 ],
        [ 0, 0, 5, 0, 0, 0, 0, 6, 9 ],
        [ 0, 0, 9, 0, 5, 0, 3, 0, 0 ],
        [ 6, 3, 0, 0, 0, 0, 8, 0, 0 ],
        [ 0, 0, 0, 3, 0, 6, 0, 1, 0 ],
        [ 0, 0, 0, 4, 0, 0, 0, 7, 2 ],
        [ 0, 0, 4, 9, 0, 0, 6, 8, 0 ]
    ];
    let expectedGrid = intGridToCellGrid(expectedGridInts);

    expect(sudoku_core.constructSudokuGrid(inputString)).toEqual(expectedGrid);
});


test('constructSudokuGrid gets an input that is too long and throws TypeError', () => {
    let inputString = '016002400320009000040103000005000069009050300630000800000306010000400072004900680AKHKJHKJHAKDHKJHADKHKSJDHKJDHSJHDKSDHK';
    expect(() => { sudoku_core.constructSudokuGrid(inputString) }).toThrow(TypeError);
});


test('constructSudokuGrid gets a number and throws TypeError', () => {
    let inputNumber = 13;
    expect(() => { sudoku_core.constructSudokuGrid(inputNumber) }).toThrow(TypeError);
});

test('constructSudokuGrid gets a string that is too short and throws TypeError', () => {
    let inputString = '123456'; // inputString[0] = 1 
    expect(() => { sudoku_core.constructSudokuGrid(inputString) }).toThrow(TypeError);
});

test('constructSudokuGrid gets a string with invalid characters or not a number and throws TypeError', () => {
    let inputString = 'ABC002400320009000040103000005000069009050300630000800000306010000400072004900680'; // inputString[0] = A 
    expect(() => { sudoku_core.constructSudokuGrid(inputString) }).toThrow(TypeError);
});

test('getConflictingCells returns expected conflict', () => {
    let givenGridInts = [
        [ 0, 1, 6, 0, 0, 2, 4, 0, 0 ], 
        [ 3, 2, 0, 0, 0, 9, 0, 0, 0 ],
        [ 0, 4, 0, 1, 0, 3, 0, 0, 0 ],
        [ 0, 0, 5, 0, 0, 0, 0, 6, 9 ],
        [ 0, 0, 9, 0, 5, 0, 3, 0, 0 ],
        [ 6, 3, 0, 0, 0, 0, 8, 0, 0 ],
        [ 0, 0, 0, 3, 0, 6, 0, 1, 0 ],
        [ 0, 0, 0, 4, 0, 0, 0, 7, 2 ],
        [ 0, 0, 4, 9, 0, 0, 6, 8, 0 ]
    ];
    let givenGrid = intGridToCellGrid(givenGridInts);

    // create a conflicting value
    givenGrid[0][0].value = 1;

    let expectedConflicts = {"r0-c0": true};

    expect(sudoku_core.getConflictingCells(givenGrid)).toEqual(expectedConflicts);
});

test('getConflictingCells returns no conflicts', () => {
    let givenGridInts = [
        [ 0, 1, 6, 0, 0, 2, 4, 0, 0 ], 
        [ 3, 2, 0, 0, 0, 9, 0, 0, 0 ],
        [ 0, 4, 0, 1, 0, 3, 0, 0, 0 ],
        [ 0, 0, 5, 0, 0, 0, 0, 6, 9 ],
        [ 0, 0, 9, 0, 5, 0, 3, 0, 0 ],
        [ 6, 3, 0, 0, 0, 0, 8, 0, 0 ],
        [ 0, 0, 0, 3, 0, 6, 0, 1, 0 ],
        [ 0, 0, 0, 4, 0, 0, 0, 7, 2 ],
        [ 0, 0, 4, 9, 0, 0, 6, 8, 0 ]
    ];
    let givenGrid = intGridToCellGrid(givenGridInts);

    let expectedConflicts = {};

    expect(sudoku_core.getConflictingCells(givenGrid)).toEqual(expectedConflicts);
});


// Helper functions:

// This is used for the expected grids on the tests,
// We will receive a Grid / Two dimensional array with ints 
// inside, and we want to return a grid of the same size
// containing sudoku cells in each index.
function intGridToCellGrid(intGrid) {
    let newGrid = [];

    for(let iterRows = 0; iterRows < intGrid.length; iterRows++) {
        let newRow = intArrayToCellArray(intGrid[iterRows]);
        newGrid.push(newRow);
    }

    return newGrid;
}

function intArrayToCellArray(intArray) {
    let newArr = [];
    for(let iter = 0; iter < intArray.length; iter++) {
        newArr.push(sudoku_core.createCell(intArray[iter], intArray[iter] !== 0));
    }    
    return newArr;
}