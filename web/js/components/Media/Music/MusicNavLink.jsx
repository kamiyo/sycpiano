import React from 'react';

export default class MusicNavLink extends React.Component {
    render() {
        return (
            <li className={`music-nav-link ${this.props.category.toLowerCase()}`} onClick={() => this.props.onClick()}>
                { this.props.category }
            </li>
        );
    }
}