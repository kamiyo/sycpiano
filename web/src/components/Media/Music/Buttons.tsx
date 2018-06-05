import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { PauseSVG, PlaySVG, SkipSVG } from 'src/components/Media/Music/IconSVGs';

interface IconProps {
    setRef: (div: HTMLDivElement) => void;
    width: number;
    height: number;
    verticalOffset: number;
    Component?: React.ReactType;
    className?: string;
}

const getSharedStyle = (verticalOffset: number) => css`
    transform: translateY(${verticalOffset}px);
    transform-origin: center center;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
`;

const StyledIcon = styled<{ verticalOffset: number }, 'div'>('div')`
    opacity: 0;
    ${(props) => getSharedStyle(props.verticalOffset)};
    pointer-events: none;
    position: absolute;

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

const Icon: React.SFC<IconProps> = ({ setRef, verticalOffset, Component, className, ...props }) => (
    <StyledIcon
        innerRef={(div) => setRef(div)}
        verticalOffset={verticalOffset}
    >
        <Component className={cx(className, solidStyle)} {...props} />
        <Component className={cx(className, blurStyle)} {...props} />
    </StyledIcon>
);

export const PlayIcon: React.SFC<IconProps> = ({ ...props }) => (
    <Icon Component={PlaySVG} {...props} />
);

export const PauseIcon: React.SFC<IconProps> = ({ ...props }) => (
    <Icon Component={PauseSVG} {...props} />
);

export const SkipIcon: React.SFC<IconProps> = ({ ...props }) => (
    <Icon Component={SkipSVG} {...props} />
);

interface ButtonProps {
    readonly isHovering: boolean;
    readonly onMouseOver: () => void;
    readonly onMouseOut: () => void;
    readonly onMouseMove: (event: React.MouseEvent<HTMLElement>) => void;
    readonly onClick: (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => void;
    readonly width: number;
    readonly height: number;
    readonly verticalOffset: number;
    readonly Component?: React.ReactType;
    readonly className?: string;
}

const StyledButton = styled<{ verticalOffset: number; height: number; width: number; }, 'div'>('div')`
    ${(props) => getSharedStyle(props.verticalOffset)}
    transition: opacity 0.25s;
    opacity: 1;
    flex: initial;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
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

const Button: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({
    isHovering,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onClick,
    width,
    height,
    verticalOffset,
    Component,
    className,
}) => (
        <StyledButton
            onMouseMove={onMouseMove}
            verticalOffset={verticalOffset}
            width={width}
            height={height}
        >
            <Component
                className={cx(
                    className,
                    solidButtonStyle,
                    { [solidButtonHover]: isHovering },
                )}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                width={width}
                height={height}
            />
            <Component
                className={cx(
                    className,
                    blurButtonStyle,
                    { [blurButtonHover]: isHovering },
                )}
                width={width}
                height={height}
            />
        </StyledButton>
    );

export const PlayButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({ ...props }) =>
    <Button Component={PlaySVG} {...props} />;

export const PauseButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({ ...props }) =>
    <Button Component={PauseSVG} {...props} />;

export const SkipButton: React.SFC<ButtonProps & React.HTMLProps<HTMLDivElement>> = ({ ...props }) =>
    <Button Component={SkipSVG} {...props} />;
