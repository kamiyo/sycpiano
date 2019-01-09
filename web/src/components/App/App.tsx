import { startCase, toLower, toUpper } from 'lodash-es';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import ReactMedia from 'react-media';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import { RequiredProps as AboutProps } from 'src/components/About/About';
import { RequiredProps as ContactProps } from 'src/components/Contact/Contact';
import { RequiredProps as HomeProps } from 'src/components/Home/Home';
import { RequiredProps as MediaProps } from 'src/components/Media/Media';
import { RequiredProps as PressProps } from 'src/components/Press/Press';
import { RequiredProps as ScheduleProps } from 'src/components/Schedule/Schedule';

import { Global } from '@emotion/core';
import styled from '@emotion/styled';
import { globalCss } from 'src/styles/global';

import 'picturefill';
import 'picturefill/dist/plugins/mutation/pf.mutation.min';

import CSSPlugin from 'gsap/CSSPlugin';
import TweenLite from 'gsap/TweenLite';

/* tslint:disable:no-unused-var */
// @ts-ignore
const activated = [
    CSSPlugin,
];
/* tslint:enable:no-unused-var */

import moment from 'moment-timezone';

import { toggleNavBar } from 'src/components/App/NavBar/actions';
import NavBar from 'src/components/App/NavBar/NavBar';
import { LogoSVG } from 'src/components/LogoSVG';

import AsyncComponent from 'src/components/AsyncComponent';
import extractModule from 'src/module';
import store from 'src/store';
import { reactMediaMobileQuery } from 'src/styles/screens';
import { GlobalStateShape } from 'src/types';
import { metaDescriptions, titleStringBase } from 'src/utils';

const register = extractModule(store);
const About = () => register('about', import(/* webpackChunkName: 'about' */ 'src/components/About'));
const Contact = () => register('contact', import(/* webpackChunkName: 'contact' */ 'src/components/Contact'));
const Home = () => register('home', import(/* webpackChunkName: 'home' */ 'src/components/Home'));
const Media = () => register('media', import(/* webpackChunkName: 'media' */ 'src/components/Media'));
const Press = () => register('press', import(/* webpackChunkName: 'press' */ 'src/components/Press'));
const Schedule = () => register('schedule', import(/* webpackChunkName: 'schedule' */ 'src/components/Schedule'));
const Page404 = () => register('page404', import(/* webpackChunkName: 'page404' */ 'src/components/Error'));

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

const RootContainer = styled.div<{ isHome: boolean }>`
    height: 100%;
    width: 100%;
    background-color: ${props => props.isHome ? 'black' : 'white'};
`;

const FadingContainer = styled('div')`
    height: 100%;
    width: 100%;
    visibility: hidden;
`;

interface AppStateToProps {
    navbarVisible: boolean;
}

interface AppDispatchToProps {
    toggleNavBar: typeof toggleNavBar;
}

type AppProps = RouteComponentProps<{}> & AppStateToProps & AppDispatchToProps;

class App extends React.Component<AppProps, { homeBgLoaded: boolean; lastMatch?: boolean; }> {
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
        let currentPage = this.getRouteBase();
        currentPage = currentPage === '/' ? 'Home' : startCase(currentPage.replace('/', ''));
        const description = metaDescriptions[toLower(currentPage)] || 'Welcome to the official website of pianist, composer, and arranger Sean Chen';
        return (
            <>
                <Global styles={globalCss} />
                <Helmet
                    title={`${titleStringBase} | ${currentPage}`}
                    meta={[
                        {
                            name: 'description',
                            content: description,
                        },
                        {
                            name: 'copyright',
                            content: `copyright Sean Chen ${moment().format('YYYY')}.`,
                        },
                    ]}
                />
                <ReactMedia query={reactMediaMobileQuery}>
                    {(matches: boolean) => {
                        if (!matches) {
                            if (!this.props.navbarVisible) {
                                this.props.toggleNavBar(true);
                            }
                        }
                        return (
                            <RootContainer isHome={this.getRouteBase() === '/'}>
                                <LogoSVG />
                                <Transition
                                    in={this.props.navbarVisible || !matches}
                                    onEntering={this.getRouteBase() === '/' ? fadeOnEnter(0) : slideOnEnter(0)}
                                    onExiting={slideOnExit(0)}
                                    timeout={250}
                                    appear={true}
                                >
                                    <NavBar
                                        currentBasePath={this.getRouteBase()}
                                        specificRouteName={this.getMostSpecificRouteName()}
                                    />
                                </Transition>
                                <TransitionGroup component={null}>
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
                                                    render={(childProps) => <AsyncComponent<AboutProps> moduleProvider={About} {...childProps} isMobile={matches} />}
                                                />
                                                <Route
                                                    path="/contact"
                                                    exact={true}
                                                    render={(childProps) => <AsyncComponent<ContactProps> moduleProvider={Contact} {...childProps} isMobile={matches} />}
                                                />
                                                <Route
                                                    path="/media/:media/:other*"
                                                    exact={true}
                                                    render={(childProps) => <AsyncComponent<MediaProps> moduleProvider={Media} {...childProps} isMobile={matches} />}
                                                />
                                                <Route
                                                    path="/press"
                                                    exact={true}
                                                    render={(childProps) => <AsyncComponent<PressProps> moduleProvider={Press} {...childProps} isMobile={matches} />}
                                                />
                                                <Route
                                                    path="/schedule/:type?/:date?"
                                                    render={(childProps) => <AsyncComponent<ScheduleProps> moduleProvider={Schedule} {...childProps} isMobile={matches} />}
                                                />
                                                <Route
                                                    path="/"
                                                    exact={true}
                                                    render={(childProps) => <AsyncComponent<HomeProps> moduleProvider={Home} {...childProps} bgLoaded={this.bgLoaded} isMobile={matches} />}
                                                />
                                                <Route render={() => <AsyncComponent<{}> moduleProvider={Page404} />} />
                                            </Switch>
                                        </FadingContainer>
                                    </Transition>
                                </TransitionGroup>
                            </RootContainer>
                        );
                    }}
                </ReactMedia>
            </>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    navbarVisible: navbar.isVisible,
});

export default connect<AppStateToProps, AppDispatchToProps>(
    mapStateToProps,
    { toggleNavBar },
)(App);
