import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import color from 'color';
import { hiDPI } from 'polished';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import SubNav from 'src/components/App/NavBar/SubNav/SubNav';

import { lightBlue, logoBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { navBarHeight, navBarMarginTop } from 'src/styles/variables';

interface HighlightProps {
    readonly active: boolean;
    readonly isHome: boolean;
    readonly link: string;
}

const highlightStyles = css`
    ${hiDPI(2)} {
        height: ${navBarHeight.hdpi}px;
        margin-top: 0;
    }
    margin-top: ${navBarMarginTop.nonHdpi}px;
    height: ${navBarHeight.nonHdpi - navBarMarginTop.nonHdpi}px;
    padding: 20px 10px 0 10px;
`;

// oh hi
const Mark = styled<{ active: boolean; isHome: boolean; }, 'div'>('div')`
    ${highlightStyles}
    ${hiDPI(2)} {
        margin-top: ${navBarMarginTop.hdpi}px;
        height: 5px;
    }
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0;
    margin-top: ${navBarMarginTop.nonHdpi}px;
    opacity: 0;
    height: 5px;
    z-index: -1;
    background-color: ${lightBlue};
    ${(props) => props.active && `opacity: 1.0;`}
    ${(props) => props.isHome && `background-color: white;`}
`;

const HyperlinkText = styled('div')`
    ${highlightStyles}
`;

const Highlight: React.SFC<HighlightProps> = ({ active, isHome, link }) => (
    <>
        <Mark active={active} isHome={isHome} />
        <HyperlinkText>{link}</HyperlinkText>
    </>
);

interface NavBarLinkProps {
    readonly className?: string;
    readonly active: boolean;
    readonly isHome: boolean;
    readonly link: string;
    readonly showSub: string;
    readonly subNavLinks: string[];
    readonly to: string;
    readonly toggleSub: (show?: string) => void;
}

const linkStyle = css`
    ${noHighlight}
    color: rgba(0, 0, 0, 0.7);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
        color: ${color(logoBlue).mix(color('#444')).string()};
    }
`;

const linkActiveStyle = css`
    color: ${logoBlue};
`;

const linkHomeStyle = css`
    color: rgba(255, 255, 255, 0.6);

    &:hover {
        color: rgba(255, 255, 255, 1);
    }
`;

const linkHomeActiveStyle = css`
    color: rgba(255, 255, 255, 1);
`;

let NavBarLink: React.SFC<NavBarLinkProps> = (props) => (
    <li className={props.className}>
        {
            (props.subNavLinks) ?
                <a
                    onClick={() => props.toggleSub(props.link)}
                    className={cx(
                        linkStyle,
                        { [linkActiveStyle]: props.active && !props.isHome },
                        { [linkHomeStyle]: props.isHome },
                        { [linkHomeActiveStyle]: props.active && props.isHome },
                    )}
                >
                    <Highlight active={props.active} isHome={props.isHome} link={props.link} />
                </a> :
                <Link
                    to={props.to}
                    onClick={() => props.toggleSub('')}
                    className={cx(
                        linkStyle,
                        { [linkActiveStyle]: props.active && !props.isHome },
                        { [linkHomeStyle]: props.isHome },
                        { [linkHomeActiveStyle]: props.active && props.isHome },
                    )}
                >
                    <Highlight active={props.active} isHome={props.isHome} link={props.link} />
                </Link>
        }
        {
            <Transition
                mountOnEnter={true}
                unmountOnExit={true}
                in={props.subNavLinks && props.showSub === props.link}
                onEnter={(el) => TweenLite.fromTo(el, 0.25, { opacity: 0 }, { opacity: 1 })}
                onExit={(el) => TweenLite.fromTo(el, 0.25, { opacity: 1 }, { opacity: 0 })}
                timeout={250}
            >
                <SubNav
                    basePath={props.to}
                    links={props.subNavLinks}
                    onClick={() => props.toggleSub('')}
                />
            </Transition>
        }
    </li>
);

NavBarLink = styled(NavBarLink)`
    ${hiDPI(2)} {
        font-size: 16px;
    }
    font-size: 22px;
    position: relative;
    font-family: ${lato2};
    letter-spacing: 0em;
    display: inline-block;
    margin-right: 2px;
    vertical-align: top;
    text-align: center;

    &:last-child {
        margin-right: 0;
    }
`;

export default NavBarLink;
