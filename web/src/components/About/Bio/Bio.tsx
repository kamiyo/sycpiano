import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { fetchBioAction } from 'src/components/About/Bio/actions';
import { Blurb } from 'src/components/About/Bio/types';
import { onScroll, scrollFn } from 'src/components/App/NavBar/actions';

import { easeQuadOut } from 'd3-ease';
import { TweenLite } from 'gsap';

import PortfolioButton from 'src/components/About/Bio/PortfolioButton';
import { LazyImage } from 'src/components/LazyImage';

import { offWhite } from 'src/styles/colors';
import { lato2, lato3 } from 'src/styles/fonts';
import { generateSrcsetWidths, resizedImage, sycWithPianoBW } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenLengths, screenM, screenWidths, screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

const pictureHeight = 250;

const Paragraph = styled.p({
    fontFamily: lato2,
    fontSize: '1.2em',
    lineHeight: '2em',
    margin: '1.6em 0',

    [screenXSorPortrait]: {
        fontSize: '1em',
        lineHeight: '1.6em',
        margin: '1.3em 0',
    }
});

const SpaceFiller = styled.div({
    display: 'none',

    [screenXSorPortrait]: {
        display: 'block',
        height: pictureHeight,
        width: '100%',
        backgroundColor: 'transparent',
    }
});

const TextGroup = styled.div({
    [screenXSorPortrait]: {
        backgroundColor: 'white',
        padding: '20px 20px',
    }
});

const TextContainer = styled.div({
    boxSizing: 'border-box',
    flex: '0 0 45%',
    height: 'auto',
    padding: '20px 40px 80px 60px',
    backgroundColor: offWhite,
    color: 'black',
    overflowY: 'scroll',

    [screenXSorPortrait]: {
        position: 'relative',
        zIndex: 1,
        marginTop: 0,
        height: '100%',
        left: 0,
        backgroundColor: 'transparent',
        padding: 0,
        overflowY: 'visible',
    },
});

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
                        return (
                            <ReactMarkdown
                                key={i}
                                source={text}
                                renderers={{
                                    paragraph: props => <Paragraph {...props} />,
                                    strong: props => <NameSpan {...props} />,
                                }}
                            />
                        );
                    })}
                </TextGroup>
            </TextContainer>
        );
    }
}

interface ImageContainerProps { currScrollTop: number; bgImage?: string }

const ImageContainer = styled.div<ImageContainerProps>({
    flex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'center 100px',
    backgroundAttachment: 'initial',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'black',
    visibility: 'hidden',

    [screenM]: {
        backgroundSize: 'cover',
        backgroundPosition: 'center 0',
    },

    [screenXSorPortrait]: {
        position: 'fixed',
        zIndex: 0,
        top: navBarHeight.mobile,
        height: pictureHeight,
        width: '100%',
        backgroundSize: '106%',
        backgroundPosition: 'center 15%',
    }
}, ({ currScrollTop, bgImage }) => ({
    backgroundImage: bgImage ? `url(${bgImage})` : 'unset',
    opacity: easeQuadOut(Math.max(1 - currScrollTop / pictureHeight, 0)),
}));

const BioContainer = styled.div(
    pushed,
    {

        width: '100%',
        backgroundColor: 'black',
        position: 'absolute',
        display: 'flex',
        [screenXSorPortrait]: {
            marginTop: 0,
            paddingTop: navBarHeight.mobile,
            display: 'block',
            height: '100%',
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch',
        },
    });

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
    readonly onScroll: (triggerHeight: number, scrollTop: number) => void;
    readonly fetchBioAction: () => Promise<void>;
}

const imageLoaderStyle = css({
    visibility: 'hidden',
    position: 'absolute',
});

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
                <PortfolioButton />
            </BioContainer>
        );
    }
}

const mapStateToProps = ({ bio, navbar }: GlobalStateShape) => ({
    scrollTop: navbar.lastScrollTop,
    bio: bio.bio,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<GlobalStateShape, undefined, Action>) => ({
    onScroll: (triggerHeight: number, scrollTop: number) => dispatch(onScroll(triggerHeight, scrollTop)),
    fetchBioAction: () => dispatch(fetchBioAction()),
});

const connectedAbout = connect<BioStateToProps, BioDispatchToProps, BioOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(About);

export type BioType = new (props: BioProps) => React.Component<BioProps>;
export type RequiredProps = BioOwnProps;
export default connectedAbout;
