import '@/less/App/NavBar/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink, withRouter } from 'react-router-dom';
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
            (props.link === 'media') ?
                <a onClick={() => props.toggleSub()} className={`${props.activeName} unselectable`}>
                    <Highlight activeName={props.activeName} link={props.link} />
                </a> :
                <NavLink
                    exact
                    to={props.to}
                    onClick={() => props.toggleSub(false)}
                    className={props.activeName}
                >
                    <Highlight activeName={props.activeName} link={props.link} />
                </NavLink>
        }
        {
            (props.subNavLinks && props.showSub) ?
                <SubNav links={props.subNavLinks} /> :
                null
        }
    </li>
)

export default withRouter(NavBarLink);
