import React from 'react';
import '@/less/animations/front-logo-animation.less';
import '@/less/animations/front-video-animation.less';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FrontVideo from '@/js/components/App/Front/FrontVideo.jsx';
import {LogoInstance} from '@/js/components/LogoSVG.jsx';
import LogoGroup from '@/js/components/App/Front/LogoGroup.jsx';

export default class Front extends React.Component {
    render() {
        return (
            <div className='frontContainer'>
                <ReactCSSTransitionGroup
                    transitionName='frontLogo'
                    transitionAppear={true}
                    transitionAppearTimeout={1000}
                    transitionEnterTimeout={700}
                    transitionLeaveTimeout={700}
                >
                    {this.props.show ? <LogoGroup/> : null}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName='frontVideo'
                    transitionEnterTimeout={700}
                    transitionLeaveTimeout={700}
                >
                    {this.props.show ? <FrontVideo/> : null}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}