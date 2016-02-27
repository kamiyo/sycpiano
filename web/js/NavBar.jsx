import '../less/nav-bar.less';
import '../less/nav-bar-layout.less';
import React from 'react';

import NavBarLogo from './NavBarLogo.jsx';
import NavBarLinks from './NavBarLinks.jsx';


class NavLink {
    constructor(name, href) {
        this.name = name;
        this.href = href;
    }
}

export default class NavBar extends React.Component {
    render() {
        var links = [
            new NavLink('home', ''),
            new NavLink('about', ''),
            new NavLink('schedule', ''),
            new NavLink('media', ''),
            new NavLink('press', ''),
            new NavLink('contact', ''),
        ];
        return (
            <div className='navBar'>
                <NavBarLogo />
                <NavBarLinks links={links} />
            </div>
        )
    }
};