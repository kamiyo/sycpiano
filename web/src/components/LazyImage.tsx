import Blazy from 'blazy';
import * as React from 'react';
import { Transition } from 'react-transition-group';

import { SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';

import { TweenLite } from 'gsap';

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
    readonly csss?: {
        readonly mobile?: SerializedStyles;
        readonly desktop?: SerializedStyles;
        readonly loading?: SerializedStyles;
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
                    this.props.successCb?.(el);
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
        const {
            mobileAttributes,
            desktopAttributes,
            csss,
            id,
            isMobile,
            alt,
            loadingComponent,
        } = this.props;
        const Loading = (loadingComponent as typeof React.Component);
        return (
            <React.Fragment>
                <Transition
                    in={loadingComponent && !this.state.isLoaded}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    onEnter={fadeOnEnter}
                    onExit={fadeOnExit}
                    timeout={250}
                >
                    <div css={csss.loading}>
                        {loadingComponent === 'default'
                            ? <StyledLoadingInstance />
                            : loadingComponent
                                ? <Loading isMobile={isMobile} />
                                : null
                        }
                    </div>
                </Transition>
                {isMobile ? (
                    <picture key="mobile">
                        <source
                            data-srcset={mobileAttributes.webp.srcset}
                            sizes={mobileAttributes.webp.sizes}
                            type="image/webp"
                        />
                        <img
                            id={id}
                            css={csss.mobile}
                            data-srcset={mobileAttributes.jpg.srcset}
                            data-src={mobileAttributes.src}
                            sizes={mobileAttributes.jpg.sizes}
                            alt={alt}
                        />
                    </picture>
                ) : (
                        <picture key="desktop">
                            <source
                                data-srcset={desktopAttributes.webp.srcset}
                                sizes={desktopAttributes.webp.sizes}
                                type="image/webp"
                            />
                            <img
                                id={id}
                                css={csss.desktop}
                                data-srcset={desktopAttributes.jpg.srcset}
                                data-src={desktopAttributes.src}
                                sizes={desktopAttributes.jpg.sizes}
                                alt={alt}
                            />
                        </picture>
                    )
                }
            </React.Fragment>
        );
    }
}

export const LazyImage = LazyImageClass;
