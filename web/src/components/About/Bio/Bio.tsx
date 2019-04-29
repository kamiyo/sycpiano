import * as React from 'react';
import { connect } from 'react-redux';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { fetchBioAction } from 'src/components/About/Bio/actions';
import { Blurb } from 'src/components/About/Bio/types';
import { onScroll, scrollFn } from 'src/components/App/NavBar/actions';

import { easeQuadOut } from 'd3-ease';
import TweenLite from 'gsap/TweenLite';

import { LazyImage } from 'src/components/LazyImage';

import { offWhite } from 'src/styles/colors';
import { lato2, lato3 } from 'src/styles/fonts';
import { generateSrcsetWidths, resizedImage, sycWithPianoBW } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenLengths, screenM, screenWidths, screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

import ReactMarkdown from 'react-markdown';

const pictureHeight = 250;

const Paragraph = styled.p`
    font-family: ${lato2};
    font-size: 1.2em;
    line-height: 2em;
    margin: 1.6em 0;

    ${screenXSorPortrait} {
        font-size: 1em;
        line-height: 1.6em;
        margin: 1.3em 0;
    }
`;

const SpaceFiller = styled.div`
    display: none;

    ${screenXSorPortrait} {
        display: block;
        height: ${pictureHeight}px;
        width: 100%;
        background-color: transparent;
    }
`;

const TextGroup = styled.div`
    ${screenXSorPortrait} {
        background-color: white;
        padding: 20px 20px;
    }
`;

const TextContainer = styled.div`
    box-sizing: border-box;
    flex: 0 0 45%;
    height: auto;
    padding: 20px 40px 20px 60px;
    background-color: ${offWhite};
    color: black;
    overflow-y: scroll;

    ${screenXSorPortrait} {
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

const NameSpan = styled.span({
    fontFamily: lato3,
});

interface BioTextProps {
    bio?: Blurb[];
}

class BioText extends React.Component<BioTextProps> {
    shouldComponentUpdate(nextProps: BioTextProps) {
        if (this.props.bio.length === nextProps.bio.length) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <TextContainer>
                <SpaceFiller />
                <TextGroup>
                    {this.props.bio.map(({ text }, i) => {
                        return <ReactMarkdown
                            key={i}
                            source={text}
                            renderers={{
                                paragraph: props => <Paragraph {...props} />,
                                strong: props => <NameSpan {...props} />,
                            }}
                        />;
                    })}
                </TextGroup>
            </TextContainer>
        );
    }
}

interface ImageContainerProps { currScrollTop: number; bgImage?: string; }

const ImageContainer = styled.div<ImageContainerProps>`
    flex: 1;
    background-image: ${props => props.bgImage ? `url(${props.bgImage})` : 'unset'};
    background-size: cover;
    background-position: center -100px;
    background-attachment: initial;
    background-repeat: no-repeat;
    background-color: black;
    visibility: hidden;

    ${screenM} {
        background-size: cover;
        background-position: center 0;
    }

    ${screenXSorPortrait} {
        position: fixed;
        z-index: 0;
        top: ${navBarHeight.mobile}px;
        height: ${pictureHeight}px;
        width: 100%;
        background-size: 106%;
        background-position: center 15%;
        opacity: ${props => easeQuadOut(Math.max(1 - props.currScrollTop / pictureHeight, 0))};
    }
`;

const BioContainer = styled.div`
    ${pushed}
    width: 100%;
    background-color: black;
    position: absolute;
    display: flex;

    ${screenXSorPortrait} {
        margin-top: 0;
        padding-top: ${navBarHeight.mobile}px;
        display: block;
        height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
`;

const srcWidths = screenLengths.map((value) => (
    Math.round(value * 1736 / 2560)
));

interface BioOwnProps {
    readonly isMobile: boolean;
}

interface BioState {
    readonly bgImage?: string;
}

interface BioStateToProps {
    readonly scrollTop: number;
    readonly bio: Blurb[];
}

interface BioDispatchToProps {
    readonly onScroll: typeof onScroll;
    readonly fetchBioAction: typeof fetchBioAction;
}

const imageLoaderStyle = css`
    visibility: hidden;
    position: absolute;
`;

type BioProps = BioOwnProps & BioStateToProps & BioDispatchToProps;

class About extends React.PureComponent<BioProps, BioState> {
    state: BioState = { bgImage: '' };
    private bgRef: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        this.props.fetchBioAction();
    }

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
            <BioContainer onScroll={this.props.isMobile ? scrollFn(pictureHeight + navBarHeight.mobile, this.props.onScroll) : null}>
                <ImageContainer
                    currScrollTop={this.props.scrollTop}
                    bgImage={this.state.bgImage}
                    ref={this.bgRef}
                >
                    <LazyImage
                        isMobile={this.props.isMobile}
                        id="about_lazy_image"
                        csss={{
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
                        alt="about background"
                        successCb={this.onImageLoad}
                        destroyCb={this.onImageDestroy}
                    />
                </ImageContainer>
                <BioText bio={this.props.bio} />
            </BioContainer>
        );
    }
}

const mapStateToProps = ({ bio, navbar }: GlobalStateShape) => ({
    scrollTop: navbar.lastScrollTop,
    bio: bio.bio,
});

const connectedAbout = connect<BioStateToProps, BioDispatchToProps, BioOwnProps>(
    mapStateToProps,
    {
        onScroll,
        fetchBioAction,
    },
)(About);

export type BioType = new (props: any) => React.Component<BioProps>;
export type RequiredProps = BioOwnProps;
export default connectedAbout;
