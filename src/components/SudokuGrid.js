import React from 'react';
import SudokuCell from './SudokuCell'
import * as logic from '../logic/sudoku_core.js';

export default class SudokuGrid extends React.Component {

    cellIsSelected(rowIndex, colIndex) {
        return (
            this.props.selectedCellRow === rowIndex && 
            this.props.selectedCellCol === colIndex
        );
    } 	

    cellIsHighlighted(rowIndex, colIndex) {
        return (
            this.props.highlightedDict != null && 
            this.props.highlightedDict.hasOwnProperty(logic.getCellKey(rowIndex, colIndex))
        );
    }

    cellIsConflicting(rowIndex, colIndex) {
        return (
            this.props.conflictingDict != null && 
            this.props.conflictingDict.hasOwnProperty(logic.getCellKey(rowIndex, colIndex))
        );
    }

    render() {
        const rowlist = [];

        let rowIndex = 0;
        this.props.gameValues.forEach((row) => {

            const cellList = [];
            let colIndex = 0;
            row.forEach((cell) => {
                // probably the isXXX props should not come from values in the cell
                // but they could be calculated on the fly...
                // maybe I will change this once I implement further
                cellList.push(
                    <SudokuCell 
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        value={cell.value} 
                        isGivenValue={cell.isGivenValue} 
                        isSelected={this.cellIsSelected(rowIndex, colIndex)} 
                        isHighlighted={this.cellIsHighlighted(rowIndex, colIndex)} 
                        isConflicting={this.cellIsConflicting(rowIndex, colIndex)}
                        notes={cell.notes} 
                        onCellClick={this.props.onCellClick}    
                        />
                );
                colIndex++;
            });

            rowlist.push(
                <tr key={'row'+rowIndex}>{cellList}</tr>
            );

            rowIndex++;
        });    

        return (
            <table key={'SudokuGrid_' + this.props.name} className="board">
                <tbody>{rowlist}</tbody>
            </table>
        );
    }
}        