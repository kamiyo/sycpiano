import '@/less/nav-bar.less';
import '@/less/nav-bar-layout.less';
import React from 'react';

import NavBarLogo from '@/js/components/App/NavBarLogo.jsx';
import NavBarLinks from '@/js/components/App/NavBarLinks.jsx';


export default class NavBar extends React.Component {
    render() {
        var links = ['home', 'about', 'schedule', 'media', 'press', 'contact']
        return (
            <div className='navBar'>
                <NavBarLogo />
                <NavBarLinks links={links} />
            </div>
        )
    }
};