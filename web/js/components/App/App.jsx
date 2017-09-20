import '@/less/App/app.less';

import React from 'react';
import {VelocityComponent, VelocityTransitionGroup} from 'velocity-react';

import {LogoSVG} from '@/js/components/LogoSVG.jsx';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';
import Front from '@/js/components/App/Front/Front.jsx';

export default class App extends React.Component {
    state = {
        isFront: false // for peaceful dev until we figure out how to show only on home
    };

    getRouteBase = () => this.props.location.pathname.match(/^(\/\w*)(\/.*)*$/)[1];

    showFront = () => {
        this.setState({isFront: true});
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront));
        window.addEventListener('keydown', this.checkDownArrow);
    }

    hideFront = () => {
        this.setState({isFront: false});
        ['wheel', 'touchmove'].forEach((event) => window.removeEventListener(event, this.hideFront));
        window.removeEventListener('keydown', this.checkDownArrow);
    }

    checkDownArrow = event => {
        if (event.keyCode == 40)
            this.hideFront();
    }

    componentDidMount() {
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront));
        window.addEventListener('keydown', this.checkDownArrow);
    }

    render() {
        return (
            <div className='appContainer'>
                <LogoSVG />
                <Front show={this.state.isFront} onClick={this.hideFront} />
                <VelocityComponent
                    animation={{ translateY: !this.state.isFront ? 0 : -90, translateZ: 0 }}
                    delay={500}
                    duration={500}
                    easing={[170, 26]}
                >
                    <NavBar
                        onClick={this.showFront}
                        currentBasePath={this.getRouteBase()}
                    />
                </VelocityComponent>
                <VelocityTransitionGroup
                    enter={{ duration: 500, animation: { opacity: 1, translateZ: 0 } }}
                    leave={{ duration: 500, animation: { opacity: 0, translateZ: 0 } }}
                    runOnMount
                >
                    {React.cloneElement(this.props.children, {
                        // we don't want animation here to trigger when going from /schedule to /schedule/[date]
                        key: this.getRouteBase()
                    })}
                </VelocityTransitionGroup>
            </div>
        )
    }
};
