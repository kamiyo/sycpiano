import React from 'react';
import { NavLink } from 'react-router-dom';

const SubNavLink = ({ basePath, link, onClick, ...props }) => (
    <li className="subNavLink no-highlight">
        <NavLink to={`${basePath}/${link}`} activeClassName="active" onClick={() => { setTimeout(() => onClick(), 250); }}>
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
