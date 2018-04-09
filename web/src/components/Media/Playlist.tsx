import * as React from 'react';
import { css, cx } from 'react-emotion';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import PlaylistToggler from 'src/components/Media/PlaylistToggler';
import { PlaylistProps } from 'src/components/Media/types';
import { playlistBackground } from 'src/styles/colors';
import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
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
    width: ${playlistContainerWidth}px;
    transform: translateX(${playlistWidth}px);
    font-family: ${lato1};
    z-index: 50;
    display: flex;
    ${noHighlight}

    ${/* sc-selector */ screenXSorPortrait} {
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
    ulRef: HTMLUListElement = null;

    onEnter = (el: HTMLElement, isAppearing: boolean) => {
        const amount = this.ulRef.getBoundingClientRect().width;
        if ((!this.props.hasToggler || !this.props.shouldAppear) && isAppearing) {
            el.style.transform = 'translateX(0)';
        } else {
            slideLeft(el, amount, (isAppearing) ? 0.25 : 0);
        }
    }

    onExit = (el: HTMLElement) => {
        const amount = this.ulRef.getBoundingClientRect().width;
        slideRight(el, amount);
    }

    render() {
        const props = this.props;
        return (
            <Transition
                in={props.isShow}
                appear={true}
                onEnter={this.onEnter}
                onExit={this.onExit}
                timeout={400}
            >
                <div
                    className={cx(
                        playlistContainerStyle,
                        props.extraStyles && props.extraStyles.div,
                    )}
                >
                    {props.hasToggler &&
                        <PlaylistToggler
                            isPlaylistVisible={props.isShow}
                            onClick={() => {
                                props.togglePlaylist();
                            }}
                        />
                    }
                    <ul
                        id={props.id}
                        ref={(ul) => this.ulRef = ul}
                        className={cx(
                            playlistStyle,
                            props.extraStyles && props.extraStyles.ul,
                        )}
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
