import 'less/Media/playlist.less';

import * as React from 'react';
import { Transition } from 'react-transition-group';

import { TweenLite } from 'gsap';

import PlaylistToggler from 'js/components/Media/PlaylistToggler';

const slideLeft = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: amount }, { x: 0, ease: 'Power3.easeOut', delay });
};

const slideRight = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: amount, ease: 'Power3.easeOut', delay });
};

interface ChildRendererProps {
    key: number | string;
    isActive: boolean;
    item: any;
    onClick: () => void;
}

interface PlaylistProps {
    ChildRenderer: (childrenProps: ChildRendererProps) => JSX.Element;
    className: string;
    currentItemId: number | string;
    hasToggler: boolean;
    isShow: boolean;
    items: any[];
    onClick: () => void;
    togglePlaylist: (isShow?: boolean) => void;
}

const Playlist = (props: PlaylistProps) => {
    let ulRef: HTMLUListElement = null;
    return (
        <Transition
            in={props.isShow}
            appear={true}
            onEnter={(el, isAppearing) => {
                const amount = ulRef.getBoundingClientRect().width;
                if (!props.hasToggler && isAppearing) {
                    el.style.transform = 'translateX(0)';
                } else {
                    slideLeft(el, amount, (isAppearing) ? 0.25 : 0);
                }
            }}
            onExit={(el) => {
                const amount = ulRef.getBoundingClientRect().width;
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
                <ul ref={(ul) => ulRef = ul}>
                    {props.items.map((item: any) => (
                        <props.ChildRenderer
                            key={item.id}
                            isActive={props.currentItemId === item.id}
                            item={item}
                            onClick={props.onClick}
                        />
                    ))}
                </ul>
            </div>
        </Transition>
    );
};

export default Playlist;
