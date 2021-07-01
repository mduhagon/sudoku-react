import React from 'react';
export default class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickValue = this.handleClickValue.bind(this);
        this.handleClickNote = this.handleClickNote.bind(this);
    }

    handleClickValue(e) {
        this.props.onInputValue(this.props.value);
    }

    handleClickNote(e) {
        this.props.onInputNote(this.props.value);
    }

    render() {
        return (
        <div className="numberInput">
            <div className="content">
                <button className="clickValue" onClick={this.handleClickValue}>{this.props.value}</button>
                <button className="clickNote" onClick={this.handleClickNote}>{this.props.value}</button>
            </div>
        </div>
        );
    }
}