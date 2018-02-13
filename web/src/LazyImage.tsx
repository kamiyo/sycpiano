import * as React from 'react';
import { css, cx } from 'react-emotion';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

interface ImageProps {
    readonly src: string;
    readonly animation?: (el: HTMLImageElement) => void;
    readonly duration?: number;
    readonly callback?: () => void;
    readonly className?: string;
}

interface ImageState {
    loaded: boolean;
}

class LazyImageComponent extends React.Component<ImageProps, ImageState> {
    state = {
        loaded: false,
    };
    ref: HTMLImageElement;

    componentWillMount() {
        const img = new Image();
        img.onload = () => {
            this.ref.src = img.src;
            this.setState({ loaded: true });
            this.props.callback();
        };
        img.src = this.props.src;
    }

    render() {
        return (
            <Transition
                in={this.state.loaded}
                onEnter={(this.props.animation !== null) ?
                    () => this.props.animation(this.ref) :
                    () => this.ref.style.opacity = '1'
                }
                timeout={this.props.duration || 0}
            >
                <img
                    className={cx(
                        css` opacity: 0; `,
                        this.props.className,
                    )}
                    ref={(img) => this.ref = img}
                />
            </Transition>
        );
    }
}

export const LazyImage = LazyImageComponent;

interface FadeImageProps {
    readonly src: string;
    readonly duration?: number;
    readonly callback?: () => void;
    readonly className?: string;
}

export const FadeImage: React.SFC<FadeImageProps> = (props) => (
    <LazyImageComponent
        animation={(el) => {
            TweenLite.fromTo(el, props.duration / 1000, { opacity: 0 }, { opacity: 1 });
        }}
        {...props}
    />
);
