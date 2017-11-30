import 'less/Media/Music/audio-buttons.less';

import * as React from 'react';

import { PauseSVG, PlaySVG } from 'js/components/Media/Music/IconSVGs';

export const PlayIcon = ({ setRef }: { setRef: (div: HTMLDivElement) => void }) => (
    <div
        ref={(div) => setRef(div)}
        className='playIcon'
    >
        <PlaySVG className='solid' />
        <PlaySVG className='blur' />
    </div>
);

export const PauseIcon = ({ setRef }: { setRef: (div: HTMLDivElement) => void }) => (
    <div
        ref={(div) => setRef(div)}
        className='pauseIcon'
    >
        <PauseSVG className='solid' />
        <PauseSVG className='blur' />
    </div>
);

interface ButtonProps {
    isVisible: boolean;
    isHovering: boolean;
    onMouseOver: () => void;
    onMouseOut: () => void;
    onMouseMove: (event: MouseEvent) => void;
    onClick: (event: MouseEvent | KeyboardEvent) => void;
}

export const PlayButton = ({ isVisible, isHovering, onMouseOver, onMouseOut, onMouseMove, onClick }: ButtonProps & React.HTMLProps<HTMLDivElement>) => (
    <div
        className={`playButton${(isVisible) ? ' visible' : ' invisible'}`}
        onMouseMove={onMouseMove}
    >
        <PlaySVG
            className={`solid${isHovering ? ' hover' : ''}`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        />
        <PlaySVG className={`blur${isHovering ? ' hover' : ''}`} />
    </div>
);

export const PauseButton = ({ isVisible, isHovering, onMouseOver, onMouseOut, onMouseMove, onClick }: ButtonProps & React.HTMLProps<HTMLDivElement>) => (
    <div
        className={`pauseButton${(isVisible) ? ' visible' : ' invisible'}`}
        onMouseMove={onMouseMove}
    >
        <PauseSVG
            className={`solid${isHovering ? ' hover' : ''}`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        />
        <PauseSVG className={`blur${isHovering ? ' hover' : ''}`} />
    </div>
);
