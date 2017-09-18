import '@/less/App/NavBar/nav-bar-logo.less';

import React from 'react';
import { LogoInstance } from '@/js/components/LogoSVG.jsx'

const NavBarLogo = (props) => (
    <div className="navBarLogo" onClick={props.onClick}>
        <LogoInstance /><div className="navBarLogoText unselectable"><span>SEAN CHEN</span></div>
    </div>
)

export default NavBarLogo;