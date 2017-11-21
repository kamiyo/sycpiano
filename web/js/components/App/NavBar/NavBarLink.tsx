import 'less/App/NavBar/sub-nav.less';

import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import { TweenLite } from 'gsap';
import SubNav from 'js/components/SubNav/SubNav.jsx';

const Highlight: React.SFC<{ activeName: string; link: string; }> = ({ activeName, link }) => (
    <div>
        <div className={`highlight ${activeName}`}></div>
        <div className='hyperlink'>{link}</div>
    </div>
);

interface NavBarLinkProps {
    activeName: string;
    link: string;
    showSub: boolean;
    subNavLinks: string[];
    to: string;
    toggleSub: (show?: boolean) => void;
}

const NavBarLink: React.SFC<NavBarLinkProps> = (props) => (
    <li className='navBarLink'>
        {
            (props.subNavLinks) ?
                <a
                    onClick={() => props.toggleSub()}
                    className={`${props.activeName} no-highlight`}
                >
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
            <Transition
                mountOnEnter={true}
                unmountOnExit={true}
                in={props.subNavLinks && props.showSub}
                onEnter={(el) => el.style.opacity = '1'}
                onExit={(el) => TweenLite.fromTo(el, 0.25, { opacity: 1 }, { opacity: 0 })}
                timeout={250}
            >
                <SubNav
                    basePath={props.to}
                    links={props.subNavLinks}
                    onClick={() => props.toggleSub(false)}
                />
            </Transition>
        }
    </li>
)

export default NavBarLink;
