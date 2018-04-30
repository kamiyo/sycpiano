import Blazy from 'blazy';
import * as React from 'react';
import styled from 'react-emotion';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import { LoadingInstance } from 'src/components/LoadingSVG';
import { lightBlue } from 'src/styles/colors';

const fadeOnEnter = (element: HTMLElement) => {
    TweenLite.to(element.firstChild, 0.25, { autoAlpha: 1 });
};

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.to(element.firstChild, 0.25, { autoAlpha: 0 });
};

const StyledLoadingInstance = styled(LoadingInstance) `
    position: absolute;
    height: 100px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: 10px;
    stroke: ${lightBlue};
`;

interface PictureGroupAttributes {
    readonly webp?: {
        readonly srcset?: string;
        readonly sizes?: string;
    };
    readonly jpg?: {
        readonly srcset?: string;
        readonly sizes?: string;
    };
    readonly src?: string;
}

interface LazyImageProps {
    readonly isMobile?: boolean;
    readonly id: string;
    readonly offset?: number;
    readonly container?: string;
    readonly mobileAttributes?: PictureGroupAttributes;
    readonly desktopAttributes?: PictureGroupAttributes;
    readonly classNames?: {
        readonly mobile?: string;
        readonly desktop?: string;
        readonly loading?: string;
    };
    readonly loadingComponent?: React.ReactNode | 'default';
    readonly alt: string;
    readonly successCb?: (el?: HTMLImageElement) => void;
    readonly destroyCb?: () => void;
}

interface LazyImageState {
    isLoaded: boolean;
}

class LazyImageClass extends React.Component<LazyImageProps, LazyImageState> {
    private blazy: BlazyInstance;
    private timeout: NodeJS.Timer;
    private mounted = false;
    state = {
        isLoaded: false,
    };

    activateBlazy = () => {
        this.blazy = new Blazy({
            selector: `#${this.props.id}`,
            offset: this.props.offset || Infinity,
            container: this.props.container ? `#${this.props.container}` : 'window',
            success: (el: HTMLImageElement) => {
                if (this.mounted) {
                    this.timeout = setTimeout(() => this.setState({ isLoaded: true }), 500);
                    this.props.successCb && this.props.successCb(el);
                }
            },
        });
    }

    componentDidMount() {
        this.mounted = true;
        this.activateBlazy();
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timeout);
        this.blazy.destroy();
    }

    componentDidUpdate(prevProps: LazyImageProps) {
        if (prevProps.isMobile !== this.props.isMobile) {
            this.setState({ isLoaded: false });
            this.blazy.revalidate();
        }
    }

    render() {
        const Loading = (this.props.loadingComponent as typeof React.Component);
        return (
            <>
                <Transition
                    in={this.props.loadingComponent && !this.state.isLoaded}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    onEnter={fadeOnEnter}
                    onExit={fadeOnExit}
                    timeout={250}
                >
                    <div className={this.props.classNames.loading}>
                        {this.props.loadingComponent === 'default'
                            ? <StyledLoadingInstance />
                            : this.props.loadingComponent
                                ? <Loading isMobile={this.props.isMobile} />
                                : null
                        }
                    </div>
                </Transition>
                {this.props.isMobile ? (
                    <picture key="mobile">
                        <source
                            data-srcset={this.props.mobileAttributes.webp.srcset}
                            sizes={this.props.mobileAttributes.webp.sizes}
                            type="image/webp"
                        />
                        <img
                            id={this.props.id}
                            className={this.props.classNames.mobile}
                            data-srcset={this.props.mobileAttributes.jpg.srcset}
                            data-src={this.props.mobileAttributes.src}
                            sizes={this.props.mobileAttributes.jpg.sizes}
                            alt={this.props.alt}
                        />
                    </picture>
                ) : (
                        <picture key="desktop">
                            <source
                                data-srcset={this.props.desktopAttributes.webp.srcset}
                                sizes={this.props.desktopAttributes.webp.sizes}
                                type="image/webp"
                            />
                            <img
                                id={this.props.id}
                                className={this.props.classNames.desktop}
                                data-srcset={this.props.desktopAttributes.jpg.srcset}
                                data-src={this.props.desktopAttributes.src}
                                sizes={this.props.desktopAttributes.jpg.sizes}
                                alt={this.props.alt}
                            />
                        </picture>
                    )
                }
            </>
        );
    }
}

export const LazyImage = LazyImageClass;
