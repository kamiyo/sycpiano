import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { lightBlue } from 'src/styles/colors';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistWidth } from 'src/styles/variables';

interface ShuffleButtonProps {
    isMobile?: boolean;
    className?: string;
    onClick?: () => void;
    on?: boolean;
}

const upClass = css`
    cursor: pointer;
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.3));
    transform: translateX(66.67%) translateY(-1px) scale(1.05);
`;

class ShuffButton extends React.Component<ShuffleButtonProps, { extraClass: string }> {
    state = {
        extraClass: '',
    };

    render() {
        const { className, onClick } = this.props;
        return (
            <div
                className={cx(className, this.state.extraClass)}
                onClick={onClick}
                onMouseDown={() => !this.props.isMobile && this.setState({ extraClass: '' })}
                onMouseOut={() => !this.props.isMobile && this.setState({ extraClass: '' })}
                onMouseOver={() => !this.props.isMobile && this.setState({ extraClass: upClass })}
                onMouseUp={() => !this.props.isMobile && this.setState({ extraClass: upClass })}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 120 120"
                    height="50"
                    width="50"
                >
                    <path d="M15 75H37.5Q48.75 75 60 60Q71.25 45 82.5 45H105" fill="none" stroke-style="solid" strokeWidth="6" />
                    <path id="outline" d="M15 45H37.5Q48.75 45 60 60Q71.25 75 82.5 75H105" fill="none" stroke-style="solid" strokeWidth="15" />
                    <path d="M15 45H37.5Q48.75 45 60 60Q71.25 75 82.5 75H105" fill="none" stroke-style="solid" strokeWidth="6" />
                </svg>
            </div>
        );
    }
}

export const ShuffleButton = styled<ShuffleButtonProps, { on: boolean }>(ShuffButton)`
    position: fixed;
    bottom: 25px;
    right: calc(${playlistWidth.desktop} / 3);
    transform: translateX(66.67%);
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.2s;
    background-color: ${props => props.on ? lightBlue : '#999'};
    border-radius: 50%;

    svg {
        stroke: white;
        vertical-align: middle;

        #outline {
            stroke: ${props => props.on ? lightBlue : '#999'};
            transition: all 0.2s;
        }
    }

    ${/* sc-selector */ screenM} {
        right: calc(${playlistWidth.tablet} / 2);
    }

    /* stylelint-disable-next-line no-duplicate-selectors */
    ${/* sc-selector */ screenXSorPortrait} {
        bottom: 10px;
        right: calc(33.33%);
    }
`;
