import 'less/App/NavBar/nav-bar-links.less';

import * as React from 'react';

import { LinkShape } from 'js/components/App/NavBar/types';

import NavBarLink from 'js/components/App/NavBar/NavBarLink';

interface NavBarLinksProps {
    currentBasePath: string;
    links: LinkShape[];
    showSub: boolean;
    toggleSub: (show?: boolean) => void;
}

const NavBarLinks: React.SFC<NavBarLinksProps> = (props) => (
    <div className='navBarLinks no-highlight'>
        <ul>
            {props.links.map((link: LinkShape, i: number): JSX.Element => {
                let activeName = '';
                if ((props.showSub && link.path === '/media') ||
                    (link.path === props.currentBasePath)) {
                    activeName = 'active';
                }
                return (
                    <NavBarLink
                        key={i}
                        link={link.name}
                        to={link.path}
                        subNavLinks={link.subPaths}
                        showSub={props.showSub}
                        toggleSub={props.toggleSub}
                        activeName={activeName}
                    />
                );
            })}
        </ul>
    </div>
);

export default NavBarLinks;