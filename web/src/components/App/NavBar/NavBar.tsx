import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { HamburgerNav } from 'src/components/App/NavBar/HamburgerNav';
import { links } from 'src/components/App/NavBar/links';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';

import { hiDPI } from 'polished';
import { screenPortrait, screenXS } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

interface NavBarProps {
    readonly currentBasePath: string;
    readonly className?: string;
    readonly specificRouteName: string;
    readonly isMobile: boolean;
}

interface NavBarState {
    readonly showSubs: string[];
}

const navBarStyle = css`
    height: ${navBarHeight.nonHdpi}px;
    padding: 0 30px 0 0;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        padding-right: 15px;
    }

    /* stylelint-disable-next-line */
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
    background-color: white;
    transition: background-color 0.5s;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.3);
`;

const homeNavBarStyle = css`
    background-color: transparent;
`;

const StyledNavBarLogo = styled(NavBarLogo) `
    display: inline-flex;
`;

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    state = {
        showSubs: [''],
    };

    toggleSubNav = (arg = '') => {
        if (this.props.isMobile) {
            if (this.state.showSubs.includes(arg)) {
                this.setState({ showSubs: this.state.showSubs.filter((value) => arg !== value) });
            } else {
                this.setState({ showSubs: [...this.state.showSubs, arg] });
            }
        } else {
            if (arg === this.state.showSubs[0]) {
                this.setState({ showSubs: [] });
            } else {
                this.setState({ showSubs: [arg] });
            }
        }
    }

    render() {
        const NavComponent = this.props.isMobile ? HamburgerNav : NavBarLinks;
        return (
            <div
                className={cx(
                    this.props.className,
                    navBarStyle,
                    { [homeNavBarStyle]: this.props.currentBasePath === '/' },
                )}
            >
                <StyledNavBarLogo
                    isHome={this.props.currentBasePath === '/'}
                    specificRouteName={this.props.specificRouteName}
                />
                <NavComponent
                    links={links}
                    showSubs={this.state.showSubs}
                    toggleSub={this.toggleSubNav}
                    currentBasePath={this.props.currentBasePath}
                    isMobile={this.props.isMobile}
                />
            </div >
        );
    }
}
