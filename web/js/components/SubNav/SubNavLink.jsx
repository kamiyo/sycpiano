import React from 'react';
import { Link } from 'react-router';

const SubNavLink = ({ link }) => (
    <li className="subNavLink">
        <Link to={`/media/${link}`} activeClassName="active">
            {link}
        </Link>
    </li>
);

export default SubNavLink;
