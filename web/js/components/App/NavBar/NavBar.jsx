import '@/less/App/NavBar/nav-bar.less';
import '@/less/App/NavBar/nav-bar-layout.less';

import React from 'react';

import NavBarLogo from '@/js/components/App/NavBar/NavBarLogo.jsx';
import NavBarLinks from '@/js/components/App/NavBar/NavBarLinks.jsx';

const links = [
    'home',
    'about',
    'schedule',
    { name: 'media', subNavLinks: ['videos', 'music', 'photos'] },
    'press',
    'contact'
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
                <NavBarLogo {...this.props} />
                <NavBarLinks links={links} showSub={this.state.showSub} toggleSub={this.toggleSubNav} />
            </div>
        )
    }
};
