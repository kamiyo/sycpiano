import 'less/Media/Music/audio-ui.less';

import * as React from 'react';
import { connect } from 'react-redux';

import TweenLite from 'gsap/TweenLite';
import { setHoverPlaypause, setHoverSeekring, setMouseMove } from 'src/components/Media/Music/actions';
import { PauseButton, PauseIcon, PlayButton, PlayIcon } from 'src/components/Media/Music/Buttons';
import { GlobalStateShape } from 'src/types';
import { cartesianToPolar, formatTime } from 'src/utils';

interface AudioUIStateToProps {
    readonly innerRadius: number;
    readonly isHoverPlaypause: boolean;
    readonly isMouseMove: boolean;
    readonly outerRadius: number;
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
}

type AudioUIProps = AudioUIOwnProps & AudioUIStateToProps & AudioUIDispatchToProps;

interface ClientRectExtended extends ClientRect {
    readonly x: number;
    readonly y: number;
}

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
        if ((event as KeyboardEvent).key === ' ' || (event as MouseEvent).button === 0) {
            if (this.props.isPlaying) {
                this.props.pause();
                TweenLite.fromTo(this.pauseButton, 0.25, { opacity: 1, scale: 1 }, { opacity: 0, scale: 5, delay: 0.1 });
            } else {
                this.props.play();
                TweenLite.fromTo(this.playButton, 0.25, { opacity: 1, scale: 1 }, { opacity: 0, scale: 5, delay: 0.1 });
            }
        }
    }

    onResize = () => {
        this.height = this.seekRing.offsetHeight;
        this.width = this.seekRing.offsetWidth;
        this.seekRing.height = this.height;
        this.seekRing.width = this.width;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2 - 100;  // 100 for adjustment - arbitrary
    }

    initializeUI = () => {
        this.seekRing.addEventListener('mousemove', this.handleMousemove);
        this.seekRing.addEventListener('mousedown', this.handleMousedown);
        this.seekRing.addEventListener('mouseup', this.handleMouseup);
        this.height = this.seekRing.offsetHeight;
        this.width = this.seekRing.offsetWidth;
        this.seekRing.height = this.height;
        this.seekRing.width = this.width;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2 - 100;  // 100 for adjustment - arbitrary
        this.visualizationCtx = this.seekRing.getContext('2d');
        this.isDragging = false;
        this.props.setMouseMove(false);
        this.props.setHoverPlaypause(false);
    }

    getMousePositionInCanvas = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const boundingRect = this.seekRing.getBoundingClientRect() as ClientRectExtended;
        return {
            x: mouseX - boundingRect.x,
            y: mouseY - boundingRect.y,
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
    }

    handleMouseout = () => {
        this.props.setHoverPlaypause(false);
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
        return (
            <div className='uiContainer'>
                <div className='currentTime no-highlight'>
                    {formatTime(this.props.currentPosition)}
                </div>
                <PauseIcon setRef={this.setPauseButtonRef} />
                <PlayIcon setRef={this.setPlayButtonRef} />
                {(this.props.isPlaying) ?
                    <PauseButton
                        onClick={this.togglePlaying}
                        isVisible={this.props.isMouseMove || this.props.isHoverPlaypause}
                        isHovering={this.props.isHoverPlaypause}
                        onMouseMove={this.handleMousemove}
                        onMouseOver={this.handleMouseover}
                        onMouseOut={this.handleMouseout}
                        onMouseUp={this.handleMouseup}
                    /> : <PlayButton
                        onClick={this.togglePlaying}
                        isVisible={this.props.isMouseMove || this.props.isHoverPlaypause}
                        isHovering={this.props.isHoverPlaypause}
                        onMouseMove={this.handleMousemove}
                        onMouseOver={this.handleMouseover}
                        onMouseOut={this.handleMouseout}
                        onMouseUp={this.handleMouseup}
                    />
                }
                <canvas className='seekRing' ref={(canvas) => this.seekRing = canvas} />
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    innerRadius: state.audio_visualizer.innerRadius,
    isHoverPlaypause: state.audio_ui.isHoverPlaypause,
    isMouseMove: state.audio_ui.isMouseMove,
    outerRadius: state.audio_visualizer.outerRadius,
});

export default connect<AudioUIStateToProps, AudioUIDispatchToProps>(
    mapStateToProps,
    {
        setHoverSeekring,
        setHoverPlaypause,
        setMouseMove,
    },
)(AudioUI);
