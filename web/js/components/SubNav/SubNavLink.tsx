import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface SubNavLinkProps {
    basePath: string;
    link: string;
    onClick: () => void;
}

const SubNavLink: React.SFC<SubNavLinkProps> = ({ basePath, link, onClick }) => (
    <li className='subNavLink no-highlight'>
        <NavLink to={`${basePath}/${link}`} activeClassName='active' onClick={() => { setTimeout(() => onClick(), 250); }}>
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
