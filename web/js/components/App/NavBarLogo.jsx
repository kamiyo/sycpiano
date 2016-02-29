import '@/less/nav-bar-logo.less';
import React from 'react';

import LogoImage from '@/js/components/App/LogoImage.jsx';


export default class NavBarLogo extends React.Component {
    render() {
        return (
            <a href="#" className="navBarLogo">
                <LogoImage /><div className="navBarLogoText">SEAN CHEN</div>
            </a>
        )
    }
};
