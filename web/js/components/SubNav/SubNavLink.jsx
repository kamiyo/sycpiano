import React from 'react';
import { Link } from 'react-router';

const SubNavLink = ({ link }) => (
    <li className="subNavLink">
        <Link to={`/media/${link}`} activeClassName="active">
            <span className={`mediaIcon ${link}`}></span>
        </Link>
    </li>
);

export default SubNavLink;
