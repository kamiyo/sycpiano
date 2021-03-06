import * as React from 'react';
import { Transition } from 'react-transition-group';

import { css } from '@emotion/react';

import { TweenLite } from 'gsap';

import PlaylistToggler from 'src/components/Media/PlaylistToggler';
import { PlaylistProps } from 'src/components/Media/types';
import { playlistBackground } from 'src/styles/colors';
import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { playlistContainerWidth, playlistWidth } from 'src/styles/variables';

const slideLeft = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: amount }, { x: 0, ease: 'Power3.easeOut', delay });
};

const slideRight = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: amount, ease: 'Power3.easeOut', delay });
};

// need to add in css from parent
const playlistContainerStyle = css`
    position: absolute;
    height: 100%;
    right: 0;
    width: ${playlistContainerWidth.desktop};
    transform: translateX(${playlistWidth.desktop});
    font-family: ${lato1};
    z-index: 50;
    display: flex;
    ${noHighlight}

    ${screenM} {
        width: ${playlistContainerWidth.tablet};
        transform: translateX(${playlistWidth.tablet});
    }

    ${screenXSorPortrait} {
        width: 100%;
    }
`;

const playlistStyle = css`
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex: 1;
    align-self: flex-start;
    background-color: ${playlistBackground};
`;

class Playlist extends React.Component<PlaylistProps> {
    ulRef: React.RefObject<HTMLUListElement> = React.createRef();

    onEnter = (el: HTMLElement, isAppearing: boolean): void => {
        const amount = this.ulRef.current.getBoundingClientRect().width;
        if ((!this.props.hasToggler || !this.props.shouldAppear) && isAppearing) {
            el.style.transform = 'translateX(0)';
        } else {
            slideLeft(el, amount, (isAppearing) ? 0.25 : 0);
        }
    }

    onExit = (el: HTMLElement): void => {
        const amount = this.ulRef.current.getBoundingClientRect().width;
        slideRight(el, amount);
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <Transition<undefined>
                in={props.isShow}
                appear={true}
                onEnter={this.onEnter}
                onExit={this.onExit}
                timeout={400}
            >
                <div
                    css={[
                        playlistContainerStyle,
                        props.extraStyles && props.extraStyles.div,
                    ]}
                >
                    {props.hasToggler && (
                        <PlaylistToggler
                            isPlaylistVisible={props.isShow}
                            onClick={() => {
                                props.togglePlaylist();
                            }}
                        />
                    )}
                    <ul
                        id={props.id}
                        ref={this.ulRef}
                        css={[
                            playlistStyle,
                            props.extraStyles && props.extraStyles.ul,
                        ]}
                        onScroll={this.props.onScroll}
                    >
                        {this.props.children}
                    </ul>
                </div>
            </Transition>
        );
    }
}

export default Playlist;
