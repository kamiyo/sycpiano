import 'less/App/app.less';

import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import { TweenLite } from 'gsap';

import Front from 'src/components/App/Front/Front';
import NavBar from 'src/components/App/NavBar/NavBar';
import { LogoSVG } from 'src/components/LogoSVG';

import About from 'src/components/About/About';
import Contact from 'src/components/Contact/Contact';
import Home from 'src/components/Home/Home';
import Media from 'src/components/Media/Media';
import Press from 'src/components/Press/Press';
import Schedule from 'src/components/Schedule/Schedule';

const fadeOnEnter = (element: HTMLElement, isAppearing: boolean) => {
    const delay = (isAppearing) ? 0.3 : 0;
    TweenLite.fromTo(element, 0.25, { opacity: 0 }, { opacity: 1, delay });
};

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 1 }, { opacity: 0 });
};

const slideDownOnEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.5, { y: -90 }, { y: 0, delay: 0.55, ease: 'Power3.easeOut' });
};

const slideUpOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.5, { y: 0 }, { y: -90, delay: 0.55, ease: 'Power3.easeOut' });
};

interface AppState {
    readonly isFront: boolean;
}

export default class App extends React.Component<RouteComponentProps<void>, AppState> {
    state = {
        isFront: false,
    };

    getRouteBase = () => this.props.location.pathname.match(/^(\/\w*)(\/.*)*$/)[1];

    showFront = () => {
        this.setState({ isFront: true });
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront, { passive: true } as any));
        window.addEventListener('keydown', this.checkDownArrow, { passive: true });
    }

    hideFront = () => {
        this.setState({ isFront: false });
        ['wheel', 'touchmove'].forEach((event) => window.removeEventListener(event, this.hideFront, true));
        window.removeEventListener('keydown', this.checkDownArrow);
    }

    checkDownArrow = (event: KeyboardEvent) => {
        if (event.keyCode === 40) {
            this.hideFront();
        }
    }

    componentDidMount() {
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront, { passive: true } as any));
        window.addEventListener('keydown', this.checkDownArrow, { passive: true });
    }

    render() {
        return (
            <div className='appContainer'>
                <LogoSVG />
                <Front show={this.state.isFront} onClick={this.hideFront} />
                <Transition
                    in={!this.state.isFront}
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
                            <Route path='/about' exact={true} component={About} />
                            <Route path='/contact' exact={true} component={Contact} />
                            <Route path='/media' component={Media} />
                            <Route path='/press' exact={true} component={Press} />
                            <Route path='/schedule' component={Schedule} />
                            <Route path='/' exact={true} component={Home} />
                        </Switch>
                    </Transition>
                </TransitionGroup>
            </div>
        );
    }
}
