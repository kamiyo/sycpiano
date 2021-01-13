import Blazy from 'blazy';
import * as React from 'react';
import { Transition } from 'react-transition-group';

import { SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';

import { LoadingInstance } from 'src/components/LoadingSVG';
import { lightBlue } from 'src/styles/colors';
import { fadeOnEnter, fadeOnExit } from 'src/utils';

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

    activateBlazy = (): void => {
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

    componentDidMount(): void {
        this.mounted = true;
        this.activateBlazy();
    }

    componentWillUnmount(): void {
        this.mounted = false;
        clearTimeout(this.timeout);
        this.blazy.destroy();
    }

    componentDidUpdate(prevProps: LazyImageProps): void {
        if (prevProps.isMobile !== this.props.isMobile) {
            this.setState({ isLoaded: false });
            this.blazy.revalidate();
        }
    }

    render(): JSX.Element {
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
                <Transition<undefined>
                    in={loadingComponent && !this.state.isLoaded}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    onEnter={fadeOnEnter()}
                    onExit={fadeOnExit()}
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
