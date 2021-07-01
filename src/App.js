import './App.css';
import SudokuGrid from './components/SudokuGrid';
import NumberInput from './components/NumberInput';

import * as logic from './logic/sudoku_core.js';

function App() {

  //we pick a random game from a list we have stored inside logic/initial_games
  let initialGame = logic.getInitialGame();
  let gameValues = logic.constructSudokuGrid(initialGame.game);

  return (
    <div>
      <h1>Sudoku Daily</h1>
      <h4 className="tagline">Seek success, but always be prepared for random cats.</h4>
      <div className="leftColumn">
        <h2>Game: #{initialGame.gameId}</h2>
        <SudokuGrid name="main" gameValues={gameValues} />
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
          <NumberInput value="1" />
          <NumberInput value="2" />
          <NumberInput value="3" />
          <NumberInput value="4" />
          <NumberInput value="5" />
          <NumberInput value="6" />
          <NumberInput value="7" />
          <NumberInput value="8" />
          <NumberInput value="9" />
        </div>
      </div>
    </div>
  );
}

export default App;
