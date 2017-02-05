import '@/less/app.less';

import React from 'react';
import {VelocityComponent, VelocityTransitionGroup} from 'velocity-react';

import {LogoSVG} from '@/js/components/LogoSVG.jsx';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';
import Front from '@/js/components/App/Front/Front.jsx';

export default class App extends React.Component {
    state = {
        isFront: false // for peaceful dev until we figure out how to show only on home
    };

    showFront = () => {
        this.setState({isFront: true});
    }

    hideFront = () => {
        this.setState({isFront: false});
    }

    componentDidMount() {
        window.addEventListener('wheel', this.hideFront);
        window.addEventListener('keydown', (e)=>(e.keyCode == 40 && this.hideFront()))
    }

    render() {
        return (
            <div className='appContainer'>
                <LogoSVG/>
                <Front show={this.state.isFront} onClick={this.hideFront} />
                <VelocityComponent
                    animation={{translateY: !this.state.isFront ? 0 : -90, translateZ: 0}}
                    delay={500}
                    duration={500}
                    easing={[170, 26]}
                >
                    <NavBar onClick={this.showFront} />
                </VelocityComponent>
                <VelocityTransitionGroup
                    enter={{duration: 500, animation: {opacity: 1, translateZ: 0}}}
                    leave={{duration: 500, animation: {opacity: 0, translateZ: 0}}}
                    runOnMount={true}
                >
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                    })}
                </VelocityTransitionGroup>
            </div>
        )
    }
};