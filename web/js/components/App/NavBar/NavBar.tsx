import 'less/App/NavBar/nav-bar.less';
import 'less/App/NavBar/nav-bar-layout.less';

import * as React from 'react';

import { LinkShape } from 'js/components/App/NavBar/types';
import NavBarLogo from 'js/components/App/NavBar/NavBarLogo';
import NavBarLinks from 'js/components/App/NavBar/NavBarLinks';

const links: LinkShape[] = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'schedule', path: '/schedule' },
    { name: 'media', path: '/media', subPaths: ['videos', 'music', 'photos'] },
    { name: 'press', path: '/press' },
    { name: 'contact', path: '/contact' }
];

interface NavBarProps {
    onClick(): void;
    currentBasePath: string;
}

interface NavBarState {
    showSub: boolean;
}

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    state = {
        showSub: false
    };

    toggleSubNav = (arg = !this.state.showSub) => {
        this.setState({showSub: arg});
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
        )
    }
};
