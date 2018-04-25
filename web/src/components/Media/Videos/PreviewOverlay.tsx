import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import { playVideo } from 'src/components/Media/Videos/actions';
import { cliburn1, generateSrcsetWidths, resizedImage} from 'src/styles/imageUrls';
import { screenLengths, screenWidths, screenXS } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

import { LazyImage } from 'src/components/LazyImage';

interface PreviewOverlayStateToProps {
    readonly isPreviewOverlay: boolean;
}

interface PreviewOverlayDispatchToProps {
    readonly playVideo: typeof playVideo;
}

type PreviewOverlayProps = { isMobile: boolean } & PreviewOverlayStateToProps & PreviewOverlayDispatchToProps;

const StyledPreviewOverlay = styled<{ bgImage?: string; }, 'div'>('div') `
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    ${props => props.bgImage && `background-image: url(${props.bgImage});`}
    background-repeat: no-repeat;
    background-size: cover;

    ${/* sc-selector */ screenXS} {
        height: 56.25vw;
        top: ${navBarHeight.mobile}px;
        position: fixed;
    }

    &:hover {
        cursor: pointer;
    }

    svg {
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        fill: #030303;
        stroke: none;
    }
`;

const ytIconStyle = css`
    transition: all 0.2s;

    ${/* sc-selector */ StyledPreviewOverlay as any}:hover & {
        fill: #cc181e;
        fill-opacity: 1;
    }
`;

const imageLoaderStyle = css`
    visibility: hidden;
    position: absolute;
`;

class PreviewOverlay extends React.Component<PreviewOverlayProps, { bgImage: string; }> {
    state = { bgImage: '' };
    private bgRef: React.RefObject<HTMLDivElement> = React.createRef();

    onImageLoad = (el: HTMLImageElement) => {
        this.setState({ bgImage: el.currentSrc }, () => {
            TweenLite.to(
                this.bgRef.current,
                0.3,
                { autoAlpha: 1, delay: 0.2, clearProps: 'opacity' });
        });
    }

    onImageDestroy = () => {
        TweenLite.to(
            this.bgRef.current,
            0.1,
            { autoAlpha: 0 },
        );
    }

    render() {
        return (
            <Transition
                in={this.props.isPreviewOverlay}
                onExit={(el) => { TweenLite.fromTo(el, 0.3, { opacity: 1 }, { opacity: 0 }); }}
                timeout={300}
                unmountOnExit={true}
                mountOnEnter={true}
            >
                <StyledPreviewOverlay
                    onClick={() => {
                        this.props.playVideo(this.props.isMobile);
                    }}
                    bgImage={this.state.bgImage}
                    innerRef={this.bgRef}
                >
                    <svg viewBox="0 0 68 48" width="68" height="48">
                        <path className={ytIconStyle} d="m .66,37.62 c 0,0 .66,4.70 2.70,6.77 2.58,2.71 5.98,2.63 7.49,2.91 5.43,.52 23.10,.68 23.12,.68 .00,-1.3e-5 14.29,-0.02 23.81,-0.71 1.32,-0.15 4.22,-0.17 6.81,-2.89 2.03,-2.07 2.70,-6.77 2.70,-6.77 0,0 .67,-5.52 .67,-11.04 l 0,-5.17 c 0,-5.52 -0.67,-11.04 -0.67,-11.04 0,0 -0.66,-4.70 -2.70,-6.77 C 62.03,.86 59.13,.84 57.80,.69 48.28,0 34.00,0 34.00,0 33.97,0 19.69,0 10.18,.69 8.85,.84 5.95,.86 3.36,3.58 1.32,5.65 .66,10.35 .66,10.35 c 0,0 -0.55,4.50 -0.66,9.45 l 0,8.36 c .10,4.94 .66,9.45 .66,9.45 z" fill="#1f1f1e" fillOpacity="0.81" />
                        <path d="m 26.96,13.67 18.37,9.62 -18.37,9.55 -0.00,-19.17 z" fill="#fff" />
                        <path d="M 45.02,23.46 45.32,23.28 26.96,13.67 43.32,24.34 45.02,23.46 z" fill="#ccc" />
                    </svg>
                    <LazyImage
                        isMobile={this.props.isMobile}
                        id="video_preview_overlay"
                        classNames={{
                            mobile: imageLoaderStyle,
                            desktop: imageLoaderStyle,
                        }}
                        mobileAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(cliburn1('webp'), screenWidths),
                                sizes: '100vw',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(cliburn1(), screenWidths),
                                sizes: '100vw',
                            },
                            src: resizedImage(cliburn1(), { width: 640 }),
                        }}
                        desktopAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(cliburn1('webp'), screenLengths),
                                sizes: '100vw',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(cliburn1(), screenLengths),
                                sizes: '100vw',
                            },
                            src: resizedImage(cliburn1(), { height: 1080 }),
                        }}
                        alt="video preview"
                        successCb={this.onImageLoad}
                        destroyCb={this.onImageDestroy}
                    />
                </StyledPreviewOverlay>
            </Transition>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape): PreviewOverlayStateToProps => ({
    isPreviewOverlay: state.video_player.isPreviewOverlay,
});

const mapDispatchToProps: PreviewOverlayDispatchToProps = {
    playVideo,
};

export default connect<PreviewOverlayStateToProps, PreviewOverlayDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(PreviewOverlay);
