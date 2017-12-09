import 'less/App/NavBar/nav-bar-logo.less';

import * as React from 'react';

import { LogoInstance } from 'src/components/LogoSVG';

interface NavBarLogoProps {
    readonly onClick: (event: MouseEvent) => void;
}

const NavBarLogo: React.SFC<NavBarLogoProps & React.HTMLAttributes<HTMLDivElement> > = (props) => (
    <div className='navBarLogo' onClick={props.onClick}>
        <LogoInstance />
        <div className='navBarLogoText no-highlight'>
            <span>SEAN CHEN</span>
        </div>
    </div>
);

export default NavBarLogo;
