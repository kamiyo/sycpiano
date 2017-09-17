import '@/less/App/NavBar/nav-bar-links.less';

import React from 'react';

import NavBarLink from '@/js/components/App/NavBar/NavBarLink.jsx';

const NavBarLinks = (props) => (
    <div className='navBarLinks'>
        <ul>
            {props.links.map(function (link, i) {
                let activeName = '';
                if ((props.showSub && link.path === '/media') ||
                    (link.path === props.pathname)) {
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