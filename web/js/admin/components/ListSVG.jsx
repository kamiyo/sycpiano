import React from 'react';

export default class ListSVG extends React.Component {
    constructor(props) {
        super(props);
        this.inactiveFill = props.inactiveFill;
        this.activeFill = props.activeFill;
        this.state = {
            isActive: false,
        };
    }

    render() {
        var fill = this.inactiveFill;
        if (this.state.isActive) {
            fill = this.activeFill;
        }
        return (
            <svg fill={`${fill}`} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        );
    }
}