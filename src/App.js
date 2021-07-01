import React from 'react';
import './App.css';
import SudokuGrid from './components/SudokuGrid';
import NumberInput from './components/NumberInput';
import * as logic from './logic/sudoku_core.js';
export default class App extends React.Component {
  constructor(props) {
    super(props);

    //we pick a random game from a list we have stored inside logic/initial_games
    this.initialGame = logic.getInitialGame();
    let gameGrid = logic.constructSudokuGrid(this.initialGame.game);

    this.state = {
      gameState: gameGrid,
      selectedCellRow: 0,
      selectedCellCol: 0,
    };

    this.handleCellSelected = this.handleCellSelected.bind(this);
    this.handleInputValue = this.handleInputValue.bind(this);
    this.handleInputNote = this.handleInputNote.bind(this);
    this.handleClearValue = this.handleClearValue.bind(this);
    this.handleClearNotes = this.handleClearNotes.bind(this);
  }

  handleCellSelected(rowIndex, colIndex) {
    this.setState({
      selectedCellRow: rowIndex,
      selectedCellCol: colIndex
    })
  }

  handleInputValue(input) {
    if (this.state.selectedCellRow == null || this.state.selectedCellCol == null) return;

    var cloned = JSON.parse(JSON.stringify(this.state.gameState));
    cloned[this.state.selectedCellRow][this.state.selectedCellCol].value = parseInt(input);
    cloned[this.state.selectedCellRow][this.state.selectedCellCol].notes = [];
    this.setState({
      gameState: cloned
    })
  }

  handleClearValue() {
    if (this.state.selectedCellRow == null || this.state.selectedCellCol == null) return;

    //user should not be able to clear a given value
    if (this.state.gameState[this.state.selectedCellRow][this.state.selectedCellCol].isGivenValue) return;

    var cloned = JSON.parse(JSON.stringify(this.state.gameState));
    cloned[this.state.selectedCellRow][this.state.selectedCellCol].value = 0;

    this.setState({
      gameState: cloned
    })
  }
  
  handleInputNote(input) {
    if (this.state.selectedCellRow == null || this.state.selectedCellCol == null) return;
    let currentValue = this.state.gameState[this.state.selectedCellRow][this.state.selectedCellCol].value;
    let currentNotes = this.state.gameState[this.state.selectedCellRow][this.state.selectedCellCol].notes;
    
    //if the cell has a value it makes no sense to put a note to it
    if (currentValue !== 0) return;

    let newNotes = [];
    let inputFoundInCurrent = false;

    for (let i = 0; i < currentNotes.length; i++) {
      if (currentNotes[i] == input) {
        inputFoundInCurrent = true; // found, will be removed / skipped from newNotes
      } else {
        newNotes.push(currentNotes[i]);
      }
    }
    if (!inputFoundInCurrent) newNotes.push(input);

    var cloned = JSON.parse(JSON.stringify(this.state.gameState));
    cloned[this.state.selectedCellRow][this.state.selectedCellCol].notes = newNotes;

    this.setState({
      gameState: cloned
    })
  }

  handleClearNotes() {
    if (this.state.selectedCellRow == null || this.state.selectedCellCol == null) return;
    
    var cloned = JSON.parse(JSON.stringify(this.state.gameState));
    cloned[this.state.selectedCellRow][this.state.selectedCellCol].notes = [];

    this.setState({
      gameState: cloned
    })
  }

  render() {
    return (
      <div>
        <h1>Sudoku Daily</h1>
        <h4 className="tagline">Seek success, but always be prepared for random cats.</h4>
        <div className="leftColumn">
          <h2>Game: #{this.initialGame.gameId}</h2>
          <SudokuGrid 
            name="main" 
            gameValues={this.state.gameState} 
            selectedCellRow={this.state.selectedCellRow}
            selectedCellCol={this.state.selectedCellCol} 
            highlightedDict={logic.getAllRelatedCells(this.state.selectedCellRow, this.state.selectedCellCol)} 
            conflictingDict={logic.getConflictingCells(this.state.gameState)}
            onCellClick={this.handleCellSelected} 
            />
        </div>
        <div className="rightColumn">
          <div id="howToPlay">
            <b>How to play:</b> Select the cell in the grid that you want to modify. 
            This will highlight the cell and all those related to it 
            (so the values of all these cells cannot have duplicates).
            Use the buttons bellow to enter a value for the selected cell,
            or a note of a candidate value (the smaller number)
          </div>
          <div id="inputButtons">
            <NumberInput value="X" onInputValue={this.handleClearValue} onInputNote={this.handleClearNotes} />
            <NumberInput value="1" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="2" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="3" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="4" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="5" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="6" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="7" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="8" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
            <NumberInput value="9" onInputValue={this.handleInputValue} onInputNote={this.handleInputNote} />
          </div>
          <div id="additionalActions">
            
          </div>
        </div>
      </div>
    );
  }  
}