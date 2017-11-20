import 'less/Media/playlist.less';

import React from 'react';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';
import { TweenLite } from 'gsap';
import PlaylistToggler from 'js/components/Media/PlaylistToggler.jsx';

const slideLeft = (element, amount, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: amount }, { x: 0, ease: "Power3.easeOut", delay: delay });
}

const slideRight = (element, amount, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: amount, ease: "Power3.easeOut", delay: delay });
}

const Playlist = (props) => {
    let ulRef = null;
    return (
        <Transition
            in={props.isShow}
            appear={true}
            onEnter={(el, isAppearing) => {
                const amount = ulRef.getBoundingClientRect().width;
                if (!props.hasToggler && isAppearing) {
                    el.style.transform = "translateX(0)";
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
                    {props.items.map((item, i) => (
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
    )
}

export default Playlist;