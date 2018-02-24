import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

import TweenLite from 'gsap/TweenLite';
import { LoadingInstance } from 'src/components/LoadingSVG';
import { setHoverPlaypause, setHoverSeekring, setMouseMove } from 'src/components/Media/Music/actions';
import { PauseButton, PauseIcon, PlayButton, PlayIcon } from 'src/components/Media/Music/Buttons';
import { GlobalStateShape } from 'src/types';
import { cartesianToPolar } from 'src/utils';

import { lightBlue } from 'src/styles/colors';
import { playlistWidth } from 'src/styles/variables';

interface AudioUIStateToProps {
    readonly innerRadius: number;
    readonly isHoverPlaypause: boolean;
    readonly isMouseMove: boolean;
    readonly outerRadius: number;
    readonly baseRadius: number;
    readonly verticalOffset: number;
}

interface AudioUIDispatchToProps {
    readonly setHoverSeekring: (isHoverSeekring: boolean, angle: number) => void;
    readonly setHoverPlaypause: (isHoverPlaypause: boolean) => void;
    readonly setMouseMove: (isMouseMove: boolean) => void;
}

interface AudioUIOwnProps {
    readonly currentPosition: number;
    readonly isPlaying: boolean;
    readonly onDrag: (percent: number) => void;
    readonly onStartDrag: (percent: number) => void;
    readonly pause: () => void;
    readonly play: () => void;
    readonly seekAudio: (percent: number) => void;
    readonly userInput: boolean;
    readonly onFirstUserInput: () => void;
    readonly isMobile: boolean;
    readonly isLoading: boolean;
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

const UIContainer = styled<{ isMobile: boolean; }, 'div'>('div') `
    position: absolute;
    width: ${(props) => props.isMobile ? `100%` : `calc(100% - ${playlistWidth}px)`};
    height: ${(props) => props.isMobile ? '450px' : '100%'};
    left: 0;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledSeekRing = styled('canvas') `
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    -webkit-tap-highlight-color: transparent;
`;

class AudioUI extends React.Component<AudioUIProps, {}> {
    playButton: HTMLDivElement;
    pauseButton: HTMLDivElement;

    height: number;
    width: number;
    centerX: number;
    centerY: number;
    timerId: NodeJS.Timer;

    isDragging: boolean;

    seekRing: HTMLCanvasElement;
    visualizationCtx: CanvasRenderingContext2D;

    setPlayButtonRef = (ref: HTMLDivElement) => {
        this.playButton = ref;
    }

    setPauseButtonRef = (ref: HTMLDivElement) => {
        this.pauseButton = ref;
    }

    togglePlaying = (event: KeyboardEvent | MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.userInput) {
            this.props.onFirstUserInput();
        }
        if ((event as KeyboardEvent).key === ' ' || (event as MouseEvent).button === 0) {
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
        this.seekRing.addEventListener('mousemove', this.handleMousemove);
        this.seekRing.addEventListener('mousedown', this.handleMousedown);
        this.seekRing.addEventListener('mouseup', this.handleMouseup);
        this.onResize();
        this.visualizationCtx = this.seekRing.getContext('2d');
        this.isDragging = false;
        this.props.setMouseMove(false);
        this.props.setHoverPlaypause(false);
    }

    getMousePositionInCanvas = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
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

    isEventInSeekRing = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        const canvasPos = this.getMousePositionInCanvas(event);
        const isInOuter = this.isPointInCircle([canvasPos.x, canvasPos.y], this.props.outerRadius, [this.centerX, this.centerY]);
        const isInInner = this.isPointInCircle([canvasPos.x, canvasPos.y], this.props.innerRadius, [this.centerX, this.centerY]);
        return isInOuter && !isInInner;
    }

    handleMousemove = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        const prevMoving = this.props.isMouseMove;
        if (this.isDragging) {
            this.props.onDrag(this.mousePositionToPercentage(event));
            this.seekRing.style.cursor = 'pointer';
            this.props.setMouseMove(false);
        } else {
            if (this.isEventInSeekRing(event)) {
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

    handleMouseup = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        const prevMoving = this.props.isMouseMove;
        if (this.isDragging) {
            this.props.seekAudio(this.mousePositionToPercentage(event));
            this.isDragging = false;
            if (!prevMoving) {
                this.props.setMouseMove(false);
            } else {
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(() => this.props.setMouseMove(false), 1000);
            }
            if (!this.isEventInSeekRing(event)) {
                this.seekRing.style.cursor = 'default';
            }
        }
    }

    mousePositionToPercentage = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        return this.mousePositionToAngle(event) / (2 * Math.PI);
    }

    mousePositionToAngle = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        const mousePos = this.getMousePositionInCanvas(event);
        const polar = cartesianToPolar(mousePos.x - this.centerX, mousePos.y - this.centerY);
        let angle = polar.angle + Math.PI / 2;
        if (angle < 0) {
            angle += Math.PI * 2;
        }
        return angle;
    }

    handleMousedown = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        if (this.isEventInSeekRing(event)) {
            this.isDragging = true;
            this.props.onStartDrag(this.mousePositionToPercentage(event));
        }
    }

    handleMouseover = () => {
        this.props.setHoverPlaypause(true);
        setTimeout(() => this.props.setHoverPlaypause(false), 1000);
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
        this.seekRing.removeEventListener('mousemove', this.handleMousemove);
        this.seekRing.removeEventListener('mousedown', this.handleMousedown);
        this.seekRing.removeEventListener('mouseup', this.handleMouseup);
    }

    render() {
        const buttonLength = this.props.baseRadius * Math.SQRT1_2;
        return (
            <UIContainer isMobile={this.props.isMobile}>
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
                <StyledSeekRing innerRef={(canvas) => this.seekRing = canvas} />
            </UIContainer>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    innerRadius: state.audio_visualizer.innerRadius,
    isHoverPlaypause: state.audio_ui.isHoverPlaypause,
    isMouseMove: state.audio_ui.isMouseMove,
    outerRadius: state.audio_visualizer.outerRadius,
    baseRadius: state.audio_visualizer.baseRadius,
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
