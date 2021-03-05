import { omit, startCase, toLower } from 'lodash-es';
import { ReferenceObject } from 'popper.js'
import { parse, stringify } from 'qs';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import ReactMedia from 'react-media';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import { RequiredProps as AboutProps } from 'src/components/About/About';
import { RequiredProps as ContactProps } from 'src/components/Contact/Contact';
import { RequiredProps as HomeProps } from 'src/components/Home/Home';
import { RequiredProps as MediaProps } from 'src/components/Media/Media';
import { RequiredProps as ScheduleProps } from 'src/components/Schedule/Schedule';
import { RequiredProps as ShopProps } from 'src/components/Shop/Shop';

import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import { globalCss } from 'src/styles/global';

import 'picturefill';
import 'picturefill/dist/plugins/mutation/pf.mutation.min';

import moment from 'moment-timezone';

import { Cart } from 'src/components/Cart/Cart';
import { ToggleCartList } from 'src/components/Cart/actionTypes';
import { toggleCartListAction } from 'src/components/Cart/actions';
import { ClickListenerOverlay } from 'src/components/ClickListenerOverlay';
import { toggleNavBar } from 'src/components/App/NavBar/actions';
import { ToggleNav } from 'src/components/App/NavBar/actionTypes';
import NavBar from 'src/components/App/NavBar/NavBar';
import { LogoSVG } from 'src/components/LogoSVG';

import AsyncComponent from 'src/components/AsyncComponent';
import extractModule from 'src/module';
import store from 'src/store';
import { reactMediaMobileQuery } from 'src/styles/screens';
import { GlobalStateShape } from 'src/types';
import { metaDescriptions, titleStringBase, slideOnExit, fadeOnEnter, fadeOnExit, slideOnEnter } from 'src/utils';
import { ThunkDispatch } from 'redux-thunk';
import { usePopper } from 'react-popper';

const register = extractModule(store);
const About = () => register('about', import(/* webpackChunkName: 'about' */ 'src/components/About'));
const Contact = () => register('contact', import(/* webpackChunkName: 'contact' */ 'src/components/Contact'));
const Home = () => register('home', import(/* webpackChunkName: 'home' */ 'src/components/Home'));
const Media = () => register('media', import(/* webpackChunkName: 'media' */ 'src/components/Media'));
const Schedule = () => register('schedule', import(/* webpackChunkName: 'schedule' */ 'src/components/Schedule'));
const Shop = () => register('shop', import(/* webpackChunkName: 'shop' */ 'src/components/Shop'));
const Page404 = () => register('page404', import(/* webpackChunkName: 'page404' */ 'src/components/Error'));

const RootContainer = styled.div<{ isHome: boolean }>`
    height: 100%;
    width: 100%;
    background-color: white;
`;

const FadingContainer = styled.div<{ shouldBlur: boolean }>({
    height: '100%',
    width: '100%',
    visibility: 'hidden',
    transition: 'all 0.25s',
    overflow: 'hidden',
    position: 'absolute',
}, ({ shouldBlur }) => shouldBlur && ({
    filter: 'blur(8px)',
}));

const getRouteBase = (pathname: string) => {
    const matches: string[] = pathname.match(/^(\/[^/]+)?(\/[^/]+)?/);
    return matches[1] || '/';
}

const getMostSpecificRouteName = (pathname: string) => {
    const matches: string[] = pathname.match(/^(\/[^/]+)?(\/[^/]+)?/);
    const match = matches[2] || matches[1];
    return (match ? match.slice(1) : '') || null;
}

type AppProps = RouteComponentProps<Record<string, string>>;

const App: React.FC<AppProps> = ({ location, history }) => {
    const dispatch = useDispatch<ThunkDispatch<GlobalStateShape, void, ToggleNav | ToggleCartList>>();
    const navbarVisible = useSelector(({ navbar }: GlobalStateShape) => navbar.isVisible);
    const menuOpen = useSelector(({ navbar }: GlobalStateShape) => navbar.isExpanded);
    const cartOpen = useSelector(({ cart }: GlobalStateShape) => cart.visible);
    const [delayedRouteBase, setDelayedRouteBase] = React.useState(getRouteBase(location.pathname));
    const [referenceElement, setReferenceElement] = React.useState<ReferenceObject>(null);
    const [popperElement, setPopperElement] = React.useState<HTMLDivElement>(null);
    const [arrowElement, setArrowElement] = React.useState<HTMLDivElement>(null);
    const timerRef = React.useRef<NodeJS.Timeout>();

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: 'arrow',
                options: { element: arrowElement },
            },
            {
                name: 'offset',
                options: {
                    offset: [0, -6],
                },
            },
        ],
    });

    // Remove fbclid tracker
    React.useEffect(() => {
        const currentQuery = parse(location.search, { ignoreQueryPrefix: true });
        if (currentQuery.fbclid) {
            history.push(location.pathname + stringify(omit(currentQuery, 'fbclid')));
        }
    }, [location]);

    React.useEffect(() => {
        timerRef.current = setTimeout(() => { setDelayedRouteBase(getRouteBase(location.pathname)); }, 250);
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [location]);

    let currentPage = getMostSpecificRouteName(location.pathname);
    currentPage = currentPage ? 'Home' : startCase(currentPage);
    const description =
        metaDescriptions[toLower(currentPage)] || 'Welcome to the official website of pianist, composer, and arranger Sean Chen';
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
                        if (!navbarVisible) {
                            dispatch(toggleNavBar(true));
                        }
                    }
                    return (
                        <RootContainer isHome={getRouteBase(location.pathname) === '/'}>
                            <LogoSVG />
                            <Transition<undefined>
                                in={navbarVisible || !matches}
                                onEntering={getRouteBase(location.pathname) === '/' ? fadeOnEnter(0) : slideOnEnter(0)}
                                onExiting={slideOnExit(0)}
                                timeout={250}
                                appear={true}
                            >
                                <NavBar
                                    currentBasePath={delayedRouteBase}
                                    specificRouteName={getMostSpecificRouteName(location.pathname)}
                                    setReferenceElement={setReferenceElement}
                                />
                            </Transition>
                            <TransitionGroup component={null}>
                                <Transition<undefined>
                                    key={getRouteBase(location.pathname)}
                                    onEntering={fadeOnEnter(0.25)}
                                    onExiting={fadeOnExit(0)}
                                    timeout={750}
                                    appear={true}
                                >
                                    <FadingContainer shouldBlur={matches && (cartOpen || menuOpen) && delayedRouteBase !== '/'}>
                                        <Switch location={location}>
                                            <Route
                                                path="/about/:about"
                                                exact={true}
                                                render={(childProps) => <AsyncComponent<AboutProps> moduleProvider={About} {...childProps} isMobile={matches} />}
                                            />
                                            <Route
                                                path="/contact"
                                                exact={true}
                                                render={(childProps) => <AsyncComponent<ContactProps> moduleProvider={Contact} {...childProps} isMobile={matches} />}
                                            />
                                            <Route
                                                path="/media/:media?/:other*"
                                                exact={true}
                                                render={(childProps) => <AsyncComponent<MediaProps> moduleProvider={Media} {...childProps} isMobile={matches} />}
                                            />
                                            <Route
                                                path="/schedule/:type?/:date?"
                                                render={(childProps) => <AsyncComponent<ScheduleProps> moduleProvider={Schedule} {...childProps} isMobile={matches} />}
                                            />
                                            <Route
                                                path="/shop*"
                                                exact={true}
                                                render={(childProps) => <AsyncComponent<ShopProps> moduleProvider={Shop} {...childProps} isMobile={matches} />}
                                            />
                                            <Route
                                                path="/"
                                                exact={true}
                                                render={(childProps) => <AsyncComponent<HomeProps> moduleProvider={Home} {...childProps} /*bgLoaded={() => setHomeBgLoaded(true)}*/ isMobile={matches} />}
                                            />
                                            <Route render={() => <AsyncComponent<unknown> moduleProvider={Page404} />} />
                                        </Switch>
                                    </FadingContainer>
                                </Transition>
                            </TransitionGroup>
                            <Cart
                                setPopperElement={setPopperElement}
                                setArrowElement={setArrowElement}
                                styles={styles}
                                attributes={attributes}
                                isMobile={matches}
                            />
                            {(matches && cartOpen) &&
                                <ClickListenerOverlay onClick={() => dispatch(toggleCartListAction(false))} />}
                            {(matches && menuOpen) &&
                                <ClickListenerOverlay onClick={() => {}} /> /* eslint-disable-line @typescript-eslint/no-empty-function */
                            }
                        </RootContainer>
                    );
                }}
            </ReactMedia>
        </>
    );
};

export default App