import startCase from 'lodash-es/startCase';
import * as React from 'react';
import styled from 'react-emotion';
import { Helmet } from 'react-helmet';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import AsyncComponent from 'src/components/AsyncComponent';
import module from 'src/module';
import store from 'src/store';

const register = module(store);

const Music = () => register('music', import(/* webpackChunkName: 'music' */ 'src/components/Media/Music'));
const Photos = () => register('photos', import(/* webpackChunkName: 'photos' */ 'src/components/Media/Photos'));
const Videos = () => register('videos', import(/* webpackChunkName: 'videos' */ 'src/components/Media/Videos'));
import { cliburn1 } from 'src/styles/imageUrls';
import { container } from 'src/styles/mixins';
import { metaDescriptions, titleStringBase } from 'src/utils';

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

const MediaContainer = styled('div') `
    height: 100%;
    width: 100%;
    background: url(${cliburn1}) no-repeat;
    background-size: cover;
    overflow: hidden;
    ${container};
`;

const FadingContainer = styled('div') `
    height: 100%;
    width: 100%;
    visibility: hidden;
    position: absolute;
`;

const Media: React.SFC<{ isMobile: boolean; } & RouteComponentProps<{ media: string; }>> = ({ isMobile, match, location }) => (
    <>
        <Helmet>
            <title>{`${titleStringBase} | ${startCase(match.params.media)}`}</title>
            <meta name="description" content={metaDescriptions[match.params.media]} />
        </Helmet>
        <MediaContainer>
            <TransitionGroup component={null}>
                <Transition
                    key={match.params.media}
                    onEntering={fadeOnEnter(0.25)}
                    onExiting={fadeOnExit}
                    timeout={750}
                    appear={true}
                >
                    <FadingContainer>
                        <Switch location={location}>
                            <Route
                                path="/media/videos/:videoId?"
                                render={(childProps) => <AsyncComponent moduleProvider={Videos} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                path="/media/music"
                                render={({ match: subMatch }) =>
                                    <Switch location={location}>
                                        <Route
                                            path="/media/music/:composer?/:piece?/:movement?"
                                            render={(childProps) => (
                                                <AsyncComponent moduleProvider={Music} {...childProps} baseRoute={subMatch.url} isMobile={isMobile} />
                                            )}
                                        />
                                        <Route
                                            path="/media/music/(.*)"
                                            render={() => (
                                                <Redirect to="/media/music" />
                                            )}
                                        />
                                        <Route
                                            path="/media/music"
                                            render={(childProps) => (
                                                <AsyncComponent moduleProvider={Music} {...childProps} baseRoute={subMatch.url} isMobile={isMobile} />
                                            )}
                                        />
                                    </Switch>}
                            />
                            <Route
                                path="/media/photos"
                                render={(childProps) => <AsyncComponent moduleProvider={Photos} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                render={() => <Redirect to="/media/videos"/>}
                            />
                        </Switch>
                    </FadingContainer>
                </Transition>
            </TransitionGroup>
        </MediaContainer>
    </>
);

export type MediaType = typeof Media;
export default Media;
