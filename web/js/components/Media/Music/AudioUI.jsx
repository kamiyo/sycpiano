import '@/less/Media/Music/audio-ui.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { cartesianToPolar, formatTime } from '@/js/components/Media/Music/VisualizationUtils.js';
import { isHover } from '@/js/components/Media/Music/actions.js';
import { PlayButton, PauseButton } from '@/js/components/Media/Music/Buttons.jsx';

class AudioUI extends React.Component {

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this);
        this.visualization = this.el.getElementsByClassName('seekRing')[0];
        this.visualization.addEventListener('mousemove', this.handleMousemove);
        this.visualization.addEventListener('mousedown', this.handleMousedown);
        this.visualization.addEventListener('mouseup', this.handleMouseup);
        this.height = this.visualization.offsetHeight;
        this.width = this.visualization.offsetWidth;
        this.visualization.height = this.height;
        this.visualization.width = this.width;
        this.center_x = this.width / 2;
        this.center_y = this.height / 2 - 100;  // 100 for adjustment - arbitrary
        this.visualizationCtx = this.visualization.getContext('2d');
        this.visualizationCtx.globalCompositionOperation = "lighter";
        this.isDragging = false;
        this.isMoving = true;
        this.isHovering = false;
        this.timerId = setTimeout(() => this.isMoving = false, 1000);
    }

    getMousePositionInCanvas = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const boundingRect = this.visualization.getBoundingClientRect();
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
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const boundingRect = this.visualization.getBoundingClientRect();
        const canvasPos = this.getMousePositionInCanvas(event);
        const isInOuter = this.isPointInCircle([canvasPos.x, canvasPos.y], this.props.outerRadius, [this.center_x, this.center_y]);
        const isInInner = this.isPointInCircle([canvasPos.x, canvasPos.y], this.props.innerRadius, [this.center_x, this.center_y]);
        return isInOuter && !isInInner;
    }

    handleMousemove = (event) => {
        const prevMoving = this.isMoving;
        if (this.isDragging) {
            this.props.onDrag(this.mousePositionToPercentage(event));
            this.visualization.style.cursor = "pointer"
        } else {
            if (this.timerId) {
                clearTimeout(this.timerId);
            }
            this.isMoving = true;
            this.timerId = setTimeout(() => this.isMoving = false, 1000);
        }
        if (this.isEventInSeekRing(event)) {
            this.visualization.style.cursor = "pointer";
            this.props.isHover(true, this.mousePositionToAngle(event));
            if (!prevMoving) {
                this.isMoving = false;
            } else {
                this.timerId = setTimeout(() => this.isMoving = false, 1000);
            }
        } else {
            this.visualization.style.cursor = "default";
            this.props.isHover(false, null);
        }
    }

    handleMouseup = (event) => {
        if (this.isDragging) {
            this.props.seekAudio(this.mousePositionToPercentage(event));
            this.isDragging = false;
            if (!this.isEventInSeekRing(event)) {
                this.visualization.style.cursor = "default";
            }
        }
    }

    mousePositionToPercentage = (event) => {
        const angle = this.mousePositionToAngle(event);
        return angle / (2 * Math.PI);
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

    handleMouseover = (event) => {
        this.isHovering = true;
    }

    handleMouseout = (event) => {
        this.isHovering = false;
    }

    componentWillUpdate(nextProps) {
        if (this.props.isPlaying !== nextProps.isPlaying) {
            this.isMoving = true;
            this.timerId = setTimeout(() => this.isMoving = false, 1000);
        }
    }

    render() {
        return (
            <div className="uiContainer">
                <div className="currentTime">
                    {formatTime(this.props.currentPosition)}
                </div>
                {(this.props.isPlaying) ?

                    <PauseButton
                        onClick={this.props.pause}
                        isMoving={this.isMoving}
                        isHovering={this.isHovering}
                        onMouseMove={this.handleMousemove}
                        onMouseOver={this.handleMouseover}
                        onMouseOut={this.handleMouseout}
                    />
                    : <PlayButton
                        onClick={this.props.play}
                        isMoving={this.isMoving}
                        isHovering={this.isHovering}
                        onMouseMove={this.handleMousemove}
                        onMouseOver={this.handleMouseover}
                        onMouseOut={this.handleMouseout}
                    />
                }
                <canvas className="seekRing" />
            </div>
        )
    }

}

const mapStateToProps = state => ({
    innerRadius: state.audio_visualizer.innerRadius,
    outerRadius: state.audio_visualizer.outerRadius,
    isPlaying: state.audio_player.isPlaying,
    currentPosition: state.audio_player.currentPosition
})

export default connect(
    mapStateToProps,
    {
        isHover
    }
)(AudioUI);
