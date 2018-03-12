import toUpper from 'lodash-es/toUpper';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import ReactMedia from 'react-media';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import 'picturefill';
import 'picturefill/dist/plugins/mutation/pf.mutation.min';

import 'gsap/CSSPlugin';
import TweenLite from 'gsap/TweenLite';

import NavBar from 'src/components/App/NavBar/NavBar';
import { LoadingSVG } from 'src/components/LoadingSVG';
import { LogoSVG } from 'src/components/LogoSVG';

import About from 'src/components/About/About';
import Contact from 'src/components/Contact/Contact';
import Home from 'src/components/Home/Home';
import Media from 'src/components/Media/Media';
import Press from 'src/components/Press/Press';
import Schedule from 'src/components/Schedule/Schedule';
import { reactMediaMobileQuery } from 'src/styles/screens';

const fadeOnEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 0 }, { opacity: 1, delay: 0.25 });
};

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 1 }, { opacity: 0 });
};

const RootContainer = styled<{ isHome: boolean; }, 'div'>('div') `
    height: 100%;
    width: 100%;
    background-color: ${props => props.isHome ? 'black' : 'white'};
`;

export default class App extends React.Component<RouteComponentProps<void>, { homeBgLoaded: boolean; }> {
    constructor(props: RouteComponentProps<void>) {
        super(props);
        if (this.getRouteBase() === '/') {
            this.state = {
                homeBgLoaded: false,
            };
        } else {
            this.state = {
                homeBgLoaded: true,
            };
        }
    }

    isSubPath = (testPath: string) => {
        return testPath === '/photos' || testPath === '/videos' || testPath === '/music';
    }

    getRouteBase = () => {
        const matches: string[] = this.props.location.pathname.match(/^(\/[^\/]+)?(\/[^\/]+)?/);
        return matches[1] || '/';
    }

    getMostSpecificRouteName = () => {
        const matches: string[] = this.props.location.pathname.match(/^(\/[^\/]+)?(\/[^\/]+)?/);
        const match = matches[2] || matches[1];
        return (match ? toUpper(match.slice(1)) : '') || null;
    }

    bgLoaded = () => {
        this.setState({ homeBgLoaded: true });
    }

    render() {
        return (
            <ReactMedia query={reactMediaMobileQuery}>
                {(matches: boolean) => (
                    <RootContainer isHome={this.getRouteBase() === '/'}>
                        <LogoSVG />
                        <LoadingSVG />
                        <Transition
                            in={this.state.homeBgLoaded}
                            onEntering={fadeOnEnter}
                            timeout={250}
                            appear={true}
                        >
                            <NavBar
                                className={css` opacity: 0; `}
                                currentBasePath={this.getRouteBase()}
                                specificRouteName={this.getMostSpecificRouteName()}
                                isMobile={matches}
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
                                    <Route path="/about" exact={true} render={(childProps) => <About {...childProps} isMobile={matches} />} />
                                    <Route path="/contact" exact={true} render={(childProps) => <Contact {...childProps} isMobile={matches} />} />
                                    <Route path="/media" render={(childProps) => <Media {...childProps} isMobile={matches} />} />
                                    <Route path="/press" exact={true} render={(childProps) => <Press {...childProps} isMobile={matches} />} />
                                    <Route path="/schedule" render={(childProps) => <Schedule {...childProps} isMobile={matches} />} />
                                    <Route
                                        path="/"
                                        exact={true}
                                        render={(childProps) => (
                                            <Home {...childProps} bgLoaded={this.bgLoaded} isMobile={matches} />
                                        )}
                                    />
                                </Switch>
                            </Transition>
                        </TransitionGroup>
                    </RootContainer>
                )}
            </ReactMedia>
        );
    }
}
