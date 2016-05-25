import '@/less/nav-bar-links.less';
import React from 'react';

import NavBarLink from '@/js/components/App/NavBar/NavBarLink.jsx';


const NavBarLinks = (props) => (
    <div className='navBarLinks'>
        <ul>
        {props.links.map(function(link, i) {
            let linkIsObj = typeof link === 'object';
            let subNavLinks = linkIsObj ? link.subNavLinks : null;
            link = linkIsObj ? link.name : link;
            return (
                <NavBarLink key={i} link={link} subNavLinks={subNavLinks} showSub={props.showSub} toggleSub={props.toggleSub}/>
            );
        })}
        </ul>
    </div>
);

export default NavBarLinks;