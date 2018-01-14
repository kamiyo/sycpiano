import 'less/Media/Music/audio-buttons.less';

import * as React from 'react';

import { PauseSVG, PlaySVG } from 'src/components/Media/Music/IconSVGs';

interface IconProps {
    setRef: (div: HTMLDivElement) => void;
}

export const PlayIcon: React.SFC<IconProps> = ({ setRef }) => (
    <div
        ref={(div) => setRef(div)}
        className="playIcon"
    >
        <PlaySVG className="solid" />
        <PlaySVG className="blur" />
    </div>
);

export const PauseIcon: React.SFC<IconProps> = ({ setRef }) => (
    <div
        ref={(div) => setRef(div)}
        className="pauseIcon"
    >
        <PauseSVG className="solid" />
        <PauseSVG className="blur" />
    </div>
);

interface ButtonProps {
    readonly isVisible: boolean;
    readonly isHovering: boolean;
    readonly onMouseOver: () => void;
    readonly onMouseOut: () => void;
    readonly onMouseMove: (event: MouseEvent) => void;
    readonly onClick: (event: MouseEvent | KeyboardEvent) => void;
}

export const PlayButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement> > = ({ isVisible, isHovering, onMouseOver, onMouseOut, onMouseMove, onClick }) => (
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

export const PauseButton: React.SFC< ButtonProps & React.HTMLProps<HTMLDivElement> > = ({ isVisible, isHovering, onMouseOver, onMouseOut, onMouseMove, onClick }) => (
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
