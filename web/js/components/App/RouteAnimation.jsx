import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '@/less/animations/route-animation.less';

export default class RouteAnimation extends React.Component {
    render() {
        return (
            <ReactCSSTransitionGroup transitionName='route' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                {this.props.children}
            </ReactCSSTransitionGroup>
        )
    }
};
