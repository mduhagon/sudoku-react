import React from 'react';

export default class SudokuCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onCellClick(this.props.rowIndex, this.props.colIndex);
    }

    // Empty cells internally are represented with 0,
    // but we do not want to display this to the user.
    getRenderValue = () => {
        return (this.props.value == 0) ? '' : this.props.value;
    }   
    
    getCellId = () => {
        return 'cell' + this.props.rowIndex + '-' + this.props.colIndex;
    }   

    getClasses = () => {
        let classes = ['cell']; //all cells get the 'cell' class, and maybe additional:

        if (this.props.isGivenValue) classes.push('given');
        if (this.props.isSelected) classes.push('selected');
        if (this.props.isHighlighted) classes.push('related');
        if (this.props.isConflicting) classes.push('wrong');
        
        return classes.join(' ');
    }

    render() {
        let listNotes = [];
        this.props.notes.forEach((note) => {
            listNotes.push(<div className={"note-" + note }>{note}</div>)
        });

        return (
            <td key={this.getCellId()} id={this.getCellId()} className={this.getClasses()} onClick={this.handleClick}>
               {this.getRenderValue()}
               {listNotes}     
            </td>
        );
    }
}        