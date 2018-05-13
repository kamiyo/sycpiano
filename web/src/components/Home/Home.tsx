import * as moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Transition } from 'react-transition-group';

import Ease from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';

import { lato1, lato2, lato2i } from 'src/styles/fonts';
import { generateSrcsetWidths, homeBackground, resizedImage, staticImage, sycChairVertical } from 'src/styles/imageUrls';
import { container, noHighlight } from 'src/styles/mixins';
import { navBarHeight } from 'src/styles/variables';

import { DesktopBackgroundPreview, MobileBackgroundPreview } from 'src/components/Home/PreviewSVGs';
import { LazyImage } from 'src/components/LazyImage';
import { screenLengths, screenXSandPortrait, screenXSorPortrait } from 'src/styles/screens';

const textShadowColor = 'rgba(0, 0, 0, 0.75)';

const HomeContainer = styled('div')`
    ${container}
    height: 100%;
    width: 100%;
`;

const Content = styled('div')`
    position: absolute;
    width: 100%;
    text-align: center;
    height: calc(100% - ${navBarHeight.desktop}px);
    bottom: 0;
    color: white;
    text-shadow: 0 0 8px ${textShadowColor};
    z-index: 100;
    overflow: hidden;

    ${/* sc-selector */ screenXSorPortrait} {
        height: calc(100% - ${navBarHeight.mobile}px);
    }
`;

const Name = styled('div')`
    font-family: ${lato2};
    font-size: calc(100vh / 8);
    position: absolute;
    text-transform: uppercase;
    width: 100%;
    top: 31%;

    ${/* sc-selector */ screenXSorPortrait} {
        font-size: calc(100vw / 6.2);
        bottom: 63%;
        top: unset;
    }
`;

const Skills = styled('div')`
    position: absolute;
    font-family: ${lato2};
    font-size: calc(100vh / 16);
    color: #fff6b0;
    text-shadow: 0 0 6px ${textShadowColor};
    width: 100%;
    top: 47%;

    ${/* sc-selector */ screenXSorPortrait} {
        font-size: calc(100vw / 16);
        bottom: 58%;
        top: unset;
    }
`;

const Handle = styled('div')`
    ${noHighlight}
    margin: 15px 0;
    font-family: ${lato2i};
    font-size: 30px;
    color: white;
    text-shadow: 0 0 6px ${textShadowColor};
    text-decoration: underline;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        cursor: pointer;
    }

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        bottom: 15%;
    }
`;

const BackgroundContainer = styled('div')`
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

const BackgroundCover = styled('div')`
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

const NavBarGradient = styled('div')`
    height: ${navBarHeight.desktop}px;
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
        height: ${navBarHeight.mobile}px;
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

const SocialContainer = styled('div')`
    position: absolute;
    width: fit-content;
    top: 55%;
    left: 50%;
    transform: translateX(-50%);

    ${/* sc-selector */ screenXSandPortrait} {
        bottom: 12%;
        font-size: 0.8rem;
        top: unset;
    }

`;

const StyledCopyright = styled('div')`
    position: absolute;
    bottom: 0;
    right: 0;
    font-family: ${lato1};
    font-weight: bold;
    color: white;
    padding: 20px 30px;

    ${/* sc-selector */ screenXSandPortrait} {
        width: 100%;
        font-size: 0.8rem;
    }
`;

const srcWidths = screenLengths.map((value) => (
    Math.round(value * 1779 / 2560)
));

const socials: {
    [key: string]: string;
} = {
    facebook: 'https://www.facebook.com/seanchenpiano',
    twitter: 'https://twitter.com/seanchenpiano',
    youtube: 'https://www.youtube.com/user/SeanChenPiano',
    spotify: 'https://open.spotify.com/artist/6kMZjx0C2LY2v2fUsaN27y?si=8Uxb9kFTQPisQCvAyOybMQ',
    linkedin: 'https://www.linkedin.com/in/seanchenpiano',
    instagram: 'https://www.instagram.com/seanchenpiano',
};

const SocialLink = styled<{ show: boolean; canHover: boolean; }, 'a'>('a')`
    padding: 1.5rem 0;
    width: calc(100vw / ${Object.keys(socials).length});
    max-width: 120px;
    display: inline-block;
    height: 100%;
    opacity: 0;
    pointer-events: ${props => props.show ? 'unset' : 'none'};
    filter: drop-shadow(0 0 0.5rem black);

    ${/* sc-selector */ screenXSandPortrait} {
        padding: .8rem 0;
    }

    ${props => props.canHover && `
        transition: transform 0.1s linear, filter 0.1s linear;
        &:hover {
            transform: scale(1.1);
            filter: drop-shadow(0 0 0.75rem black);
        }
    `}
`;

interface SocialMediaLinkProps {
    className?: string;
    social: string;
    show: boolean;
    canHover: boolean;
    url: string;
}

const SocialMediaLink: React.SFC<SocialMediaLinkProps> = (props) => (
    <SocialLink canHover={props.canHover} show={props.show} href={props.url} target="_blank">
        <img
            className={''}
            src={staticImage(`/soc-logos/${props.social}.svg`)}
        />
    </SocialLink>
);

interface HomeState {
    showSocial: boolean;
    canHover: { [key: string]: boolean; };
}

class Home extends React.Component<{ bgLoaded: () => void; isMobile: boolean; }, HomeState > {

    defaultCanHover = Object.keys(socials).reduce((prev, curr) => {
        return {
            ...prev,
            [curr]: false,
        };
    }, {});

    state: HomeState = {
        showSocial: false,
        canHover: this.defaultCanHover,
    };

    onHandleClick = () => {
        this.setState({ showSocial: !this.state.showSocial });
    }

    onSocialEnter = (id: number) => (el: HTMLLinkElement) => {
        const relative = id - (Object.keys(socials).length / 2 - 0.5);
        TweenLite.fromTo(el, 0.25, { opacity: 0, y: `-50%`, x: `${relative * -100}%` }, { opacity: 1, y: `0%`, x: `0%`, delay: .05 * id, ease: Ease.Elastic.easeOut.config(1, 0.75), clearProps: 'transform' });
    }

    onSocialExit = (id: number) => (el: HTMLLinkElement) => {
        const relative = id - Math.floor(Object.keys(socials).length / 2);
        TweenLite.fromTo(el, 0.25, { opacity: 1, y: `0%`, x: `0%` }, { opacity: 0, y: `-50%`, x: `${relative * -100}%` , delay: .05 * id, ease: Ease.Elastic.easeOut.config(1, 0.75), clearProps: 'transform' });
        this.setState({ canHover: this.defaultCanHover });
    }

    onImageLoaded = () => {
        this.props.bgLoaded();
    }

    render() {
        return (
            <HomeContainer>
                <BackgroundContainer>
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
                    <BackgroundCover />
                    <NavBarGradient />
                </BackgroundContainer>
                <Content>
                    <Name>Sean Chen</Name>
                    <Skills>pianist / composer / arranger</Skills>
                    <SocialContainer>
                        <Handle onClick={this.onHandleClick}>@seanchenpiano</Handle>
                        {
                            Object.keys(socials).map((key, idx) => {
                                return (
                                    <Transition
                                        key={key}
                                        in={this.state.showSocial}
                                        onEnter={this.onSocialEnter(idx)}
                                        onExit={this.onSocialExit(idx)}
                                        timeout={250 + 50 * idx}
                                        onEntered={() => this.setState({ canHover: { ...this.state.canHover, [key]: true }})}
                                    >
                                        <SocialMediaLink canHover={this.state.canHover[key]} show={this.state.showSocial} url={socials[key]} social={key} />
                                    </Transition>
                                );
                            })
                        }
                    </SocialContainer>
                    <StyledCopyright>Copyright © {moment().format('YYYY')} Sean Chen</StyledCopyright>
                </Content>
            </HomeContainer>
        );
    }
}

export type HomeType = typeof Home;
export default Home;
