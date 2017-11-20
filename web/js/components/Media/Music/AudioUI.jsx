import 'less/Media/Music/audio-ui.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TweenLite } from 'gsap';
import { cartesianToPolar, formatTime } from 'js/components/Media/Music/VisualizationUtils.js';
import { setHoverSeekring, setHoverPlaypause, setMouseMove } from 'js/components/Media/Music/actions.js';
import { PlayIcon, PauseIcon, PlayButton, PauseButton } from 'js/components/Media/Music/Buttons.jsx';

class AudioUI extends React.Component {
    setPlayButtonRef = (ref) => {
        this.playButton = ref;
    }

    setPauseButtonRef = (ref) => {
        this.pauseButton = ref;
    }

    togglePlaying = (event) => {
        if (event.keyCode === 32 || event.button === 0) {
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
        this.center_x = this.width / 2;
        this.center_y = this.height / 2 - 100;  // 100 for adjustment - arbitrary
    }

    initializeUI = () => {
        this.seekRing.addEventListener('mousemove', this.handleMousemove);
        this.seekRing.addEventListener('mousedown', this.handleMousedown);
        this.seekRing.addEventListener('mouseup', this.handleMouseup);
        this.height = this.seekRing.offsetHeight;
        this.width = this.seekRing.offsetWidth;
        this.seekRing.height = this.height;
        this.seekRing.width = this.width;
        this.center_x = this.width / 2;
        this.center_y = this.height / 2 - 100;  // 100 for adjustment - arbitrary
        this.visualizationCtx = this.seekRing.getContext('2d');
        this.visualizationCtx.globalCompositionOperation = "lighter";
        this.isDragging = false;
        this.props.setMouseMove(false);
        this.props.setHoverPlaypause(false);
    }

    getMousePositionInCanvas = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const boundingRect = this.seekRing.getBoundingClientRect();
        return {
            x: mouseX - boundingRect.x,
            y: mouseY - boundingRect.y
        };
    }

    isPointInCircle = (point, radius, center) => {
        const context = this.visualizationCtx;
        context.beginPath();
        context.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        context.closePath();
        return context.isPointInPath(point[0], point[1]);
    }

    isEventInSeekRing = (event) => {
        const canvasPos = this.getMousePositionInCanvas(event);
        const isInOuter = this.isPointInCircle([canvasPos.x, canvasPos.y], this.props.outerRadius, [this.center_x, this.center_y]);
        const isInInner = this.isPointInCircle([canvasPos.x, canvasPos.y], this.props.innerRadius, [this.center_x, this.center_y]);
        return isInOuter && !isInInner;
    }

    handleMousemove = (event) => {
        const prevMoving = this.props.isMouseMove;
        if (this.isDragging) {
            this.props.onDrag(this.mousePositionToPercentage(event));
            this.seekRing.style.cursor = "pointer";
            this.props.setMouseMove(false);
        } else {
            if (this.isEventInSeekRing(event)) {
                this.seekRing.style.cursor = "pointer";
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
                this.seekRing.style.cursor = "default";
                this.props.setHoverSeekring(false, null);
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.props.setMouseMove(true);
                this.timerId = setTimeout(() => this.props.setMouseMove(false), 1000);
            }
        }
    }

    handleMouseup = (event) => {
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
                this.seekRing.style.cursor = "default";
            }
        }
    }

    mousePositionToPercentage = (event) => {
        return this.mousePositionToAngle(event) / (2 * Math.PI);
    }

    mousePositionToAngle = (event) => {
        const mousePos = this.getMousePositionInCanvas(event);
        const polar = cartesianToPolar(mousePos.x - this.center_x, mousePos.y - this.center_y);
        let angle = polar.angle + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        return angle;
    }

    handleMousedown = (event) => {
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
            <div className="uiContainer">
                <div className="currentTime no-highlight">
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
                <canvas className="seekRing" ref={(canvas) => this.seekRing = canvas} />
            </div>
        )
    }
}

AudioUI.propTypes = {
    currentPosition: PropTypes.number.isRequired,
    innerRadius: PropTypes.number.isRequired,
    isHoverPlaypause: PropTypes.bool.isRequired,
    isMouseMove: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    onDrag: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func.isRequired,
    outerRadius: PropTypes.number.isRequired,
    pause: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    seekAudio: PropTypes.func.isRequired,
    setHoverPlaypause: PropTypes.func.isRequired,
    setHoverSeekring: PropTypes.func.isRequired,
    setMouseMove: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    innerRadius: state.audio_visualizer.innerRadius,
    isHoverPlaypause: state.audio_ui.isHoverPlaypause,
    isMouseMove: state.audio_ui.isMouseMove,
    outerRadius: state.audio_visualizer.outerRadius,
})

export default connect(
    mapStateToProps,
    {
        setHoverSeekring,
        setHoverPlaypause,
        setMouseMove
    }
)(AudioUI);
