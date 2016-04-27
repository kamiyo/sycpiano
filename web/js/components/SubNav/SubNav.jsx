import React from 'react';
import SubNavLink from '@/js/components/SubNav/SubNavLink.jsx';

const SubNav = (props) => (
    <ul className='subNav'>
        {props.links.map((link) => <SubNavLink key={link} link={link} />)}
    </ul>
);

export default SubNav;
