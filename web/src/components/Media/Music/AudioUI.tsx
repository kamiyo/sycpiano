import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

import TweenLite from 'gsap/TweenLite';
import { LoadingInstance } from 'src/components/LoadingSVG';
import { setHoverPlaypause, setHoverSeekring, setMouseMove } from 'src/components/Media/Music/actions';
import { PauseButton, PauseIcon, PlayButton, PlayIcon } from 'src/components/Media/Music/Buttons';
import { cartesianToPolar } from 'src/components/Media/Music/utils';
import { GlobalStateShape } from 'src/types';

import { lightBlue } from 'src/styles/colors';
import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, playlistContainerWidth } from 'src/styles/variables';

interface AudioUIStateToProps {
    readonly isHoverPlaypause: boolean;
    readonly isMouseMove: boolean;
    readonly verticalOffset: number;
}

interface AudioUIDispatchToProps {
    readonly setHoverSeekring: typeof setHoverSeekring;
    readonly setHoverPlaypause: typeof setHoverPlaypause;
    readonly setMouseMove: typeof setMouseMove;
}

interface AudioUIOwnProps {
    readonly currentPosition: number;
    readonly isPlaying: boolean;
    readonly onDrag: (percent: number) => void;
    readonly onStartDrag: (percent: number) => void;
    readonly pause: () => void;
    readonly play: () => void;
    readonly seekAudio: (percent: number) => void;
    readonly isMobile: boolean;
    readonly isLoading: boolean;
    readonly getRadii: () => {
        inner: number;
        outer: number;
        base: number;
    };
}

type AudioUIProps = AudioUIOwnProps & AudioUIStateToProps & AudioUIDispatchToProps;

const getLoadingInstanceStyle = (verticalOffset: number) => css`
    position: relative;
    left: 50%;
    top: calc(50% + ${verticalOffset}px);
    transform: translateX(-50%) translateY(-50%);
    fill: none;
    stroke: ${lightBlue};
`;

const LoadingOverlay = styled('div') `
    position: absolute;
    z-index: 30;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`;

const UIContainer = styled('div') `
    position: absolute;
    width: calc(100% - ${playlistContainerWidth.desktop});
    height: 100%;
    left: 0;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;

    ${/* sc-selector */ screenM} {
        width: calc(100% - ${playlistContainerWidth.tablet});
    }

    /* stylelint-disable-next-line no-duplicate-selectors */
    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        height: 450px;
        top: ${navBarHeight.mobile}px;
    }
`;

const StyledSeekRing = styled('canvas') `
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    -webkit-tap-highlight-color: transparent;
`;

class AudioUI extends React.Component<AudioUIProps> {
    playButton: HTMLDivElement;
    pauseButton: HTMLDivElement;

    height: number;
    width: number;
    centerX: number;
    centerY: number;
    timerId: NodeJS.Timer;

    prevPercentage: number;

    isDragging: boolean;

    seekRing: HTMLCanvasElement;
    visualizationCtx: CanvasRenderingContext2D;

    setPlayButtonRef = (ref: HTMLDivElement) => {
        this.playButton = ref;
    }

    setPauseButtonRef = (ref: HTMLDivElement) => {
        this.pauseButton = ref;
    }

    togglePlaying = (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement> | KeyboardEvent | MouseEvent) => {
        if ((event as React.KeyboardEvent<HTMLElement> | KeyboardEvent).key === ' ' || (event as React.MouseEvent<HTMLElement> | MouseEvent).button === 0) {
            if (this.props.isPlaying) {
                this.props.pause();
            } else {
                this.props.play();
            }
        }
    }

    onResize = () => {
        this.height = this.seekRing.offsetHeight;
        this.width = this.seekRing.offsetWidth;
        this.seekRing.height = this.height;
        this.seekRing.width = this.width;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2 + this.props.verticalOffset;
    }

    initializeUI = () => {
        this.onResize();
        this.visualizationCtx = this.seekRing.getContext('2d');
        this.isDragging = false;
        this.props.setMouseMove(false);
        this.props.setHoverPlaypause(false);
    }

    isMouseEvent = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>): event is React.MouseEvent<HTMLElement> => {
        return event.type.match(/(m|M)ouse/) !== null;
    }

    getMousePositionInCanvas = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        const mouseX = (this.isMouseEvent(event)) ? event.clientX : event.touches[0].clientX;
        const mouseY = (this.isMouseEvent(event)) ? event.clientY : event.touches[0].clientY;
        const boundingRect = this.seekRing.getBoundingClientRect();
        return {
            x: mouseX - boundingRect.left,
            y: mouseY - boundingRect.top,
        };
    }

    isPointInCircle = (point: [number, number], radius: number, center: [number, number]) => {
        const context = this.visualizationCtx;
        context.beginPath();
        context.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        context.closePath();
        return context.isPointInPath(point[0], point[1]);
    }

    isEventInSeekRing = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        const canvasPos = this.getMousePositionInCanvas(event);
        const { inner, outer } = this.props.getRadii();
        const isInOuter = this.isPointInCircle([canvasPos.x, canvasPos.y], outer, [this.centerX, this.centerY]);
        const isInInner = this.isPointInCircle([canvasPos.x, canvasPos.y], inner, [this.centerX, this.centerY]);
        return isInOuter && !isInInner;
    }

    handleMousemove = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        const prevMoving = this.props.isMouseMove;
        if (this.isDragging) {
            this.prevPercentage = this.mousePositionToPercentage(event);
            this.props.onDrag(this.prevPercentage);
            this.seekRing.style.cursor = this.isMouseEvent(event) ? 'pointer' : 'default';
            this.props.setMouseMove(false);
        } else {
            if (this.isEventInSeekRing(event) && !this.props.isMobile) {
                this.seekRing.style.cursor = 'pointer';
                this.props.setHoverSeekring(true, this.mousePositionToAngle(event));
                if (!prevMoving) {
                    this.props.setMouseMove(false);
                } else {
                    if (this.timerId) {
                        clearTimeout(this.timerId);
                    }
                    this.timerId = setTimeout(() => this.props.setMouseMove(false), 1000);
                }
            } else {
                this.seekRing.style.cursor = 'default';
                this.props.setHoverSeekring(false, null);
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.props.setMouseMove(true);
                this.timerId = setTimeout(() => this.props.setMouseMove(false), 1000);
            }
        }
    }

    handleMouseup = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        const prevMoving = this.props.isMouseMove;
        if (this.isDragging) {
            this.props.seekAudio(this.prevPercentage);
            this.isDragging = false;
            if (!prevMoving) {
                this.props.setMouseMove(false);
            } else {
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(() => this.props.setMouseMove(false), 1000);
            }
            if (this.isMouseEvent(event) && !this.isEventInSeekRing(event)) {
                this.seekRing.style.cursor = 'default';
            }
        }
    }

    mousePositionToPercentage = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        return this.mousePositionToAngle(event) / (2 * Math.PI);
    }

    mousePositionToAngle = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        const mousePos = this.getMousePositionInCanvas(event);
        const polar = cartesianToPolar(mousePos.x - this.centerX, mousePos.y - this.centerY);
        let angle = polar.angle + Math.PI / 2;
        if (angle < 0) {
            angle += Math.PI * 2;
        }
        return angle;
    }

    handleMousedown = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (this.isEventInSeekRing(event)) {
            this.isDragging = true;
            this.prevPercentage = this.mousePositionToPercentage(event);
            this.props.onStartDrag(this.prevPercentage);
        }
    }

    handleMouseover = () => {
        this.props.setHoverPlaypause(true);
        if (this.props.isMobile) {
            setTimeout(() => this.props.setHoverPlaypause(false), 1000);
        }
    }

    handleMouseout = () => {
        this.props.setHoverPlaypause(false);
    }

    componentDidUpdate(prevProps: AudioUIProps) {
        if (prevProps.verticalOffset !== this.props.verticalOffset) {
            this.onResize();
        }
        if (prevProps.isPlaying !== this.props.isPlaying && !this.isDragging) {
            if (this.props.isPlaying) {
                TweenLite.fromTo(
                    this.playButton,
                    0.25,
                    { opacity: 1, scale: 1 },
                    { opacity: 0, scale: 5, delay: 0.1, force3D: true, clearProps: 'transform' },
                );
            } else {
                TweenLite.fromTo(
                    this.pauseButton,
                    0.25,
                    { opacity: 1, scale: 1 },
                    { opacity: 0, scale: 5, delay: 0.1, force3D: true, clearProps: 'transform' },
                );
            }
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.togglePlaying);
        window.addEventListener('resize', this.onResize);
        this.initializeUI();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.togglePlaying);
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        const buttonLength = this.props.getRadii().base * Math.SQRT1_2;
        return (
            <UIContainer>
                {this.props.isLoading &&
                    <LoadingOverlay>
                        <LoadingInstance
                            width={200}
                            height={200}
                            className={getLoadingInstanceStyle(this.props.verticalOffset)}
                        />
                    </LoadingOverlay>
                }
                <PauseIcon
                    setRef={this.setPauseButtonRef}
                    width={buttonLength}
                    height={buttonLength}
                    verticalOffset={this.props.verticalOffset}
                />
                <PlayIcon
                    setRef={this.setPlayButtonRef}
                    width={buttonLength}
                    height={buttonLength}
                    verticalOffset={this.props.verticalOffset}
                />
                {(this.props.isPlaying) ?
                    <PauseButton
                        onClick={this.togglePlaying}
                        isHovering={this.props.isHoverPlaypause}
                        onMouseMove={this.handleMousemove}
                        onMouseOver={this.handleMouseover}
                        onMouseOut={this.handleMouseout}
                        onMouseUp={this.handleMouseup}
                        width={buttonLength}
                        height={buttonLength}
                        verticalOffset={this.props.verticalOffset}
                    /> : <PlayButton
                        onClick={this.togglePlaying}
                        isHovering={this.props.isHoverPlaypause}
                        onMouseMove={this.handleMousemove}
                        onMouseOver={this.handleMouseover}
                        onMouseOut={this.handleMouseout}
                        onMouseUp={this.handleMouseup}
                        width={buttonLength}
                        height={buttonLength}
                        verticalOffset={this.props.verticalOffset}
                    />
                }
                <StyledSeekRing
                    innerRef={(canvas) => this.seekRing = canvas}
                    onMouseMove={this.handleMousemove}
                    onMouseUp={this.handleMouseup}
                    onMouseDown={this.handleMousedown}
                    onTouchStart={this.handleMousedown}
                    onTouchMove={this.handleMousemove}
                    onTouchEnd={this.handleMouseup}
                />
            </UIContainer>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    isHoverPlaypause: state.audio_ui.isHoverPlaypause,
    isMouseMove: state.audio_ui.isMouseMove,
    verticalOffset: state.audio_visualizer.verticalOffset,
});

const mapDispatchToProps: AudioUIDispatchToProps = {
    setHoverSeekring,
    setHoverPlaypause,
    setMouseMove,
};

export default connect<AudioUIStateToProps, AudioUIDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(AudioUI);
