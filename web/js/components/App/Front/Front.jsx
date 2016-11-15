import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import FrontVideo from '@/js/components/App/Front/FrontVideo.jsx';
import FrontLogo from '@/js/components/App/Front/FrontLogo.jsx';
import FrontName from '@/js/components/App/Front/FrontName.jsx';

let logoEnter = {
    duration: 800,
    animation: {
        translateY: 0,
        opacity: 1,
    },
    easing: [170, 26],
    delay: 500,
};
let logoLeave = {
    duration: 800,
    animation: {
        translateY: -50,
        opacity: 0,
    },
    easing: [170, 26]
};
let videoEnter = {
    duration: 500,
    animation: {
        height: `100%`
    },
};
let videoLeave = {
    duration: 500,
    animation: {
        height: 0
    }
};
let nameEnter = {
    duration: 800,
    animation: 'fadeIn',
    delay: 500,
};
let nameLeave = {
    duration: 500,
    animation: 'fadeOut'
}

export default class Front extends React.Component {
    state = {
        isHover: false
    };
    doMouseOver = () => {
        this.setState({isHover: true});
    }
    doMouseOut = () => {
        this.setState({isHover: false});
    }
    render() {
        return (
            <div className='frontContainer'>
                <VelocityTransitionGroup
                    runOnMount={true}
                    enter={nameEnter}
                    leave={nameLeave}
                    >
                    {this.props.show &&
                        <FrontName
                            onClick={this.props.onClick}
                            onMouseOver={this.doMouseOver}
                            onMouseOut={this.doMouseOut}
                            hover={this.state.isHover} />
                    }
                </VelocityTransitionGroup>
                <VelocityTransitionGroup
                    runOnMount={true}
                    enter={logoEnter}
                    leave={logoLeave}
                    >
                    {this.props.show &&
                        <FrontLogo
                            onClick={this.props.onClick}
                            onMouseOver={this.doMouseOver}
                            onMouseOut={this.doMouseOut}
                            hover={this.state.isHover} />
                    }
                </VelocityTransitionGroup>
                <VelocityTransitionGroup
                    enter={videoEnter}
                    leave={videoLeave}
                    >
                    {this.props.show && <FrontVideo/>}
                </VelocityTransitionGroup>
            </div>
        )
    }
}