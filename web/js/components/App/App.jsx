import '@/less/app.less';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';
import {LogoSVG} from '@/js/components/LogoSVG.jsx';
import Front from '@/js/components/App/Front/Front.jsx';
import '@/less/animations/route-animation.less';
import '@/less/animations/nav-bar-animation.less';
import '@/less/animations/front-video-animation.less';


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {isFront: true};
        this.showFront = this.showFront.bind(this);
        this.hideFront = this.hideFront.bind(this);
    }
    showFront() {
        this.setState({isFront: true});
    }
    hideFront() {
        this.setState({isFront: false});
    }
    componentDidMount() {
        window.addEventListener('wheel', this.hideFront);
    }
    render() {
        return (
            <div className='appContainer'>
                <LogoSVG/>
                <ReactCSSTransitionGroup
                    transitionName='frontVideo'
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1000}
                >
                    {this.state.isFront ? <Front/> : null}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName='navBar'
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1000}
                >
                    {this.state.isFront ? null : <NavBar onClick={this.showFront} />}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName='route'
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                    })}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
};
