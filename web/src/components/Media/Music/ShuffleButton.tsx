import * as React from 'react';

import { css, SerializedStyles } from '@emotion/react';

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
    transform: translateX(calc(100% * 2 / 3)) translateY(-1px) scale(1.05);
`;

const baseClass = (on: boolean) => css`
    position: fixed;
    bottom: 25px;
    right: calc(${playlistWidth.desktop} / 3);
    transform: translateX(calc(100% * 2 / 3));
    z-index: 50;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    transition: all 0.2s;
    background-color: ${on ? lightBlue : '#999'};
    border-radius: 50%;

    svg {
        stroke: white;
        vertical-align: middle;

        #outline {
            stroke: ${on ? lightBlue : '#999'};
            transition: all 0.2s;
        }
    }

    ${screenM} {
        right: calc(${playlistWidth.tablet} / 3);
    }

    ${screenXSorPortrait} {
        bottom: 10px;
        right: calc(100% / 3);
    }
`;

interface ShuffleButtonState {
    extraClass: SerializedStyles | null | undefined;
}

class ShuffleButton extends React.Component<ShuffleButtonProps, ShuffleButtonState> {
    state: ShuffleButtonState = {
        extraClass: null,
    };

    render(): JSX.Element {
        const { on, onClick } = this.props;
        return (
            <div
                css={[baseClass(on), this.state.extraClass]}
                onClick={onClick}
                onMouseDown={() => !this.props.isMobile && this.setState({ extraClass: null })}
                onMouseOut={() => !this.props.isMobile && this.setState({ extraClass: null })}
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

export default ShuffleButton;
