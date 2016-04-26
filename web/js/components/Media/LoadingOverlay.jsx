import React from 'react';

export default class LoadingOverlay extends React.Component {
    render() {
        return (
            <div className="loading-overlay">
                <div className="keyboard-gif"></div>
            </div>
        );
    }
}