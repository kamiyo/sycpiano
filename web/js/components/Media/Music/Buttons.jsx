import 'less/Media/Music/audio-buttons.less';

import React from 'react';
import { PlaySVG, PauseSVG } from 'js/components/Media/Music/IconSVGs.jsx';

export const PlayIcon = ({ setRef }) => (
    <div
        ref={(div) => setRef(div)}
        className="playIcon"
    >
        <PlaySVG className="solid" />
        <PlaySVG className="blur" />
    </div>
);

export const PauseIcon = ({ setRef }) => (
    <div
        ref={(div) => setRef(div)}
        className="pauseIcon"
    >
        <PauseSVG className="solid" />
        <PauseSVG className="blur" />
    </div>
);

export const PlayButton = ({ isVisible, isHovering, onMouseOver, onMouseOut, onMouseMove, onClick }) => (
    <div
        className={`playButton${(isVisible) ? ' visible' : ' invisible'}`}
        onMouseMove={onMouseMove}
    >
        <PlaySVG className={`solid${isHovering ? ' hover' : ''}`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        />
        <PlaySVG className={`blur${isHovering ? ' hover' : ''}`} />
    </div>
);

export const PauseButton = ({ isVisible, isHovering, onMouseOver, onMouseOut, onMouseMove, onClick }) => (
    <div
        className={`pauseButton${(isVisible) ? ' visible' : ' invisible'}`}
        onMouseMove={onMouseMove}
    >
        <PauseSVG className={`solid${isHovering ? ' hover' : ''}`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        />
        <PauseSVG className={`blur${isHovering ? ' hover' : ''}`} />
    </div>
);