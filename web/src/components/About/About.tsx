import * as moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

import { setOnScroll } from 'src/components/App/NavBar/actions';

import { easeQuadOut } from 'd3-ease';
import TweenLite from 'gsap/TweenLite';

import blurbs from 'src/components/About/blurbs';
import { LazyImage } from 'src/components/LazyImage';

import { offWhite } from 'src/styles/colors';
import { lato2, lato3 } from 'src/styles/fonts';
import { generateSrcsetWidths, resizedImage, sycWithPianoBW } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenLengths, screenM, screenPortrait, screenWidths, screenXS } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

const pictureHeight = 250;

const Paragraph = styled('p') `
    font-family: ${lato2};
    font-size: 1.2em;
    line-height: 2em;
    margin: 1.6em 0;

    ${/*sc-selector*/ screenXS} {
        font-size: 1em;
        line-height: 1.6em;
        margin: 1.3em 0;
    }
`;

const SpaceFiller = styled('div') `
    display: none;

    ${/*sc-selector*/ screenPortrait},
    ${/*sc-selector*/ screenXS} {
        display: block;
        height: ${pictureHeight}px;
        width: 100%;
        background-color: transparent;
    }
`;

const TextGroup = styled('div') `
    ${/*sc-selector*/ screenPortrait},
    ${/*sc-selector*/ screenXS} {
        background-color: white;
        padding: 20px 20px;
    }
`;

const AboutText: React.SFC<{ className?: string }> = (props) => (
    <div className={props.className}>
        <SpaceFiller />
        <TextGroup>
            {blurbs.map((blurb, i) => {
                if (i === 0) {
                    const age = moment().diff('1988-08-27', 'year');
                    blurb = blurb.replace(/##/, age.toString());
                    const nameLocation = blurb.indexOf('Sean Chen');
                    const name = blurb.slice(nameLocation, nameLocation + 9);
                    const beforeName = blurb.slice(0, nameLocation);
                    const afterName = blurb.slice(nameLocation + 9);
                    return (
                        <Paragraph key={i}>
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
    ${props => props.bgImage && `background-image: url(${props.bgImage});`}
    background-size: cover;
    background-position: center -100px;
    background-attachment: initial;
    background-repeat: no-repeat;
    background-color: black;
    visibility: hidden;

    ${/* sc-sel */ screenM} {
        background-size: cover;
        background-position: center 0;
    }

    /* stylelint-disable-next-line */
    ${/* sc-sel */ screenPortrait},
    ${/* sc-sel */ screenXS} {
        position: fixed;
        z-index: 0;
        top: ${navBarHeight}px;
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

    ${/* sc-selector */ screenPortrait},
    ${/* sc-selector */ screenXS} {
        position: relative;
        z-index: 1;
        margin-top: 0;
        height: 100%;
        left: 0;
        background-color: transparent;
        padding: 0;
        overflow-y: visible;
    }
`;

const AboutContainer = styled('div') `
    ${pushed};
    width: 100%;
    background-color: black;
    position: absolute;
    display: flex;

    ${/* sc-selector */ screenXS} {
        margin-top: 0;
        padding-top: ${navBarHeight.mobile}px;
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
`;

const srcWidths = screenLengths.map((value) => (
    Math.round(value * 1736 / 2560)
));

interface AboutOwnProps {
    readonly isMobile: boolean;
}

interface AboutState {
    readonly bgImage?: string;
}

interface AboutStateToProps {
    readonly scrollTop: number;
    readonly onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface AboutDispatchToProps {
    readonly setOnScroll: typeof setOnScroll;
}

const imageLoaderStyle = css`
    visibility: hidden;
    position: absolute;
`;

type AboutProps = AboutOwnProps & AboutStateToProps & AboutDispatchToProps;

class About extends React.Component<AboutProps, AboutState> {
    state: AboutState = { bgImage: '' };
    private bgRef: HTMLDivElement;

    componentDidMount() {
        this.props.setOnScroll(pictureHeight + navBarHeight.mobile);
    }

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
            <AboutContainer onScroll={this.props.isMobile ? this.props.onScroll : null}>
                <ImageContainer
                    currScrollTop={this.props.scrollTop}
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
                                srcset: generateSrcsetWidths(sycWithPianoBW('webp'), screenWidths),
                                sizes: '100vw',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(sycWithPianoBW(), screenWidths),
                                sizes: '100vw',
                            },
                            src: resizedImage(sycWithPianoBW(), { width: 640 }),
                        }}
                        desktopAttributes={{
                            webp: {
                                srcset: generateSrcsetWidths(sycWithPianoBW('webp'), srcWidths),
                                sizes: '100vh',
                            },
                            jpg: {
                                srcset: generateSrcsetWidths(sycWithPianoBW(), srcWidths),
                                sizes: '100vh',
                            },
                            src: resizedImage(sycWithPianoBW(), { height: 1080 }),
                        }}
                        showLoading={false}
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

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    onScroll: navbar.onScroll,
    scrollTop: navbar.lastScrollTop,
});

const connectedAbout = connect<AboutStateToProps, AboutDispatchToProps, AboutProps>(
    mapStateToProps,
    { setOnScroll },
)(About);

export type AboutType = typeof connectedAbout;
export default connectedAbout;
