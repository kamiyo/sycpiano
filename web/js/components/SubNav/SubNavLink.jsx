import React from 'react';
import { NavLink } from 'react-router-dom';

const SubNavLink = ({ link }) => (
    <li className="subNavLink unselectable">
        <NavLink to={`/media/${link}`} activeClassName="active">
            {link}
        </NavLink>
    </li>
);

export default SubNavLink;
