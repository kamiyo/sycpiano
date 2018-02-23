import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { PauseSVG, PlaySVG } from 'src/components/Media/Music/IconSVGs';

interface IconProps {
    setRef: (div: HTMLDivElement) => void;
    width: number;
    height: number;
}

const sharedStyle = css`
    transform: translateY(-100px);
    transform-origin: center center;
    z-index: 2;
    flex: initial;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledIcon = styled('div') `
    opacity: 0;
    ${sharedStyle}
    pointer-events: none;

    svg {
        pointer-events: none;
    }
`;

const solidStyle = css`
    position: absolute;
    fill: #999;
    z-index: 1;
    transition: all 0.25s;
`;

const blurStyle = css`
    position: absolute;
    fill: #eee;
    z-index: 1;
    filter: blur(5px);
    transition: all 0.25s;
`;

const SolidPlayIcon = styled(PlaySVG) `
    ${solidStyle}
`;

const BlurPlayIcon = styled(PlaySVG) `
    ${blurStyle}
`;

export const PlayIcon: React.SFC<IconProps> = ({ setRef, ...props }) => (
    <StyledIcon
        innerRef={(div) => setRef(div)}
    >
        <SolidPlayIcon {...props} />
        <BlurPlayIcon {...props} />
    </StyledIcon>
);

const SolidPauseIcon = styled(PauseSVG) `
    ${solidStyle}
`;

const BlurPauseIcon = styled(PauseSVG) `
    ${blurStyle}
`;

export const PauseIcon: React.SFC<IconProps> = ({ setRef, ...props }) => (
    <StyledIcon
        innerRef={(div) => setRef(div)}
    >
        <SolidPauseIcon {...props} />
        <BlurPauseIcon {...props} />
    </StyledIcon>
);

interface ButtonProps {
    readonly isVisible: boolean;
    readonly isHovering: boolean;
    readonly onMouseOver: () => void;
    readonly onMouseOut: () => void;
    readonly onMouseMove: (event: MouseEvent) => void;
    readonly onClick: (event: MouseEvent | KeyboardEvent) => void;
    readonly width: number;
    readonly height: number;
}

const StyledButton = styled<{ isVisible: boolean }, 'div'>('div') `
    ${sharedStyle}
    transition: all 0.25s;
    ${(props) => props.isVisible ? 'opacity: 1;' : 'opacity: 0;'}
`;

const solidButtonStyle = css`
    ${solidStyle}
    z-index: 2;
`;

const solidButtonHover = css`
    cursor: pointer;
    fill: #eee;
`;

const blurButtonStyle = css`
    ${blurStyle}
`;

const blurButtonHover = css`
    filter: blur(5px);
`;

export const PlayButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({
    isVisible,
    isHovering,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onClick,
    width,
    height,
}) => (
        <StyledButton
            isVisible={isVisible}
            onMouseMove={onMouseMove}
        >
            <PlaySVG
                className={cx(
                    solidButtonStyle,
                    { [solidButtonHover]: isHovering },
                )}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                width={width}
                height={height}
            />
            <PlaySVG
                className={cx(
                    blurButtonStyle,
                    { [blurButtonHover]: isHovering },
                )}
                width={width}
                height={height}
            />
        </StyledButton>
    );

export const PauseButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({
    isVisible,
    isHovering,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onClick,
    width,
    height,
}) => (
        <StyledButton
            isVisible={isVisible}
            onMouseMove={onMouseMove}
        >
            <PauseSVG
                className={cx(
                    solidButtonStyle,
                    { [solidButtonHover]: isHovering },
                )}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                width={width}
                height={height}
            />
            <PauseSVG
                className={cx(
                    blurButtonStyle,
                    { [blurButtonHover]: isHovering },
                )}
                width={width}
                height={height}
            />
        </StyledButton>
    );
