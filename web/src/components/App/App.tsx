import toUpper from 'lodash-es/toUpper';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import ReactMedia from 'react-media';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import 'picturefill';
import 'picturefill/dist/plugins/mutation/pf.mutation.min';

import 'gsap/CSSPlugin';
import TweenLite from 'gsap/TweenLite';

import NavBar from 'src/components/App/NavBar/NavBar';
import { LogoSVG } from 'src/components/LogoSVG';

import AsyncComponent from 'src/components/AsyncComponent';
import extractModule from 'src/module';
import store from 'src/store';
import { reactMediaMobileQuery } from 'src/styles/screens';
import { GlobalStateShape } from 'src/types';

const register = extractModule(store);
const About = () => register('about', import(/* webpackChunkName: 'about' */ 'src/components/About'));
const Contact = () => register('contact', import(/* webpackChunkName: 'contact' */ 'src/components/Contact'));
const Home = () => register('home', import(/* webpackChunkName: 'home' */ 'src/components/Home'));
const Media = () => register('media', import(/* webpackChunkName: 'media' */ 'src/components/Media'));
const Press = () => register('press', import(/* webpackChunkName: 'press' */ 'src/components/Press'));
const Schedule = () => register('schedule', import(/* webpackChunkName: 'schedule' */ 'src/components/Schedule'));

const fadeOnEnter = (delay: number) => (element: HTMLElement) => {
    if (element) {
        TweenLite.to(element, 0.25, { autoAlpha: 1, delay });
    }
};

const slideOnEnter = (delay: number) => (element: HTMLElement) => {
    TweenLite.set(element, { autoAlpha: 1 });
    if (element) {
        TweenLite.to(element, 0.25, { y: '0%', delay, clearProps: 'transform', force3D: true });
    }
};

const fadeOnExit = (delay: number) => (element: HTMLElement) => {
    if (element) {
        TweenLite.to(element, 0.25, { autoAlpha: 0, delay });
    }
};

const slideOnExit = (delay: number) => (element: HTMLElement) => {
    if (element) {
        TweenLite.to(element, 0.25, { y: '-100%', delay, force3D: true });
    }
};

const RootContainer = styled<{ isHome: boolean }, 'div'>('div') `
    height: 100%;
    width: 100%;
    background-color: ${props => props.isHome ? 'black' : 'white'};
`;

const FadingContainer = styled('div') `
    height: 100%;
    width: 100%;
    visibility: hidden;
`;

interface AppStateToProps {
    navbarVisible: boolean;
}

type AppProps = RouteComponentProps<{}> & AppStateToProps;

class App extends React.Component<AppProps, { homeBgLoaded: boolean; }> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            homeBgLoaded: this.getRouteBase() !== '/',
        };
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
                        <Transition
                            in={this.state.homeBgLoaded && this.props.navbarVisible}
                            onEntering={this.getRouteBase() === '/' ? fadeOnEnter(0) : slideOnEnter(0)}
                            onExiting={slideOnExit(0)}
                            timeout={250}
                            appear={true}
                        >
                            <NavBar
                                className={css` visibility: hidden; `}
                                currentBasePath={this.getRouteBase()}
                                specificRouteName={this.getMostSpecificRouteName()}
                                isMobile={matches}
                            />
                        </Transition>
                        <TransitionGroup>
                            <Transition
                                key={this.getRouteBase()}
                                onEntering={fadeOnEnter(0.25)}
                                onExiting={fadeOnExit(0)}
                                timeout={750}
                                appear={true}
                            >
                                <FadingContainer>
                                    <Switch location={this.props.location}>
                                        <Route
                                            path="/about"
                                            exact={true}
                                            render={(childProps) => <AsyncComponent moduleProvider={About} {...childProps} isMobile={matches} />}
                                        />
                                        <Route
                                            path="/contact"
                                            exact={true}
                                            render={(childProps) => <AsyncComponent moduleProvider={Contact} {...childProps} isMobile={matches} />}
                                        />
                                        <Route
                                            path="/media/:media/:other*"
                                            exact={true}
                                            render={(childProps) => <AsyncComponent moduleProvider={Media} {...childProps} isMobile={matches} />}
                                        />
                                        <Route
                                            path="/press"
                                            exact={true}
                                            render={(childProps) => <AsyncComponent moduleProvider={Press} {...childProps} isMobile={matches} />}
                                        />
                                        <Route
                                            path="/schedule/:type?/:date?"
                                            render={(childProps) => <AsyncComponent moduleProvider={Schedule} {...childProps} isMobile={matches} />}
                                        />
                                        <Route
                                            path="/"
                                            exact={true}
                                            render={(childProps) => <AsyncComponent moduleProvider={Home} {...childProps} bgLoaded={this.bgLoaded} isMobile={matches} />}
                                        />
                                    </Switch>
                                </FadingContainer>
                            </Transition>
                        </TransitionGroup>
                    </RootContainer>
                )}
            </ReactMedia>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    navbarVisible: navbar.isVisible,
});

export default connect<AppStateToProps>(
    mapStateToProps,
)(App);
