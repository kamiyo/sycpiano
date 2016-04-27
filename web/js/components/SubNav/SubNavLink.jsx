import React from 'react';
import {Link} from 'react-router';

const SubNavLink = (props) => (
    <li className="subNavLink">
        <Link to={'/media/' + props.link} activeClassName={'active'}>
            <span className={`mediaIcon ${props.link}`}></span>
        </Link>
    </li>
);

export default SubNavLink;