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
            this.props.callback && this.props.callback();
        };
        img.src = this.props.src;
    }

    render() {
        return (
            <Transition
                in={this.state.loaded}
                onEnter={(this.props.animation !== null) ?
                    () => this.props.animation(this.ref) : null
                }
                timeout={this.props.duration || 0}
            >
                <img
                    className={cx(
                        () => this.state.loaded ?
                            css` opacity: 1; ` :
                            css` opacity: 0; `,
                        this.props.className,
                    )}
                    ref={(img) => this.ref = img}
                />
            </Transition>
        );
    }
}

interface BackgroundImageProps {
    readonly src: string;
    readonly animation?: (el: HTMLElement) => void;
    readonly duration?: number;
    readonly callback?: () => void;
    readonly className?: string;
    readonly backgroundRepeat?: string;
    readonly backgroundAttachment?: string;
    readonly component?: string;
}

export const LazyImage = LazyImageComponent;

class LazyBackgroundImageComponent extends React.Component<BackgroundImageProps, ImageState> {
    state = {
        loaded: false,
    };
    ref: HTMLElement;

    componentWillMount() {
        const img = new Image();
        img.onload = () => {
            this.ref.style.backgroundImage = `url(${this.props.src})`;
            this.setState({ loaded: true });
            this.props.callback && this.props.callback();
        };
        img.src = this.props.src;
    }

    render() {
        const Tag = this.props.component || 'div';
        const attachment = this.props.backgroundAttachment || 'initial';
        const repeat = this.props.backgroundRepeat || 'no-repeat';
        const style = css`
            background-repeat: ${repeat};
            background-attachment: ${attachment};
        `;
        return (
            <Transition
                in={this.state.loaded}
                onEnter={this.props.animation ?
                    () => this.props.animation(this.ref) : null
                }
                timeout={this.props.duration || 0}
            >
                <Tag
                    className={cx(
                        () => this.state.loaded ?
                            css` opacity: 1; ` :
                            css` opacity: 0; `,
                        this.props.className,
                        { [style]: this.state.loaded },
                    )}
                    ref={(el: HTMLElement) => this.ref = el}
                />
            </Transition>
        );
    }
}

export const LazyBackgroundImage = LazyBackgroundImageComponent;

export interface FadeImageProps {
    readonly src: string;
    readonly duration?: number;
    readonly callback?: () => void;
    readonly className?: string;
}

export const FadeImage: React.SFC<FadeImageProps> = (props) => (
    <LazyImageComponent
        animation={(el) => {
            TweenLite.fromTo(el, props.duration / 1000, { opacity: 0 }, { opacity: 1, clearProps: 'opacity' });
        }}
        {...props}
    />
);

export interface FadeBackgroundImageProps {
    readonly src: string;
    readonly duration?: number;
    readonly callback?: () => void;
    readonly className?: string;
    readonly component?: string;
}

export const FadeBackgroundImage: React.SFC<FadeBackgroundImageProps> = (props) => (
    <LazyBackgroundImageComponent
        animation={(el) => {
            TweenLite.fromTo(el, props.duration / 1000, { opacity: 0 }, { opacity: 1, clearProps: 'opacity', delay: 0.1 });
        }}
        {...props}
    />
);
