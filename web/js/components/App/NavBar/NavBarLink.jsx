import '@/less/App/NavBar/sub-nav.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link, IndexLink, withRouter } from 'react-router-dom';
import SubNav from '@/js/components/SubNav/SubNav.jsx';

const Highlight = ({ highlightClass, link }) => (
    <div>
        <div className={highlightClass}></div>
        <div className="hyperlink">{link}</div>
    </div>
);

const NavBarLink = (props) => {
    return (
        <li className='navBarLink'>
            {(props.link === 'media') ?
                <a onClick={() => props.toggleSub()} className={(props.isActive) ? 'active' : ''}>
                    <Highlight highlightClass={`highlight${(props.showSub) ? ' active' : ''}`} link={props.link} />
                </a> :
                <NavLink
                    to={props.to}
                    onClick={() => props.toggleSub(false)}
                    activeClassName='active'
                >
                    <Highlight highlightClass={`highlight${(props.isActive) ? ' active' : ''}`} link={props.link} />
                </NavLink>


                /* (link === 'home')
                    ? <IndexLink to='/' onClick={() => props.toggleSub(false)} className={active}>
                        <Highlight highlightClass={highlightClass} link={link} />
                    </IndexLink>

                    : ((link === 'media')
                        ? <a onClick={() => props.toggleSub()} className={active}>
                            <Highlight highlightClass={highlightClass} link={link} />
                        </a>

                        : (
                            <Link
                                to={'/' + link}
                                onClick={() => props.toggleSub(false)}
                                className={active}
                            >
                                <Highlight highlightClass={highlightClass} link={link} />
                            </Link>
                        )
                    ) */
            }
            {
                (props.subNavLinks && props.showSub)
                    ? <SubNav links={props.subNavLinks} />
                    : null
            }
        </li>
    );
}

export default withRouter(NavBarLink);
