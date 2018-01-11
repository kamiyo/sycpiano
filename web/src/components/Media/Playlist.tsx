import 'less/Media/playlist.less';

import * as React from 'react';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import PlaylistToggler from 'src/components/Media/PlaylistToggler';
import { PlaylistProps } from 'src/components/Media/types';

const slideLeft = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: amount }, { x: 0, ease: 'Power3.easeOut', delay });
};

const slideRight = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: amount, ease: 'Power3.easeOut', delay });
};

class Playlist<T> extends React.Component<PlaylistProps<T>, {}> {
    ulRef: HTMLUListElement = null;

    render() {
        const props = this.props;
        return (
            <Transition
                in={props.isShow}
                appear={true}
                onEnter={(el, isAppearing) => {
                    const amount = this.ulRef.getBoundingClientRect().width;
                    if ((!props.hasToggler || !props.shouldAppear) && isAppearing) {
                        el.style.transform = 'translateX(0)';
                    } else {
                        slideLeft(el, amount, (isAppearing) ? 0.25 : 0);
                    }
                }}
                onExit={(el) => {
                    const amount = this.ulRef.getBoundingClientRect().width;
                    slideRight(el, amount);
                }}
                timeout={400}
            >
                <div className={`playlist no-highlight ${props.className}`}>
                    {(props.hasToggler) ? <PlaylistToggler
                        isPlaylistVisible={props.isShow}
                        onClick={() => {
                            props.togglePlaylist();
                        }}
                    /> : null}
                    <ul ref={(ul) => this.ulRef = ul}>
                        {props.items.map((item: any) => (
                            <props.ChildRenderer
                                key={item.id}
                                currentItemId={props.currentItemId}
                                item={item}
                                onClick={props.onClick}
                            />
                        ))}
                    </ul>
                </div>
            </Transition>
        );
    }
}

export default Playlist;
