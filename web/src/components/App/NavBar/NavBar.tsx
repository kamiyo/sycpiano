import 'less/App/NavBar/nav-bar-layout.less';
import 'less/App/NavBar/nav-bar.less';

import * as React from 'react';

import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';
import { LinkShape } from 'src/components/App/NavBar/types';

const links: LinkShape[] = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'schedule', path: '/schedule', subPaths: ['upcoming', 'archive'] },
    { name: 'media', path: '/media', subPaths: ['videos', 'music', 'photos'] },
    { name: 'press', path: '/press' },
    { name: 'contact', path: '/contact' },
];

interface NavBarProps {
    readonly onClick: () => void;
    readonly currentBasePath: string;
}

interface NavBarState {
    readonly showSub: string;
}

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
            <div className='navBar'>
                <NavBarLogo
                    onClick={this.props.onClick}
                />
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
