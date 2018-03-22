import * as moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { easeQuadOut } from 'd3-ease';
import TweenLite from 'gsap/TweenLite';

import blurbs from 'src/components/About/blurbs';
import { LazyImage } from 'src/components/LazyImage';

import { offWhite } from 'src/styles/colors';
import { lato1, lato2, lato3 } from 'src/styles/fonts';
import { generateSrcsetWidths, resizedImage, sycWithPianoBW, sycWithPianoBWWebP } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenLengths, screenM, screenPortrait, screenXS } from 'src/styles/screens';

const pictureHeight = 250;

const FirstLetter = styled('span') `
    display: block;
    float: left;
    font-family: ${lato1};
    font-size: 68px;
    margin-left: -6px;
`;

const Paragraph = styled('p') `
    font-family: ${lato2};
    font-size: 19px;
    margin: 21px 0 21px 0;
    line-height: 2.2em;
`;

const SpaceFiller = styled('div') `
    display: none;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        display: block;
        height: ${pictureHeight}px;
        width: 100%;
        background-color: transparent;
    }
`;

const TextGroup = styled('div') `
    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        background-color: white;
        padding: 20px 30px;
    }
`;

const AboutText: React.SFC<{ className?: string }> = (props) => (
    <div className={props.className}>
        <SpaceFiller />
        <TextGroup>
            {blurbs.map((blurb, i) => {
                if (i === 0) {
                    const firstLetter = blurb[0];
                    const age = moment().diff('1988-08-27', 'year');
                    blurb = blurb.replace(/##/, age.toString());
                    const withoutFirstLetter = blurb.slice(1);
                    const nameLocation = withoutFirstLetter.indexOf('Sean Chen');
                    const name = withoutFirstLetter.slice(nameLocation, nameLocation + 9);
                    const beforeName = withoutFirstLetter.slice(0, nameLocation);
                    const afterName = withoutFirstLetter.slice(nameLocation + 9);
                    return (
                        <Paragraph key={i}>
                            <FirstLetter>{firstLetter}</FirstLetter>
                            {beforeName}
                            <span className={css` font-family: ${lato3}; `}>
                                {name}
                            </span>
                            {afterName}
                        </Paragraph>
                    );
                }
                return <Paragraph key={i}>{blurb}</Paragraph>;
            })}
        </TextGroup>
    </div>
);

interface ImageContainerProps { currScrollTop: number; bgImage?: string; }

const ImageContainer = styled<ImageContainerProps, 'div'>('div') `
    flex: 1;
    /* stylelint-disable-next-line */
    ${props => props.bgImage && `background-image: url(${props.bgImage});`}
    background-size: cover;
    background-position: center -100px;
    background-attachment: initial;
    background-repeat: no-repeat;
    background-color: black;
    visibility: hidden;

    /* stylelint-disable-next-line */
    ${screenM} {
        background-size: cover;
        background-position: center 0;
    }

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        position: absolute;
        height: ${pictureHeight}px;
        width: 100%;
        background-size: 106%;
        background-position: center 15%;
        opacity: ${props => `${easeQuadOut(Math.max(1 - props.currScrollTop / pictureHeight, 0))}`};
    }
`;

const TextContainer = styled(AboutText) `
    box-sizing: border-box;
    flex: 0 0 45%;
    height: auto;
    padding: 20px 40px 20px 60px;
    background-color: ${offWhite};
    color: black;
    overflow-y: scroll;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        position: absolute;
        margin-top: 0;
        height: 100%;
        left: 0;
        overflow-y: scroll;
        text-align: justify;
        background-color: transparent;
        padding: 0;
    }
`;

const AboutContainer = styled('div') `
    ${pushed};
    width: 100%;
    background-color: black;
    position: absolute;
    display: flex;

    /* stylelint-disable-next-line */
    ${screenXS} {
        display: block;
    }
`;

const srcWidths = screenLengths.map((value) => (
    Math.round(value * 1736 / 2560)
));

const mobileWidths = [1600, 1440, 1080, 800, 768, 720, 640, 480, 320];

interface AboutProps {
    readonly isMobile: boolean;
}

interface AboutState {
    readonly currScrollTop: number;
    readonly bgImage?: string;
}

const imageLoaderStyle = css`
    visibility: hidden;
    position: absolute;
`;

class About extends React.Component<AboutProps, AboutState> {
    state: AboutState = { currScrollTop: 0, bgImage: '' };
    private bgRef: HTMLDivElement;

    setScrollTop = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ currScrollTop: (event.target as HTMLElement).scrollTop });
    };

    onImageLoad = (el: HTMLImageElement) => {
        this.setState({ bgImage: el.currentSrc }, () => {
            TweenLite.to(
                this.bgRef,
                0.3,
                { autoAlpha: 1, delay: 0.2, clearProps: 'opacity' });
        });
    }

    onImageDestroy = () => {
        TweenLite.to(
            this.bgRef,
            0.1,
            { autoAlpha: 0 },
        );
    }

    render() {
        return (
            <AboutContainer onScroll={this.setScrollTop}>
                <ImageContainer
                    currScrollTop={this.state.currScrollTop}
                    bgImage={this.state.bgImage}
                    innerRef={(div) => this.bgRef = div}
                >
                    <LazyImage
                        isMobile={this.props.isMobile}
                        id="about_lazy_image"
                        classNames={{
                            mobile: imageLoaderStyle,
                            desktop: imageLoaderStyle,
                        }}
                        mobileAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(sycWithPianoBWWebP, mobileWidths),
                                sizes: '100vw',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(sycWithPianoBW, mobileWidths),
                                sizes: '100vw',
                            },
                            src: resizedImage(sycWithPianoBW, { width: 640 }),
                        }}
                        desktopAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(sycWithPianoBWWebP, srcWidths),
                                sizes: '100vh',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(sycWithPianoBW, srcWidths),
                                sizes: '100vh',
                            },
                            src: resizedImage(sycWithPianoBW, { height: 1080 }),
                        }}
                        alt="about background"
                        successCb={this.onImageLoad}
                        destroyCb={this.onImageDestroy}
                    />
                </ImageContainer>
                <TextContainer />
            </AboutContainer>
        );
    }
}

export type AboutType = typeof About;
export default About;
