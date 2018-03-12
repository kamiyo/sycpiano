import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { mix } from 'polished';
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
    readonly isMobile: boolean;
    readonly isHome: boolean;
    readonly link: string;
}

const getHighlightStyles = (isMobile: boolean) => css`
    /* stylelint-disable */
    ${!isMobile && `
        margin-top: ${navBarMarginTop.nonHdpi}px;
        height: ${navBarHeight.nonHdpi - navBarMarginTop.nonHdpi}px;
    `}
    /* stylelint-enable */
    padding: ${isMobile ? '1.8rem 0' : '20px 10px 0 10px'};
`;

const getHighlightDefaultStyle = (isMobile: boolean) => css`
    ${getHighlightStyles(isMobile)}
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0;
    margin-top: ${navBarMarginTop.nonHdpi}px;
    opacity: 0;
    height: 5px;
    z-index: -1;
    background-color: ${lightBlue};
`;

const highlightActiveStyle = css`
    opacity: 1;
`;

const highlightHomeStyle = css`
    background-color: white;
`;

const highlightHomeActivestyle = css`
    height: 5px;
`;

const HyperlinkText = styled<{ isMobile: boolean }, 'div'>('div') `
    ${props => getHighlightStyles(props.isMobile)}
`;

const Highlight: React.SFC<HighlightProps> = ({ active, isHome, link, isMobile }) => (
    <>
        {!isMobile && <div
            className={cx(
                getHighlightDefaultStyle(isMobile),
                { [highlightActiveStyle]: active },
                { [highlightHomeStyle]: isHome },
                { [highlightHomeActivestyle]: active && isHome },
            )}
        />}
        <HyperlinkText isMobile={isMobile}>{link}</HyperlinkText>
    </>
);

interface NavBarLinkProps {
    readonly className?: string;
    readonly active: boolean;
    readonly isHome: boolean;
    readonly isExpanded: boolean;
    readonly link: string;
    readonly showSubs: string[];
    readonly subNavLinks: string[];
    readonly to: string;
    readonly toggleSub: (show?: string) => void;
    readonly isMobile: boolean;
    readonly closeMobileMenu?: (toExpand?: boolean) => void;
}

const linkStyle = css`
    ${noHighlight}
    color: rgba(0, 0, 0, 0.7);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
        color: ${mix(0.5, logoBlue, '#444')};
    }

    -webkit-tap-highlight-color: transparent;
`;

const linkActiveStyle = css`
    color: ${logoBlue};
`;

const linkHomeStyle = css`
    color: white;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.8);

    &:hover {
        color: white;
        text-shadow: 0 0 1px rgba(255, 255, 255, 1);
    }
`;

const linkHomeActiveStyle = css`
    text-shadow: 0 0 1px rgba(255, 255, 255, 1);
`;

const getSubNavContainer = (isMobile: boolean) => css`
    /* stylelint-disable */
    ${isMobile ? `
        height: 0;
        overflow: hidden;
    ` : `
        visibility: hidden;
    `}
    /* stylelint-enable */
`;

const enterAnimation = (el: HTMLElement, isAppearing: boolean, isMobile: boolean) => {
    if (isMobile) {
        if (isAppearing) {
            el.style.height = 'auto';
        } else {
            TweenLite.set(el, { height: 'auto' });
            TweenLite.from(el, 0.25, { height: 0 });
        }
    } else {
        TweenLite.to(el, 0.25, { autoAlpha: 1 });
    }
};

const exitAnimation = (el: HTMLElement, isMobile: boolean) => {
    isMobile ?
        TweenLite.to(el, 0.25, { height: 0 })
        : TweenLite.to(el, 0.25, { autoAlpha: 0 });
};

let NavBarLink: React.SFC<NavBarLinkProps> = (props) => (
    <li className={props.className}>
        {
            (props.subNavLinks) ?
                <a
                    onClick={() => props.toggleSub(props.link)}
                    className={cx(
                        linkStyle,
                        { [linkActiveStyle]: props.active && !props.isHome && !props.isMobile },
                        { [linkHomeStyle]: props.isHome && !props.isExpanded },
                        { [linkHomeActiveStyle]: props.active && props.isHome && !props.isMobile },
                    )}
                >
                    <Highlight active={props.active} isHome={props.isHome} link={props.link} isMobile={props.isMobile} />
                </a> :
                <Link
                    to={props.to}
                    onClick={() => {
                        props.toggleSub('');
                        props.closeMobileMenu && props.closeMobileMenu(false);
                    }}
                    className={cx(
                        linkStyle,
                        { [linkActiveStyle]: props.active && !props.isHome && !props.isMobile },
                        { [linkHomeStyle]: props.isHome && !props.isExpanded },
                        { [linkHomeActiveStyle]: props.active && props.isHome && !props.isMobile },
                    )}
                >
                    <Highlight active={props.active} isHome={props.isHome} link={props.link} isMobile={props.isMobile} />
                </Link>
        }
        {props.subNavLinks &&
            <Transition
                in={props.showSubs.includes(props.link)}
                onEnter={(el, isAppearing) => enterAnimation(el, isAppearing, props.isMobile)}
                onExit={(el) => exitAnimation(el, props.isMobile)}
                timeout={250}
                appear={true}
            >
                <div className={getSubNavContainer(props.isMobile)}>
                    <SubNav
                        basePath={props.to}
                        links={props.subNavLinks}
                        onClick={() => {
                            props.toggleSub('');
                            props.closeMobileMenu && props.closeMobileMenu(false);
                        }}
                        isHome={props.isHome}
                        isMobile={props.isMobile}
                    />
                </div>
            </Transition>
        }
    </li>
);

NavBarLink = styled(NavBarLink) `
    font-size: 1.4rem;
    position: relative;
    font-family: ${lato2};
    letter-spacing: 0;
    display: inline-block;
    padding: 0 1px 0 1px;
    vertical-align: top;
    text-align: center;

    &:last-child {
        margin-right: 0;
    }
`;

export default NavBarLink;
