import 'less/App/NavBar/nav-bar-links.less';

import * as React from 'react';

import { LinkShape } from 'src/components/App/NavBar/types';

import NavBarLink from 'src/components/App/NavBar/NavBarLink';

interface NavBarLinksProps {
    readonly currentBasePath: string;
    readonly links: LinkShape[];
    readonly showSub: string;
    readonly toggleSub: (show?: string) => void;
}

const NavBarLinks: React.SFC<NavBarLinksProps> = (props) => (
    <div className='navBarLinks no-highlight'>
        <ul>
            {props.links.map((link: LinkShape, i: number): JSX.Element => {
                let activeName = '';
                if (link.path === props.currentBasePath) {
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
