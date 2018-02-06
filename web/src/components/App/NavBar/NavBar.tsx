import * as React from 'react';
import { css, cx } from 'react-emotion';

import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';
import { LinkShape } from 'src/components/App/NavBar/types';

import { hiDPI } from 'polished';

import { navBarHeight } from 'src/styles/variables';

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
    readonly className?: string;
}

interface NavBarState {
    readonly showSub: string;
}

const navBarStyle = css`
    height: ${navBarHeight.nonHdpi}px;
    padding: 0 30px 0 0;

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
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
                    this.props.className,
                    navBarStyle,
                    { [homeNavBarStyle]: this.props.currentBasePath === '/' },
                )}
            >
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
