import 'less/App/NavBar/sub-nav.less';

import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import SubNav from 'src/components/SubNav/SubNav';

interface HighlightProps {
    readonly activeName: string;
    readonly link: string;
}

const Highlight: React.SFC<HighlightProps> = ({ activeName, link }) => (
    <div>
        <div className={`highlight ${activeName}`} />
        <div className='hyperlink'>{link}</div>
    </div>
);

interface NavBarLinkProps {
    readonly activeName: string;
    readonly link: string;
    readonly showSub: boolean;
    readonly subNavLinks: string[];
    readonly to: string;
    readonly toggleSub: (show?: boolean) => void;
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
                    exact={true}
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
);

export default NavBarLink;
