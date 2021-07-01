import React from 'react';
import SudokuCell from './SudokuCell'

export default class SudokuGrid extends React.Component {
    render() {
        const rowlist = [];

        console.log(this.props.gameValues);    

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
                        isSelected={cell.isSelected} 
                        isHighlighted={cell.isHighlighted} 
                        isConflicting={cell.isConflicting}
                        notes={cell.notes} />
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