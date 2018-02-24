import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { hiDPI, mix } from 'polished';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import SubNav from 'src/components/App/NavBar/SubNav/SubNav';

import { lightBlue, logoBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenPortrait, screenXS } from 'src/styles/screens';
import { navBarHeight, navBarMarginTop } from 'src/styles/variables';

interface HighlightProps {
    readonly active: boolean;
    readonly isHome: boolean;
    readonly link: string;
}

const highlightStyles = css`
    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${hiDPI(2)} {
        height: ${navBarHeight.hdpi}px;
        margin-top: 0;
    }

    margin-top: ${navBarMarginTop.nonHdpi}px;
    height: ${navBarHeight.nonHdpi - navBarMarginTop.nonHdpi}px;
    padding: 20px 10px 0 10px;
`;

const highlightDefaultStyle = css`
    ${highlightStyles}

    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
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
`;

const highlightActiveStyle = css`
    opacity: 1;
`;

const highlightHomeStyle = css`
    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${hiDPI(2)} {
        background-color: white;
    }

    background-color: white;
`;

const highlightHomeActivestyle = css`
    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${hiDPI(2)} {
        height: 2px;
    }

    height: 5px;
`;

const HyperlinkText = styled('div')`
    ${highlightStyles}
`;

const Highlight: React.SFC<HighlightProps> = ({ active, isHome, link }) => (
    <>
        <div
            className={cx(
                highlightDefaultStyle,
                { [highlightActiveStyle]: active },
                { [highlightHomeStyle]: isHome },
                { [highlightHomeActivestyle]: active && isHome },
            )}
        />
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
`;

const linkActiveStyle = css`
    color: ${logoBlue};
`;

const linkHomeStyle = (isMobile: boolean) => css`
    color: rgba(200, 200, 200, 1);
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.8);

    &:hover {
        color: ${isMobile ? 'rgba(200, 200, 200, 1)' : 'rgba(255, 255, 255, 1)'};
        text-shadow: 0 0 1px rgba(255, 255, 255, 1);
    }
`;

const linkHomeActiveStyle = (isMobile: boolean) => css`
    color: ${isMobile ? 'rgba(200, 200, 200, 1)' : 'rgba(255, 255, 255, 1)'};
    text-shadow: 0 0 1px rgba(255, 255, 255, 1);
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
                        { [linkHomeStyle(props.isMobile)]: props.isHome },
                        { [linkHomeActiveStyle(props.isMobile)]: props.active && props.isHome },
                    )}
                >
                    <Highlight active={props.active} isHome={props.isHome} link={props.link} />
                </a> :
                <Link
                    to={props.to}
                    onClick={() => {
                        props.toggleSub('');
                        props.closeMobileMenu();
                    }}
                    className={cx(
                        linkStyle,
                        { [linkActiveStyle]: props.active && !props.isHome },
                        { [linkHomeStyle(props.isMobile)]: props.isHome },
                        { [linkHomeActiveStyle(props.isMobile)]: props.active && props.isHome },
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
                    onClick={() => {
                        props.toggleSub('');
                        props.closeMobileMenu();
                    }}
                    isHome={props.isHome}
                    isMobile={props.isMobile}
                />
            </Transition>
        }
    </li>
);

NavBarLink = styled(NavBarLink)`
    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${hiDPI(2)} {
        font-size: 16px;
    }

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        width: 100%;
    }

    font-size: 22px;
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
