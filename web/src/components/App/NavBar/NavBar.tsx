import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { HamburgerNav } from 'src/components/App/NavBar/HamburgerNav';
import { links } from 'src/components/App/NavBar/links';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';

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
    readonly isExpanded?: boolean;
}

const navBarStyle = css`
    height: ${navBarHeight.nonHdpi}px;
    padding: 0 30px 0 0;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        padding-right: 15px;
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
    transition: background-color 0.25s;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.3);
`;

const homeNavBarStyle = (isExpanded: boolean) => css`
    background-color: ${isExpanded ? 'white' : 'transparent'};
`;

const StyledNavBarLogo = styled(NavBarLogo) `
    display: inline-flex;
`;

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    state = {
        showSubs: [''],
        isExpanded: false,
    };

    setExpandedState = (toExpand: boolean = null) => this.setState({
        isExpanded: (toExpand === null) ? !this.state.isExpanded : toExpand,
    });

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
                    { [homeNavBarStyle(this.state.isExpanded)]: this.props.currentBasePath === '/' },
                )}
            >
                <StyledNavBarLogo
                    isHome={this.props.currentBasePath === '/'}
                    isExpanded={this.state.isExpanded}
                    specificRouteName={this.props.specificRouteName}
                />
                <NavComponent
                    links={links}
                    showSubs={this.state.showSubs}
                    toggleSub={this.toggleSubNav}
                    currentBasePath={this.props.currentBasePath}
                    isMobile={this.props.isMobile}
                    isExpanded={this.state.isExpanded}
                    closeMobileMenu={this.setExpandedState}
                />
            </div >
        );
    }
}
