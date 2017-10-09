import '@/less/App/app.less';

import React from 'react';

import { VelocityComponent } from 'velocity-react';
import { Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { LogoSVG } from '@/js/components/LogoSVG.jsx';
import Front from '@/js/components/App/Front/Front.jsx';
import NavBar from '@/js/components/App/NavBar/NavBar.jsx';

import About from '@/js/components/About/About.jsx';
import Contact from '@/js/components/Contact/Contact.jsx';
import Home from '@/js/components/Home/Home.jsx';
import Media from '@/js/components/Media/Media.jsx';
import Press from '@/js/components/Press/Press.jsx';
import Schedule from '@/js/components/Schedule/Schedule.jsx';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        // uncomment the following comments to allow showing video on Home
        // const initialFront = this.props.location.pathname === '/';
        this.state = {
            //isFront: initialFront
            isFront: false
        }
    }

    getRouteBase = () => this.props.location.pathname.match(/^(\/\w*)(\/.*)*$/)[1];

    showFront = () => {
        this.setState({ isFront: true });
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront));
        window.addEventListener('keydown', this.checkDownArrow);
    }

    hideFront = () => {
        this.setState({ isFront: false });
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
                <TransitionGroup>
                    <CSSTransition key={this.getRouteBase()} timeout={160} classNames="fade" mountOnEnter={true} unmountOnExit={true}>
                        <main>
                            <Switch location={this.props.location}>
                                <Route path='/about' exact component={About} />
                                <Route path='/contact' exact component={Contact} />
                                <Route path='/media' component={Media} />
                                <Route path='/press' exact component={Press} />
                                <Route path='/schedule' component={Schedule} />
                                <Route path='/' exact component={Home} />
                            </Switch>
                        </main>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        )
    }
};
