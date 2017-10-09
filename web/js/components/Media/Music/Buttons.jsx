import '@/less/Media/Music/audio-buttons.less';

import React from 'react';
import { PlaySVG, PauseSVG } from '@/js/components/Media/Music/IconSVGs.jsx';

export class PlayButton extends React.Component {
    render() {
        return (
            <div className={`playButton${(this.props.isVisible) ? ' visible' : ' invisible'}`}
                onMouseMove={this.props.onMouseMove}
            >
                <PlaySVG className={`solid${this.props.isHovering ? ' hover' : ''}`}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                    onClick={this.props.onClick}
                />
                <PlaySVG className={`blur${this.props.isHovering ? ' hover' : ''}`} />
            </div>
        );
    }
}
export class PauseButton extends React.Component {
    render() {
        return (
            <div className={`pauseButton${(this.props.isVisible) ? ' visible' : ' invisible'}`}
                onMouseMove={this.props.onMouseMove}
            >
                <PauseSVG className={`solid${this.props.isHovering ? ' hover' : ''}`}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                    onClick={this.props.onClick}
                />
                <PauseSVG className={`blur${this.props.isHovering ? ' hover' : ''}`} />
            </div>
        );
    }
}