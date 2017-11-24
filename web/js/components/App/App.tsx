import 'less/App/app.less';

import * as React from 'react';

import { Route, Switch } from 'react-router-dom';
import { TransitionGroup, Transition } from 'react-transition-group';
import { TweenLite } from 'gsap';

import { LogoSVG } from 'js/components/LogoSVG';
import Front from 'js/components/App/Front/Front';
import NavBar from 'js/components/App/NavBar/NavBar';

import About from 'js/components/About/About';
import Contact from 'js/components/Contact/Contact';
import Home from 'js/components/Home/Home';
import Media from 'js/components/Media/Media';
import Press from 'js/components/Press/Press';
import Schedule from 'js/components/Schedule/Schedule';
import { RouteComponentProps } from 'react-router';

const fadeOnEnter = (element: HTMLElement, isAppearing: boolean) => {
    const delay = (isAppearing) ? 0.3 : 0;
    TweenLite.fromTo(element, 0.25, { opacity: 0 }, { opacity: 1, delay: delay });
}

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 1 }, { opacity: 0, });
}

const slideDownOnEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.5, { y: -90 }, { y: 0, delay: 0.55, ease: "Power3.easeOut" });
}

const slideUpOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.5, { y: 0 }, { y: -90, delay: 0.55, ease: "Power3.easeOut" });
}

interface AppState {
    isFront: boolean;
}

export default class App extends React.Component<RouteComponentProps<void>, AppState> {
    constructor(props: any) {
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
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront, true));
        window.addEventListener('keydown', this.checkDownArrow);
    }

    hideFront = () => {
        this.setState({ isFront: false });
        ['wheel', 'touchmove'].forEach((event) => window.removeEventListener(event, this.hideFront, true));
        window.removeEventListener('keydown', this.checkDownArrow);
    }

    checkDownArrow = (event: KeyboardEvent) => {
        if (event.keyCode == 40) {
            this.hideFront();
        }
    }

    componentDidMount() {
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront, true));
        window.addEventListener('keydown', this.checkDownArrow);
    }

    render() {
        return (
            <div className='appContainer'>
                <LogoSVG />
                <Front show={this.state.isFront} onClick={this.hideFront} />
                <Transition in={!this.state.isFront}
                    onEnter={slideDownOnEnter}
                    onExit={slideUpOnExit}
                    timeout={250}
                >
                    <NavBar
                        onClick={this.showFront}
                        currentBasePath={this.getRouteBase()}
                    />
                </Transition>
                <TransitionGroup>
                    <Transition
                        key={this.getRouteBase()}
                        onEntering={fadeOnEnter}
                        onExiting={fadeOnExit}
                        timeout={550}
                        appear={true}
                    >
                        <Switch location={this.props.location}>
                            <Route path='/about' exact component={About} />
                            <Route path='/contact' exact component={Contact} />
                            <Route path='/media' component={Media} />
                            <Route path='/press' exact component={Press} />
                            <Route path='/schedule' component={Schedule} />
                            <Route path='/' exact component={Home} />
                        </Switch>
                    </Transition>
                </TransitionGroup>
            </div>
        )
    }
}
