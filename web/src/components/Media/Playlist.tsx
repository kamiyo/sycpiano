import 'less/Media/playlist.less';

import * as React from 'react';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import PlaylistToggler from 'src/components/Media/PlaylistToggler';

const slideLeft = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: amount }, { x: 0, ease: 'Power3.easeOut', delay });
};

const slideRight = (element: HTMLElement, amount: number, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: amount, ease: 'Power3.easeOut', delay });
};

interface ChildRendererProps {
    readonly key: number | string;
    readonly currentItemId: number | string;
    readonly item: any;
    readonly onClick: (...args: any[]) => void;
}

interface PlaylistProps {
    readonly ChildRenderer: (childrenProps: ChildRendererProps) => JSX.Element;
    readonly className: string;
    readonly currentItemId: number | string;
    readonly hasToggler: boolean;
    readonly isShow: boolean;
    readonly items: any[];
    readonly onClick: (...args: any[]) => void;
    readonly togglePlaylist?: (isShow?: boolean) => void;
    readonly shouldAppear: boolean;
}

const Playlist: React.SFC<PlaylistProps> = (props) => {
    let ulRef: HTMLUListElement = null;
    return (
        <Transition
            in={props.isShow}
            appear={true}
            onEnter={(el, isAppearing) => {
                const amount = ulRef.getBoundingClientRect().width;
                if ((!props.hasToggler || !props.shouldAppear) && isAppearing) {
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
                            currentItemId={props.currentItemId}
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
