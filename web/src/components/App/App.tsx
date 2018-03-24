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
import { LogoSVG } from 'src/components/LogoSVG';

import AsyncComponent from 'src/components/AsyncComponent';
import extractModule from 'src/module';
import store from 'src/store';
import { reactMediaMobileQuery } from 'src/styles/screens';

const register = extractModule(store);
const About = () => register('about', import(/* webpackChunkName: 'about' */ 'src/components/About'));
const Contact = () => register('contact', import(/* webpackChunkName: 'contact' */ 'src/components/Contact'));
const Home = () => register('home', import(/* webpackChunkName: 'home' */ 'src/components/Home'));
const Media = () => register('media', import(/* webpackChunkName: 'media' */ 'src/components/Media'));
const Press = () => register('press', import(/* webpackChunkName: 'press' */ 'src/components/Press'));
const Schedule = () => register('schedule', import(/* webpackChunkName: 'schedule' */ 'src/components/Schedule'));

const fadeOnEnter = (delay: number) => (element: HTMLElement) => {
    if (element) {
        TweenLite.fromTo(element, 0.25, { autoAlpha: 0 }, { autoAlpha: 1, delay });
    }
};

const fadeOnExit = (element: HTMLElement) => {
    if (element) {
        TweenLite.fromTo(element, 0.25, { autoAlpha: 1 }, { autoAlpha: 0 });
    }
};

const RootContainer = styled<{ isHome: boolean; }, 'div'>('div') `
    height: 100%;
    width: 100%;
    background-color: ${props => props.isHome ? 'black' : 'white'};
`;

const FadingContainer = styled('div') `
    height: 100%;
    width: 100%;
    visibility: hidden;
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
                        <Transition
                            in={this.state.homeBgLoaded}
                            onEntering={fadeOnEnter(0)}
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
                                onExiting={fadeOnExit}
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
                                            path="/media"
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
