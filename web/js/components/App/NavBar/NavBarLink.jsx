import '@/less/App/NavBar/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter } from 'react-router';
import SubNav from '@/js/components/SubNav/SubNav.jsx';

const Highlight = ({ activeName, link }) => (
    <div>
        <div className={`highlight ${activeName}`}></div>
        <div className='hyperlink'>{link}</div>
    </div>
);

const NavBarLink = (props) => (
    <li className='navBarLink'>
        {
            (props.subNavLinks) ?
                <a onClick={() => props.toggleSub()} className={props.activeName}>
                    <Highlight activeName={props.activeName} link={props.link} />
                </a> :
                <Link
                    to={props.to}
                    onClick={() => props.toggleSub(false)}
                    className={props.activeName}
                >
                    <Highlight activeName={props.activeName} link={props.link} />
                </Link>
        }
        {
            (props.subNavLinks && props.showSub) ?
                <SubNav links={props.subNavLinks} /> :
                null
        }
    </li>
)

export default withRouter(NavBarLink);
