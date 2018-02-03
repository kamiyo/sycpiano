import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import 'gsap/CSSPlugin';
import TweenLite from 'gsap/TweenLite';

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

const RootContainer = styled('div') `
    height: 100%;
    width: 100%;
`;

export default class App extends React.Component<RouteComponentProps<void>, {}> {

    isSubPath = (testPath: string) => {
        return testPath === '/photos' || testPath === '/videos' || testPath === '/music';
    }

    getRouteBase = () => {
        const matches: string[] = this.props.location.pathname.match(/^(\/[^\/]+)?(\/[^\/]+)?/);
        // if (matches[2] && this.isSubPath(matches[2])) {
        //     return `${matches[1]}${matches[2]}`;
        // } else {
        return matches[1] || '/';
        // }
    }

    render() {
        return (
            <RootContainer>
                <LogoSVG />
                <NavBar
                    currentBasePath={this.getRouteBase()}
                />
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
            </RootContainer>
        );
    }
}
