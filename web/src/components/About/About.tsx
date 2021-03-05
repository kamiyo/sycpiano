import startCase from 'lodash-es/startCase';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import styled from '@emotion/styled';

import AsyncComponent from 'src/components/AsyncComponent';
import module from 'src/module';
import store from 'src/store';

import { RequiredProps as BioProps } from 'src/components/About/Bio/Bio';
import { RequiredProps as DiscsProps } from 'src/components/About/Discs/Discs';
import { RequiredProps as PressProps } from 'src/components/About/Press/Press';

const register = module(store);

const Bio = () => register('bio', import(/* webpackChunkName: 'bio' */ 'src/components/About/Bio'));
const Press = () => register('press', import(/* webpackChunkName: 'press' */ 'src/components/About/Press'));
const Discs = () => register('discs', import(/* webpackChunkName: 'discs' */ 'src/components/About/Discs'));

import { container } from 'src/styles/mixins';
import { metaDescriptions, titleStringBase, fadeOnEnter, fadeOnExit } from 'src/utils';

const AboutContainer = styled.div`
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

type AboutProps = { isMobile: boolean } & RouteComponentProps<{ about: string }>;

const About: React.FC<AboutProps> = ({ isMobile, match, location }) => (
    <>
        <Helmet
            title={`${titleStringBase} | ${startCase(match.params.about)}`}
            meta={[
                {
                    name: 'description',
                    content: metaDescriptions[match.params.about],
                },
            ]}
        />
        <AboutContainer>
            <TransitionGroup component={null}>
                <Transition<undefined>
                    key={match.params.about}
                    onEntering={fadeOnEnter(0.25)}
                    onExiting={fadeOnExit()}
                    timeout={750}
                    appear={true}
                >
                    <FadingContainer>
                        <Switch location={location}>
                            <Route
                                path="/about/biography"
                                render={(childProps) => <AsyncComponent<BioProps> moduleProvider={Bio} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                path="/about/press"
                                render={(childProps) => <AsyncComponent<PressProps> moduleProvider={Press} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                path="/about/discography"
                                render={(childProps) => <AsyncComponent<DiscsProps> moduleProvider={Discs} {...childProps} isMobile={isMobile} />}
                                exact={true}
                            />
                            <Route
                                path="/about"
                                render={() => <Redirect to="/about/biography" />}
                            />
                        </Switch>
                    </FadingContainer>
                </Transition>
            </TransitionGroup>
        </AboutContainer>
    </>
);

export type AboutType = typeof About;
export type RequiredProps = AboutProps;
export default About;
