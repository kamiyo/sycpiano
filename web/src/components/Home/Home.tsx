import * as React from 'react';
import styled, { css } from 'react-emotion';

import TweenLite from 'gsap/TweenLite';

import { lato2, lato2i } from 'src/styles/fonts';
import { generateSrcsetWidths, homeBackground, homeBackgroundWebP, resizedImage, sycChairVertical, sycChairVerticalWebP } from 'src/styles/imageUrls';
import { container } from 'src/styles/mixins';
import { navBarHeight } from 'src/styles/variables';

import { LazyImage } from 'src/components/LazyImage';
import { screenLengths } from 'src/styles/screens';

const textShadowColor = 'rgba(0, 0, 0, 0.75)';

const HomeContainer = styled('div') `
    ${container}
    height: 100%;
    width: 100%;
`;

const Content = styled<{ isMobile: boolean; }, 'div'>('div') `
    position: absolute;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    text-shadow: 0 0 8px ${textShadowColor};
    z-index: 100;

    /* stylelint-disable-next-line */
    ${props => props.isMobile && 'height: 100%;'}
`;

const Name = styled<{ isMobile: boolean; }, 'div'>('div') `
    font-family: ${lato2};
    font-size: ${props => props.isMobile ? 'calc(100vw / 6.2)' : 'calc(100vh / 8)'};
    text-transform: uppercase;

    /* stylelint-disable */
    ${props => props.isMobile && `
        width: 100%;
        position: absolute;
        bottom: 63%;
    `}
    /* stylelint-enable */
`;

const Skills = styled<{ isMobile: boolean; }, 'div'>('div') `
    font-family: ${lato2};
    font-size: ${props => props.isMobile ? `calc(100vw / 16)` : `calc(100vh / 16)`};
    color: #fff6b0;
    text-shadow: 0 0 6px ${textShadowColor};

    /* stylelint-disable */
    ${props => props.isMobile && `
        width: 100%;
        position: absolute;
        bottom: 58%;
    `}
    /* stylelint-enable */
`;

const Handle = styled<{ isMobile: boolean; }, 'div'>('div') `
    margin-top: 15px;
    font-family: ${lato2i};
    font-size: 30px;
    color: white;
    text-shadow: 0 0 6px ${textShadowColor};

    /* stylelint-disable */
    ${props => props.isMobile && `
        width: 100%;
        position: absolute;
        bottom: 5%;
    `}
    /* stylelint-enable */
`;

const BackgroundContainer = styled('div') `
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    overflow: hidden;
`;

const backgroundStyle = css`
    top: 0;
    left: 50%;
    width: 100%;
    position: absolute;
    filter: saturate(0.8);
    transform: translateX(-50%) translateY(-16%);
    z-index: 0;
`;

const mobileBackgroundStyle = css`
    bottom: 0;
    left: 50%;
    height: 100%;
    position: absolute;
    filter: saturate(0.8);
    transform: translateX(-50%);
    z-index: 0;
`;

const BackgroundCover = styled<{ isMobile: boolean; }, 'div'>('div') `
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    /* stylelint-disable */
    background-image: ${props => props.isMobile ? `
        linear-gradient(
            66deg,
            rgba(0,0,0,0) 30%,
            rgba(0,0,0,0.2) 55%
        );` : `
        linear-gradient(
            66deg,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0.2) 75%
        );`}
    /* stylelint-enable */
`;

const NavBarGradient = styled<{ isMobile: boolean; }, 'div'>('div') `
    height: ${props => props.isMobile ? navBarHeight.mobile : navBarHeight.desktop}px;
    padding: 0 30px 0 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;

    /* stylelint-disable */
    background-image: ${props => props.isMobile ? `
        linear-gradient(
            122deg,
            rgba(3,3,3,0.4) 5%,
            rgba(255,255,255,0.11) 40%,
            rgba(255, 255, 255, 0.21) 52%,
            rgba(255, 255, 255, 0.36) 60%,
            rgba(53,53,53,0.27) 90%
        );` : `
        linear-gradient(
            122deg,
            rgba(3, 3, 3, 0.4) 5%,
            rgba(255, 255, 255, 0.11) 20%,
            rgba(255, 255, 255, 0.62) 22%,
            rgba(255, 255, 255, 0.6) 40%,
            rgba(53, 53, 53, 0.27) 70%
        );`}
    /* stylelint-enable */
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

class Home extends React.Component<{ bgLoaded: () => void; isMobile: boolean; }, {}> {
    private bgRef: HTMLDivElement;

    onImageLoaded = () => {
        this.props.bgLoaded();
        TweenLite.to(this.bgRef, 0.3, { autoAlpha: 1 });
    }

    onImageDestroy = () => {
        TweenLite.to(this.bgRef, 0.1, { autoAlpha: 0 });
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
                            desktop: backgroundStyle,
                        }}
                        mobileAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(sycChairVerticalWebP, srcWidths),
                                sizes: '100vh',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(sycChairVertical, srcWidths),
                                sizes: '100vh',
                            },
                            src: resizedImage(sycChairVertical, { height: 1920 }),
                        }}
                        desktopAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(homeBackgroundWebP, screenLengths),
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(homeBackground, screenLengths),
                            },
                            src: resizedImage(homeBackground, { width: 1920 }),
                        }}
                        alt="home background"
                        successCb={this.onImageLoaded}
                        destroyCb={this.onImageDestroy}
                    />
                    <BackgroundCover isMobile={this.props.isMobile} />
                    <NavBarGradient isMobile={this.props.isMobile} />
                </BackgroundContainer>
                <Content isMobile={this.props.isMobile}>
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
