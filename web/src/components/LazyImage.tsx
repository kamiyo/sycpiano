import * as Blazy from 'blazy';
import * as React from 'react';
import styled from 'react-emotion';

import { LoadingInstance } from 'src/components/LoadingSVG';
import { lightBlue } from 'src/styles/colors';

const StyledLoadingInstance = styled(LoadingInstance)`
    position: relative;
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
    readonly alt: string;
    readonly successCb?: (el?: HTMLImageElement) => void;
    readonly destroyCb?: () => void;
}

interface LazyImageState {
    isLoaded: boolean;
}

class LazyImageClass extends React.Component<LazyImageProps, LazyImageState> {
    private blazy: BlazyInstance;
    state = {
        isLoaded: false,
    };

    activateBlazy = () => {
        this.blazy = new Blazy({
            selector: `#${this.props.id}`,
            offset: this.props.offset || Infinity,
            container: this.props.container ? `#${this.props.container}` : 'window',
            success: (el: HTMLImageElement) => {
                this.setState({ isLoaded: true });
                this.props.successCb && this.props.successCb(el);
            },
        });
    }

    componentDidMount() {
        this.activateBlazy();
    }

    componentWillUnmount() {
        this.blazy.destroy();
    }

    componentDidUpdate(prevProps: LazyImageProps) {
        if (prevProps.isMobile !== this.props.isMobile) {
            setTimeout(() => this.activateBlazy(), 500);
        }
    }

    componentWillUpdate(nextProps: LazyImageProps) {
        if (nextProps.isMobile !== this.props.isMobile) {
            this.blazy.destroy();
            this.props.destroyCb && this.props.destroyCb();
        }
    }

    shouldComponentUpdate(nextProps: LazyImageProps, nextState: LazyImageState) {
        if (nextProps.isMobile !== this.props.isMobile) {
            return true;
        }
        if (nextState.isLoaded !== this.state.isLoaded) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <>
                {!this.state.isLoaded &&
                    <div className={this.props.classNames.loading}>
                        <StyledLoadingInstance />
                    </div>}
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
