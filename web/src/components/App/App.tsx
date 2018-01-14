import 'less/App/app.less';

import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import 'gsap/CSSPlugin';
import TweenLite from 'gsap/TweenLite';

import Front from 'src/components/App/Front/Front';
import NavBar from 'src/components/App/NavBar/NavBar';
import { LogoSVG } from 'src/components/LogoSVG';

import About from 'src/components/About/About';
import Contact from 'src/components/Contact/Contact';
import Home from 'src/components/Home/Home';
import Media from 'src/components/Media/Media';
import Press from 'src/components/Press/Press';
import Schedule from 'src/components/Schedule/Schedule';

const fadeOnEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 0 }, { opacity: 1, delay: 0.25 });
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

    isSubPath = (path: string) => {
        return path === '/photos' || path === '/videos' || path === '/music';
    }

    getRouteBase = () => {
        const matches: string[] = this.props.location.pathname.match(/^(\/[^\/]+)?(\/[^\/]+)?/);
        // if (matches[2] && this.isSubPath(matches[2])) {
        //     return `${matches[1]}${matches[2]}`;
        // } else {
        return matches[1] || '/';
        // }
    }

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

    checkDownArrow = (event: KeyboardEvent) => {
        if (event.keyCode === 40) {
            this.hideFront();
        }
    }

    componentDidMount() {
        ['wheel', 'touchmove'].forEach((event) => window.addEventListener(event, this.hideFront));
        window.addEventListener('keydown', this.checkDownArrow);
    }

    render() {
        return (
            <div className="appContainer">
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
                        timeout={500}
                        appear={true}
                    >
                        <Switch location={this.props.location}>
                            <Route path="/about" exact={true} component={About} />
                            <Route path="/contact" exact={true} component={Contact} />
                            <Route path="/media" component={Media} />
                            <Route path="/press" exact={true} component={Press} />
                            <Route path="/schedule" component={Schedule} />
                            <Route path="/" exact={true} component={Home} />
                        </Switch>
                    </Transition>
                </TransitionGroup>
            </div>
        );
    }
}
