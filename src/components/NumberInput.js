import React from 'react';
export default class NumberInput extends React.Component {
    render() {
        return (
        <div className="numberInput">
            <div className="content">
                <button className="clickValue">{this.props.value}</button>
                <button className="clickNote">{this.props.value}</button>
            </div>
        </div>
        );
    }
}