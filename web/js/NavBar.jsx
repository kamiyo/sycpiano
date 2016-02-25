import '../less/nav-bar.less';
import React from 'react';

import NavBarLogo from './NavBarLogo.jsx';


export default class NavBar extends React.Component {
    render() {
        return (
            <div className="navBar">
                <NavBarLogo />
            </div>
        )
    }
};