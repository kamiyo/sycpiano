import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { Transition } from 'react-transition-group';

import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';
import { LinkShape } from 'src/components/App/NavBar/types';

import TweenLite from 'gsap/TweenLite';
import { hiDPI } from 'polished';
import { navBarHeight } from 'src/styles/variables';

const fadeOnEnter = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 0 }, { opacity: 1, delay: 0.25 });
};

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.fromTo(element, 0.25, { opacity: 1 }, { opacity: 0 });
};

const links: LinkShape[] = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'schedule', path: '/schedule', subPaths: ['upcoming', 'archive'] },
    { name: 'media', path: '/media', subPaths: ['videos', 'music', 'photos'] },
    { name: 'press', path: '/press' },
    { name: 'contact', path: '/contact' },
];

interface NavBarProps {
    readonly currentBasePath: string;
}

interface NavBarState {
    readonly showSub: string;
}

const navBarStyle = css`
    height: ${navBarHeight.nonHdpi}px;
    padding: 0 30px 0 0;

    ${hiDPI(2)} {
        height: ${navBarHeight.hdpi}px;
        padding-left: 15px;
    }

    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5000;
    box-shadow: 0 -20px 15px 15px rgba(0, 0, 0, 0.7);
    background-color: white;
    transition: all 0.25s;
`;

const homeNavBarStyle = css`
    box-shadow: 0 -20px 15px 20px rgba(0, 0, 0, 0.7);
    background-color: rgba(255, 255, 255, 0);
`;

const BlurContainer = styled('div')`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
`;

const BlurElement = styled('div')`
    background: url(/images/syc_chair_bg_clean_1920.jpg) no-repeat;
    background-size: 100%;
    background-position: 0px -180px;
    margin: -15px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    filter: blur(10px);
    z-index: -1;
`;

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    state = {
        showSub: '',
    };

    toggleSubNav = (arg = '') => {
        if (arg === this.state.showSub) {
            this.setState({ showSub: '' });
        } else {
            this.setState({ showSub: arg });
        }
    }

    render() {
        return (
            <div
                className={cx(
                    navBarStyle,
                    { [homeNavBarStyle]: this.props.currentBasePath === '/' },
                )}
            >
                <Transition
                    in={this.props.currentBasePath === '/'}
                    onEntering={fadeOnEnter}
                    onExiting={fadeOnExit}
                    timeout={500}
                    appear={true}
                >
                    <BlurContainer>
                        <BlurElement />
                    </BlurContainer>
                </Transition>
                <NavBarLogo isHome={this.props.currentBasePath === '/'} />
                <NavBarLinks
                    links={links}
                    showSub={this.state.showSub}
                    toggleSub={this.toggleSubNav}
                    currentBasePath={this.props.currentBasePath}
                />
            </div>
        );
    }
}
