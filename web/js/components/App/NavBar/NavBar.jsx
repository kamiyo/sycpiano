import '@/less/nav-bar.less';
import '@/less/nav-bar-layout.less';
import React from 'react';

import NavBarLogo from '@/js/components/App/NavBar/NavBarLogo.jsx';
import NavBarLinks from '@/js/components/App/NavBar/NavBarLinks.jsx';

const links = ['home', 'about', 'schedule', 'media', 'press', 'contact'];

export default class NavBar extends React.Component {
    render() {
        return (
            <div className='navBar'>
                <NavBarLogo {...this.props} />
                <NavBarLinks links={links} />
            </div>
        )
    }
};