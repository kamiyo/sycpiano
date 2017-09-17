import '@/less/App/NavBar/nav-bar.less';
import '@/less/App/NavBar/nav-bar-layout.less';

import React from 'react';

import NavBarLogo from '@/js/components/App/NavBar/NavBarLogo.jsx';
import NavBarLinks from '@/js/components/App/NavBar/NavBarLinks.jsx';

const links = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'schedule', path: '/schedule' },
    { name: 'media', path: '/media', subPaths: ['videos', 'music', 'photos'] },
    { name: 'press', path: '/press' },
    { name: 'contact', path: '/contact' }
];

export default class NavBar extends React.Component {
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
                    pathname={this.props.currentPath}
                />
            </div>
        )
    }
};
