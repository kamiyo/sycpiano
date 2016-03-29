import React from 'react';
import '@/less/front.less';
import '@/less/animations/front-logo-animation.less';
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
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    <LogoGroup/>
                </ReactCSSTransitionGroup>
                <FrontVideo/>
            </div>
        )
    }
}