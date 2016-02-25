import '../less/nav-bar-logo.less';
import React from 'react';

import LogoImage from './LogoImage.jsx';


export default class NavBarLogo extends React.Component {
    render() {
        return (
            <div className="navBarLogo">
                <LogoImage /><div className="navBarLogoText">SEAN CHEN</div>
            </div>
        )
    }
};
