import * as React from 'react';
import styled from 'react-emotion';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';
import { hiDPI } from 'polished';

import { lato2, lato2i } from 'src/styles/fonts';
import { homeBackground, resizedImage } from 'src/styles/imageUrls';
import { container } from 'src/styles/mixins';
import { navBarHeight } from 'src/styles/variables';
import { getViewportSize } from 'src/utils';

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
`;

const Name = styled('div') `
    font-family: ${lato2};
    font-size: 100px;
    text-transform: uppercase;
`;

const Skills = styled('div') `
    font-family: ${lato2};
    font-size: 30px;
    color: #efe6b0;
    text-shadow: 0 0 6px ${textShadowColor};
`;

const Handle = styled('div') `
    margin-top: 15px;
    font-family: ${lato2i};
    font-size: 30px;
    color: white;
    text-shadow: 0 0 6px ${textShadowColor};
`;

const BackgroundContainer = styled('div') `
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
`;

const Background = styled('img') `
    top: 0;
    left: 50%;
    width: 100%;
    position: absolute;
    filter: saturate(0.8);
    transform: translateX(-50%) translateY(-16%);
    z-index: 0;
`;

const BackgroundCover = styled('div') `
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
`;

const NavBarGradient = styled('div') `
    height: ${navBarHeight.nonHdpi}px;
    padding: 0 30px 0 0;

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${hiDPI(2)} {
        height: ${navBarHeight.hdpi}px;
        padding-left: 15px;
    }

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
            rgba(255, 255, 255, 0.6) 50%,
            rgba(53, 53, 53, 0.27) 70%
        );
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

class Home extends React.Component<{ bgLoaded: () => void }, { bgLoaded: boolean; }> {
    private imgRef: HTMLImageElement;
    private bgRef: HTMLDivElement;
    state = {
        bgLoaded: false,
    };

    componentWillMount() {
        const img = new Image();
        img.onload = () => {
            this.imgRef.src = img.src;
            this.setState({ bgLoaded: true });
        };
        const { width } = getViewportSize();
        img.src = resizedImage(homeBackground, { width });
    }

    render() {
        return (
            <HomeContainer>
                <Transition
                    in={this.state.bgLoaded}
                    onEnter={() => {
                        this.props.bgLoaded();
                        TweenLite.fromTo(this.bgRef, 0.3, { opacity: 0 }, { opacity: 1 });
                    }}
                    timeout={300}
                    appear={true}
                >
                    <BackgroundContainer innerRef={(div) => this.bgRef = div}>
                        <Background alt="Sean Chen Pianist Photo" innerRef={(img) => this.imgRef = img} />
                        <BackgroundCover />
                        <NavBarGradient />
                    </BackgroundContainer>
                </Transition>
                <Content>
                    <Name>Sean Chen</Name>
                    <Skills>pianist / composer / arranger</Skills>
                    <Handle>@seanchenpiano</Handle>
                </Content>
            </HomeContainer>
        );
    }
}

export default Home;
