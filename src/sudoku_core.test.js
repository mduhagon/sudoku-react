const sudoku_core = require('./logic/sudoku_core');

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


test('extractBoxesFromGrid can extract boxes from a valid grid', () => {
    let validGridInts = [
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
    let validGrid = intGridToCellGrid(validGridInts);

    let expectedBoxes = {
        box_0_0: intArrayToCellArray([ 0, 1, 6, 3, 2, 0, 0, 4, 0 ]),
        box_0_1: intArrayToCellArray([ 0, 0, 2, 0, 0, 9, 1, 0, 3 ]),
        box_0_2: intArrayToCellArray([ 4, 0, 0, 0, 0, 0, 0, 0, 0 ]),
        box_1_0: intArrayToCellArray([ 0, 0, 5, 0, 0, 9, 6, 3, 0 ]),
        box_1_1: intArrayToCellArray([ 0, 0, 0, 0, 5, 0, 0, 0, 0 ]),
        box_1_2: intArrayToCellArray([ 0, 6, 9, 3, 0, 0, 8, 0, 0 ]),
        box_2_0: intArrayToCellArray([ 0, 0, 0, 0, 0, 0, 0, 0, 4 ]),
        box_2_1: intArrayToCellArray([ 3, 0, 6, 4, 0, 0, 9, 0, 0 ]),
        box_2_2: intArrayToCellArray([ 0, 1, 0, 0, 7, 2, 6, 8, 0 ])
    }

    expect(sudoku_core.extractBoxesFromGrid(validGrid)).toEqual(expectedBoxes);
});


test('getRelatedRowCells returns the correct row cells for a valid grid', () => {
    let validGridInts = [
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
    let validGrid = intGridToCellGrid(validGridInts);

    let expectedCells = intArrayToCellArray([ 3, 2, 0, 0, 0, 9, 0, 0, 0 ]);

    expect(sudoku_core.getRelatedRowCells(validGrid, 1, 3)).toEqual(expectedCells);
});

test('getRelatedColCells returns the correct column cells for a valid grid', () => {
    let validGridInts = [
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
    let validGrid = intGridToCellGrid(validGridInts);

    let expectedCells = intArrayToCellArray([ 0, 0, 1, 0, 0, 0, 3, 4, 9 ]); 

    expect(sudoku_core.getRelatedColCells(validGrid, 1, 3)).toEqual(expectedCells);
});

test('getDuplicateCells returns all expected cells for a list with duplicates', () => {
    let inputCells = intArrayToCellArray([ 1, 0, 1, 0, 2, 0, 3, 3, 3 ]);
    let expectedCells = intArrayToCellArray([ 1, 1, 3, 3, 3 ]);

    expect(sudoku_core.getDuplicateCells(inputCells)).toEqual(expectedCells);
});

test('getDuplicateCells returns empty for a list with no duplicates', () => {
    let inputCells = intArrayToCellArray([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
    let expectedCells = [];

    expect(sudoku_core.getDuplicateCells(inputCells)).toEqual(expectedCells);
});

test('getDuplicateCells will not return 0s as duplicates', () => {
    let inputCells = intArrayToCellArray([ 0, 0, 0, 0 ]);
    let expectedCells = [];

    expect(sudoku_core.getDuplicateCells(inputCells)).toEqual(expectedCells);
});

test('getBoxIndex for cell in 1st box returns box_0_0', () => {
    let cellRowIndex = 0;
    let cellColIndex = 0;
    let expectedBoxIndex = 'box_0_0';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 2nd box returns box_0_1', () => {
    let cellRowIndex = 1;
    let cellColIndex = 5;
    let expectedBoxIndex = 'box_0_1';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 3rd box returns box_0_2', () => {
    let cellRowIndex = 2;
    let cellColIndex = 8;
    let expectedBoxIndex = 'box_0_2';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 4th box returns box_1_0', () => {
    let cellRowIndex = 4;
    let cellColIndex = 0;
    let expectedBoxIndex = 'box_1_0';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 5th box returns box_1_1', () => {
    let cellRowIndex = 5;
    let cellColIndex = 3;
    let expectedBoxIndex = 'box_1_1';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 6th box returns box_1_2', () => {
    let cellRowIndex = 3;
    let cellColIndex = 6;
    let expectedBoxIndex = 'box_1_2';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 7th box returns box_2_0', () => {
    let cellRowIndex = 6;
    let cellColIndex = 0;
    let expectedBoxIndex = 'box_2_0';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 8th box returns box_2_1', () => {
    let cellRowIndex = 7;
    let cellColIndex = 3;
    let expectedBoxIndex = 'box_2_1';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getBoxIndex for cell in 9th box returns box_2_2', () => {
    let cellRowIndex = 8;
    let cellColIndex = 8;
    let expectedBoxIndex = 'box_2_2';

    expect(sudoku_core.getBoxIndex(cellRowIndex, cellColIndex)).toEqual(expectedBoxIndex);
});

test('getRelatedBoxCells returns expected cells', () => {
    let validBoxes = {
        box_0_0: intArrayToCellArray([ 0, 1, 6, 3, 2, 0, 0, 4, 0 ]),
        box_0_1: intArrayToCellArray([ 0, 0, 2, 0, 0, 9, 1, 0, 3 ]),
        box_0_2: intArrayToCellArray([ 4, 0, 0, 0, 0, 0, 0, 0, 0 ]),
        box_1_0: intArrayToCellArray([ 0, 0, 5, 0, 0, 9, 6, 3, 0 ]),
        box_1_1: intArrayToCellArray([ 0, 0, 0, 0, 5, 0, 0, 0, 0 ]),
        box_1_2: intArrayToCellArray([ 0, 6, 9, 3, 0, 0, 8, 0, 0 ]),
        box_2_0: intArrayToCellArray([ 0, 0, 0, 0, 0, 0, 0, 0, 4 ]),
        box_2_1: intArrayToCellArray([ 3, 0, 6, 4, 0, 0, 9, 0, 0 ]),
        box_2_2: intArrayToCellArray([ 0, 1, 0, 0, 7, 2, 6, 8, 0 ])
    }
    let cellRowIndex = 5;
    let cellColIndex = 5;
    let expectedCells = validBoxes['box_1_1'];

    expect(sudoku_core.getRelatedBoxCells(validBoxes, cellRowIndex, cellColIndex)).toEqual(expectedCells);
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
        newArr.push(sudoku_core.createCell(intArray[iter]));
    }    
    return newArr;
}