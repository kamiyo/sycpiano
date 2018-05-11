import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { connect } from 'react-redux';

import mix from 'polished/lib/color/mix';
import { Link, LinkProps } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import { toggleExpanded, toggleSubNav } from 'src/components/App/NavBar/actions';
import SubNav from 'src/components/App/NavBar/SubNav/SubNav';
import { GlobalStateShape } from 'src/types';

import { lightBlue, logoBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenM, screenMorPortrait } from 'src/styles/screens';
import { navBarHeight, navBarMarginTop } from 'src/styles/variables';

interface HighlightProps {
    readonly active: boolean;
    readonly isMobile: boolean;
    readonly isHome: boolean;
    readonly link: string;
}

const getHighlightDefaultStyle = css`
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0;
    margin-top: ${navBarMarginTop}px;
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

const HyperlinkText = styled('div') `
    height: ${navBarHeight.desktop - navBarMarginTop}px;
    padding: 20px 10px 0 10px;
    margin-top: ${navBarMarginTop}px;

    ${/* sc-selector */ screenMorPortrait} {
        margin-top: unset;
        height: unset;
        line-height: 1.5rem;
    }

    ${/* sc-selector */ screenM} {
        padding: 1.5rem 0;
    }
`;

const Highlight: React.SFC<HighlightProps> = ({ active, isHome, link, isMobile }) => (
    <>
        {!isMobile && <div
            className={cx(
                getHighlightDefaultStyle,
                { [highlightActiveStyle]: active },
                { [highlightHomeStyle]: isHome },
                { [highlightHomeActivestyle]: active && isHome },
            )}
        />}
        <HyperlinkText>{link}</HyperlinkText>
    </>
);

interface NavBarLinkProps {
    readonly className?: string;
    readonly active: boolean;
    readonly isHome: boolean;
    readonly link: string;
    readonly subNavLinks: string[];
    readonly to: string;
    readonly isMobile: boolean;
}

interface NavBarLinkStateToProps {
    readonly isExpanded: boolean;
    readonly showSubs: string[];
}

interface NavBarLinkDispatchToProps {
    readonly toggleSubNav: typeof toggleSubNav;
    readonly toggleExpanded: typeof toggleExpanded;
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

const getSubNavContainer = css`
    visibility: hidden;

    ${/* sc-selector */ screenMorPortrait} {
        visibility: unset;
        height: 0;
        overflow: hidden;
    }
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

let NavBarLink: React.SFC<NavBarLinkProps & NavBarLinkDispatchToProps & NavBarLinkStateToProps> = (props) => {
    // choose type of link based on whether there are subnavs, and whether it is blog (can extend later to maybe a isExternal prop)
    const LLink = (props.subNavLinks || props.link === 'blog') ? 'a' : Link;
    // className attr is common
    const attr: React.LinkHTMLAttributes<HTMLElement> | LinkProps = {
        className: cx(
            linkStyle,
            { [linkActiveStyle]: props.active && !props.isHome && !props.isMobile },
            { [linkHomeStyle]: props.isHome && !props.isExpanded },
            { [linkHomeActiveStyle]: props.active && props.isHome && !props.isMobile },
        ),
    };
    // add attr's conditionally
    if (props.link === 'blog') {
        attr.href = props.to;
    } else if (props.subNavLinks) {
        attr.onClick = () => props.toggleSubNav(props.link);
    } else {
        (attr as LinkProps).to = props.to;
        attr.onClick = () => {
            props.toggleSubNav('');
            props.isMobile && props.toggleExpanded(false);
        };
    }
    return (
        <li className={props.className}>
            <LLink {...attr}>
                <Highlight active={props.active} isHome={props.isHome} link={props.link} isMobile={props.isMobile} />
            </LLink>
            {
                props.subNavLinks &&
                <Transition
                    in={props.showSubs.includes(props.link)}
                    onEnter={(el, isAppearing) => enterAnimation(el, isAppearing, props.isMobile)}
                    onExit={(el) => exitAnimation(el, props.isMobile)}
                    timeout={250}
                    appear={true}
                >
                    <div className={getSubNavContainer}>
                        <SubNav
                            basePath={props.to}
                            links={props.subNavLinks}
                            onClick={() => {
                                props.toggleSubNav('');
                                props.isMobile && props.toggleExpanded(false);
                            }}
                            isHome={props.isHome}
                            isMobile={props.isMobile}
                        />
                    </div>
                </Transition>
            }
        </li>
    );
};

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

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    showSubs: navbar.showSubs,
    isExpanded: navbar.isExpanded,
});

export default connect<NavBarLinkStateToProps, NavBarLinkDispatchToProps>(
    mapStateToProps,
    {
        toggleSubNav,
        toggleExpanded,
    },
)(NavBarLink);
