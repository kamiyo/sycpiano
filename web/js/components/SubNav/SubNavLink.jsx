import React from 'react';
import { NavLink } from 'react-router-dom';

const SubNavLink = ({ link }) => (
    <li className="subNavLink">
        <NavLink to={`/media/${link}`} activeClassName="active">
            {link}
            {/* <span className={`mediaIcon ${link}`}></span> */}
        </NavLink>
    </li>
);

export default SubNavLink;
