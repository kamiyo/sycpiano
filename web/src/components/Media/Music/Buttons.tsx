import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { PauseSVG, PlaySVG } from 'src/components/Media/Music/IconSVGs';

interface IconProps {
    setRef: (div: HTMLDivElement) => void;
    width: number;
    height: number;
    verticalOffset: number;
}

const getSharedStyle = (verticalOffset: number) => css`
    transform: translateY(${verticalOffset}px);
    transform-origin: center center;
    z-index: 2;
    flex: initial;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
`;

const StyledIcon = styled<{ verticalOffset: number }, 'div'>('div') `
    opacity: 0;
    ${(props) => getSharedStyle(props.verticalOffset)};
    pointer-events: none;

    svg {
        pointer-events: none;
    }
`;

const solidStyle = css`
    position: absolute;
    fill: #999;
    z-index: 1;
`;

const blurStyle = css`
    position: absolute;
    fill: #eee;
    z-index: 1;
`;

const SolidPlayIcon = styled(PlaySVG) `
    ${solidStyle}
`;

const BlurPlayIcon = styled(PlaySVG) `
    ${blurStyle}
`;

export const PlayIcon: React.SFC<IconProps> = ({ setRef, verticalOffset, ...props }) => (
    <StyledIcon
        innerRef={(div) => setRef(div)}
        verticalOffset={verticalOffset}
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

export const PauseIcon: React.SFC<IconProps> = ({ setRef, verticalOffset, ...props }) => (
    <StyledIcon
        innerRef={(div) => setRef(div)}
        verticalOffset={verticalOffset}
    >
        <SolidPauseIcon {...props} />
        <BlurPauseIcon {...props} />
    </StyledIcon>
);

interface ButtonProps {
    readonly isHovering: boolean;
    readonly onMouseOver: () => void;
    readonly onMouseOut: () => void;
    readonly onMouseMove: (event: MouseEvent) => void;
    readonly onClick: (event: MouseEvent | KeyboardEvent) => void;
    readonly width: number;
    readonly height: number;
    readonly verticalOffset: number;
}

const StyledButton = styled<{ verticalOffset: number }, 'div'>('div') `
    ${(props) => getSharedStyle(props.verticalOffset)}
    transition: opacity 0.25s;
    opacity: 1;
`;

const solidButtonStyle = css`
    ${solidStyle}
    z-index: 2;
    transition: fill 0.25s;
`;

const solidButtonHover = css`
    cursor: pointer;
    fill: #eee;
`;

const blurButtonStyle = css`
    ${blurStyle}
    transition: blur 0.25s;
`;

const blurButtonHover = css`
    filter: blur(5px);
`;

export const PlayButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({
    isHovering,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onClick,
    width,
    height,
    verticalOffset,
}) => (
        <StyledButton
            onMouseMove={onMouseMove}
            verticalOffset={verticalOffset}
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
    isHovering,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onClick,
    width,
    height,
    verticalOffset,
}) => (
        <StyledButton
            onMouseMove={onMouseMove}
            verticalOffset={verticalOffset}
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
