import startCase from 'lodash-es/startCase';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import styled from '@emotion/styled';

import TweenLite from 'gsap/TweenLite';

import AsyncComponent from 'src/components/AsyncComponent';
import module from 'src/module';
import store from 'src/store';

import { RequiredProps as MusicProps } from 'src/components/Media/Music/Music';
import { RequiredProps as PhotosProps } from 'src/components/Media/Photos/Photos';
import { RequiredProps as VideosProps } from 'src/components/Media/Videos/Videos';

const register = module(store);

const Music = () => register('music', import(/* webpackChunkName: 'music' */ 'src/components/Media/Music'));
const Photos = () => register('photos', import(/* webpackChunkName: 'photos' */ 'src/components/Media/Photos'));
const Videos = () => register('videos', import(/* webpackChunkName: 'videos' */ 'src/components/Media/Videos'));

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

const MediaContainer = styled.div`
    height: 100%;
    width: 100%;
    overflow: hidden;
    ${container};
`;

const FadingContainer = styled.div`
    height: 100%;
    width: 100%;
    visibility: hidden;
    position: absolute;
`;

type MediaProps = { isMobile: boolean; } & RouteComponentProps<{ media: string; }>;

const Media = ({ isMobile, match, location }: MediaProps) => (
    <>
        <Helmet
            title={`${titleStringBase} | ${startCase(match.params.media)}`}
            meta={[
                {
                    name: 'description',
                    content: metaDescriptions[match.params.media],
                },
            ]}
        />
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
                                render={(childProps) => <AsyncComponent<VideosProps> moduleProvider={Videos} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                path="/media/music"
                                render={({ match: subMatch }) => (
                                    <Switch location={location}>
                                        <Route
                                            path="/media/music/:composer?/:piece?/:movement?"
                                            render={(childProps) => (
                                                <AsyncComponent<MusicProps> moduleProvider={Music} {...childProps} baseRoute={subMatch.url} isMobile={isMobile} />
                                            )}
                                        />
                                        <Route
                                            path="/media/music/(.*)"
                                            render={(childProps) => (
                                                <Redirect to="/media/music" {...childProps} />
                                            )}
                                        />
                                        <Route
                                            path="/media/music"
                                            render={(childProps) => (
                                                <AsyncComponent<MusicProps> moduleProvider={Music} {...childProps} baseRoute={subMatch.url} isMobile={isMobile} />
                                            )}
                                        />
                                    </Switch>
                                )}
                            />
                            <Route
                                path="/media/photos"
                                render={(childProps) => <AsyncComponent<PhotosProps> moduleProvider={Photos} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                path="/media"
                                render={() => <Redirect to="/media/videos" />}
                            />
                        </Switch>
                    </FadingContainer>
                </Transition>
            </TransitionGroup>
        </MediaContainer>
    </>
);

export type MediaType = React.FunctionComponent<MediaProps>;
export type RequiredProps = MediaProps;
export default Media;
