import * as React from 'react';
import styled, { css } from 'react-emotion';

import { lato2, lato2i } from 'src/styles/fonts';
import { generateSrcsetWidths, homeBackground, resizedImage, sycChairVertical } from 'src/styles/imageUrls';
import { container } from 'src/styles/mixins';
import { navBarHeight } from 'src/styles/variables';

import { DesktopBackgroundPreview, MobileBackgroundPreview } from 'src/components/Home/PreviewSVGs';
import { LazyImage } from 'src/components/LazyImage';
import { screenLengths, screenXSorPortrait } from 'src/styles/screens';

const textShadowColor = 'rgba(0, 0, 0, 0.75)';

const HomeContainer = styled('div') `
    ${container}
    height: 100%;
    width: 100%;
`;

const Content = styled('div') `
    position: absolute;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    text-shadow: 0 0 8px ${textShadowColor};
    z-index: 100;

    ${/* sc-selector */ screenXSorPortrait} {
        height: 100%;
    }
`;

const Name = styled<{ isMobile: boolean; }, 'div'>('div') `
    font-family: ${lato2};
    font-size: ${props => props.isMobile ? 'calc(100vw / 6.2)' : 'calc(100vh / 8)'};
    text-transform: uppercase;

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        position: absolute;
        bottom: 63%;
    }
`;

const Skills = styled<{ isMobile: boolean; }, 'div'>('div') `
    font-family: ${lato2};
    font-size: ${props => props.isMobile ? `calc(100vw / 16)` : `calc(100vh / 16)`};
    color: #fff6b0;
    text-shadow: 0 0 6px ${textShadowColor};

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        position: absolute;
        bottom: 58%;
    }
`;

const Handle = styled<{ isMobile: boolean; }, 'div'>('div') `
    margin-top: 15px;
    font-family: ${lato2i};
    font-size: 30px;
    color: white;
    text-shadow: 0 0 6px ${textShadowColor};

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        position: absolute;
        bottom: 5%;
    }
`;

const BackgroundContainer = styled('div') `
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
`;

const backgroundStyle = css`
    height: 100%;
    width: 100%;
    position: absolute;
    filter: saturate(0.8);
    z-index: 0;
    object-fit: cover;
`;

const desktopBackgroundStyle = css`
    ${backgroundStyle}
    object-position: 50% 35%;
`;

const mobileBackgroundStyle = css`
    ${backgroundStyle}
    object-position: 50% 100%;
`;

const loadingStyle = css`
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
`;

const BackgroundCover = styled<{ isMobile: boolean; }, 'div'>('div') `
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-image:
        linear-gradient(
            66deg,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0.2) 75%
        );

    ${/* sc-selector */ screenXSorPortrait} {
        background-image:
            linear-gradient(
                66deg,
                rgba(0, 0, 0, 0) 30%,
                rgba(0, 0, 0, 0.2) 55%
            );
    }
`;

const NavBarGradient = styled<{ isMobile: boolean; }, 'div'>('div') `
    height: ${props => props.isMobile ? navBarHeight.mobile : navBarHeight.desktop}px;
    padding: 0 30px 0 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background-image:
        linear-gradient(
            122deg,
            rgba(3, 3, 3, 0.4) 5%,
            rgba(255, 255, 255, 0.11) 20%,
            rgba(255, 255, 255, 0.62) 22%,
            rgba(255, 255, 255, 0.6) 40%,
            rgba(53, 53, 53, 0.27) 70%
        );

    ${/* sc-selector */ screenXSorPortrait} {
        background-image:
            linear-gradient(
                122deg,
                rgba(3, 3, 3, 0.4) 5%,
                rgba(255, 255, 255, 0.11) 40%,
                rgba(255, 255, 255, 0.21) 52%,
                rgba(255, 255, 255, 0.36) 60%,
                rgba(53, 53, 53, 0.27) 90%
            );
    }
`;

/*
from original CSS file, feel free to convert to css object instead of using styled

const Quote = styled('div')`
    font-family: ${lato2i};
    font-size: 40px;
    position: absolute;
    color: white;
    bottom: 50px;
    right: 50px;
    text-shadow: 2px 2px 4px ${textShadowColor};
    opacity: 0;
`;

const doubleQuote = css`
    font-size: 95px;
    position: absolute;
`;

const OpenQuote = styled('div')`
    ${doubleQuote}
    top: -13px;
    left: -35px;
`;

const CloseQuote = styled('div')`
    ${doubleQuote}
    bottom: -10px;
    right: 86px;
`;

const QuoteAuthor = styled('div')`
    float: right;
`;

const NextEvent = styled('div')`
    position: absolute;
    ${pushed}
    margin-top: 50px;
    left: 0;
    color: black;
    font-family:${lato2i};
    background-color: rgba(248, 248, 248, .8);
    padding: 10px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
`;

const EventLabel = styled('div')`
    font-size: 35px;
`;

const EventDate = styled('div')`
    font-size: 25px;
    span {
        display: inline-block;
    }
`;

const Separator = styled('div')`
    margin: 0 12px;
`;

const EventName = styled('div')`
    font-size: 40px;
    font-family: ${lato2}
`;

const EventLocation = styled('div')`
    font-size: 17px;
`;
*/

const srcWidths = screenLengths.map((value) => (
    Math.round(value * 1779 / 2560)
));

class Home extends React.Component<{ bgLoaded: () => void; isMobile: boolean; }> {
    private bgRef: HTMLDivElement;

    onImageLoaded = () => {
        this.props.bgLoaded();
    }

    render() {
        return (
            <HomeContainer>
                <BackgroundContainer innerRef={(div) => this.bgRef = div}>
                    <LazyImage
                        isMobile={this.props.isMobile}
                        id="home_bg"
                        classNames={{
                            mobile: mobileBackgroundStyle,
                            desktop: desktopBackgroundStyle,
                            loading: loadingStyle,
                        }}
                        mobileAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(sycChairVertical('webp'), srcWidths),
                                sizes: '100vh',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(sycChairVertical(), srcWidths),
                                sizes: '100vh',
                            },
                            src: resizedImage(sycChairVertical(), { height: 1920 }),
                        }}
                        desktopAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(homeBackground('webp'), screenLengths),
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(homeBackground(), screenLengths),
                            },
                            src: resizedImage(homeBackground(), { width: 1920 }),
                        }}
                        loadingComponent={this.props.isMobile ? MobileBackgroundPreview : DesktopBackgroundPreview}
                        alt="home background"
                        successCb={this.onImageLoaded}
                    />
                    <BackgroundCover isMobile={this.props.isMobile} />
                    <NavBarGradient isMobile={this.props.isMobile} />
                </BackgroundContainer>
                <Content>
                    <Name isMobile={this.props.isMobile}>Sean Chen</Name>
                    <Skills isMobile={this.props.isMobile}>pianist / composer / arranger</Skills>
                    <Handle isMobile={this.props.isMobile}>@seanchenpiano</Handle>
                </Content>
            </HomeContainer>
        );
    }
}

export type HomeType = typeof Home;
export default Home;
