import * as React from 'react';
import { connect } from 'react-redux';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import mix from 'polished/lib/color/mix';
import { Link, LinkProps } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import { gsap } from 'gsap';

import { toggleExpanded, toggleSubNav } from 'src/components/App/NavBar/actions';
import SubNav from 'src/components/App/NavBar/SubNav/SubNav';
import { LinkShape } from 'src/components/App/NavBar/types';
import { GlobalStateShape } from 'src/types';

import { lightBlue, logoBlue, navFontColor } from 'src/styles/colors';
import { lato2, lato3 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenMorPortrait } from 'src/styles/screens';
import { navBarHeight, navBarMarginTop } from 'src/styles/variables';

interface HighlightProps {
    readonly active: boolean;
    readonly expanded?: boolean;
    readonly isMobile: boolean;
    readonly isHome: boolean;
    readonly link: LinkShape;
}

const HighlightDiv = styled.div<{ active: boolean; isHome: boolean }>`
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0;
    margin-top: ${navBarMarginTop}px;
    opacity: ${props => props.active ? 1 : 0};
    height: 5px;
    z-index: -1;
    background-color: ${props => props.isHome ? 'white' : lightBlue};
`;

const MobileHighlight = styled.div<{ active: boolean; isHome: boolean }>({
    flex: '0 0 5px',
    // display: 'inline-block',
}, ({ active, isHome }) => ({
    opacity: active ? 1 : 0,
    backgroundColor: isHome ? 'white' : lightBlue,
}));

const HyperlinkText = styled.div`
    height: ${navBarHeight.desktop - navBarMarginTop}px;
    padding: 20px 10px 0 10px;
    margin-top: ${navBarMarginTop}px;

    ${screenMorPortrait} {
        margin-top: unset;
        height: unset;
        line-height: 1.5rem;
        padding: 1rem 0.8rem;
        flex: 0 0 auto;
    }
`;

// const CollapseIcon = styled.div<{ expanded: boolean }>({
//     display: 'inline-block',
//     padding: '0.5rem',
// }, (props) => ({
//     opacity: props.expanded ? 1 : 0,
// }));

const Highlight = ({ active, isHome, link, isMobile }: HighlightProps) => (
    <React.Fragment>
        {!isMobile && <HighlightDiv active={active} isHome={isHome} />}
        <HyperlinkText>{link.name}</HyperlinkText>
        {isMobile && <MobileHighlight active={active} isHome={isHome} />}
    </React.Fragment>
);

interface NavBarLinkOwnProps {
    readonly className?: string;
    readonly active: boolean;
    readonly isHome: boolean;
    readonly link: LinkShape;
    readonly subNavLinks: LinkShape[];
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

type NavBarLinkProps = NavBarLinkOwnProps & NavBarLinkDispatchToProps & NavBarLinkStateToProps;

const linkStyle = css`
    ${noHighlight}
    color: ${navFontColor};
    text-decoration: none;
    cursor: pointer;
    transition: all 0.5s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        color: ${mix(0.5, logoBlue, '#444')};
    }
`;

const linkActiveStyle = css`
    color: ${lightBlue};
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

const mobileLinkStyle = css({
    display: 'flex',
    justifyContent: 'flex-end',
});

const SubNavContainer = styled.div`
    visibility: hidden;

    ${screenMorPortrait} {
        visibility: unset;
        height: 0;
        overflow: hidden;
        display: flex;
        margin-right: 1rem;
    }
`;

const SubNavLine = styled.div<{ isHome: boolean }>({
    flex: '0 0 1px',
}, ({ isHome }) => ({
    backgroundColor: isHome ? 'white' : navFontColor,
}));

const enterAnimation = (el: HTMLElement, isAppearing: boolean, isMobile: boolean, path: string) => {
    if (isMobile) {
        if (isAppearing) {
            el.style.height = 'auto';
        } else {
            gsap.set(el, { height: 'auto' });
            gsap.from(el, 0.25, { height: 0 });
            gsap.fromTo(`.${path}`, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.3 });

        }
    } else {
        gsap.to(el, 0.25, { autoAlpha: 1 });
    }
};

const exitAnimation = (el: HTMLElement, isMobile: boolean, path: string) => {
    if (isMobile) {
        gsap.to(el, 0.25, { height: 0 })
        gsap.to(`.${path}`, { autoAlpha: 0, x: 80, stagger: 0.05, duration: 0.25, });
    } else {
        gsap.to(el, 0.25, { autoAlpha: 0 });
    }
};

const StyledLi = styled.li<{ isHome: boolean }>`
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

    ${screenMorPortrait} {
        font-family: ${({ isHome }) => isHome ? lato2 : lato3};
        text-align: right;
        visibility: hidden;
        opacity: 0;
    }
`;

const subsAreEqual = (prev: NavBarLinkProps, next: NavBarLinkProps) => {
    const { showSubs: prevShowSubs, ...prevWithoutShowSubs } = prev;
    const { showSubs: nextShowSubs, ...nextWithoutShowSubs } = next;
    // Object.keys(prevWithoutShowSubs).forEach((key: keyof typeof prevWithoutShowSubs) => {
    //     if (prevWithoutShowSubs[key] !== nextWithoutShowSubs[key]) {
    //         return false;
    //     }
    // });
    const subDiffPrev = prevShowSubs.filter(x => !nextShowSubs.includes(x));
    const subDiffNext = nextShowSubs.filter(x => !prevShowSubs.includes(x));
    if (subDiffPrev.length || subDiffNext.length) {
        return false;
    }
    return true;
};

interface AorLink {
    href?: string;
    onClick?: () => void;
    to?: string;
}

const NavBarLink = ({
    active,
    isHome,
    isMobile,
    isExpanded,
    link,
    subNavLinks,
    showSubs,
    toggleExpanded: expand,
    toggleSubNav: toggle,
}: NavBarLinkProps) => {
    // css attr is common
    const attr: AorLink = {};
    const style = css(
        linkStyle,
        active && !isHome && linkActiveStyle,
        isHome && linkHomeStyle,
        active && isHome && !isMobile && linkHomeActiveStyle,
        isMobile && mobileLinkStyle,
    );
    // add attr's conditionally
    if (link.name === 'blog') {
        attr.href = link.path;
    } else if (subNavLinks) {
        attr.onClick = () => {
            toggle(link.name);
        };
    } else {
        attr.to = link.path;
        attr.onClick = () => {
            toggleSubNav('');
            isMobile && expand(false);
        };
    }
    const HighlightComponent = <Highlight active={active} isHome={isHome} link={link} isMobile={isMobile} expanded={showSubs.includes(link.name)} />;
    return (
        <StyledLi className="navlink-entry" isHome={isHome}>
            {(subNavLinks || link.name === 'blog') ? (
                <a css={style} {...attr}>
                    {HighlightComponent}
                </a>
            ) : (
                    <Link css={style} {...(attr as LinkProps)}>
                        {HighlightComponent}
                    </Link>
                )}
            {subNavLinks && (
                <Transition<undefined>
                    in={showSubs.includes(link.name)}
                    onEnter={(el, isAppearing) => enterAnimation(el, isAppearing, isMobile, link.name)}
                    onExit={(el) => exitAnimation(el, isMobile, link.name)}
                    timeout={250}
                    appear={true}
                >
                    <SubNavContainer>
                        <SubNav
                            basePath={link}
                            links={subNavLinks}
                            onClick={() => {
                                toggle('');
                                isMobile && expand(false);
                            }}
                            isHome={isHome}
                            isMobile={isMobile}
                        />
                        {isMobile && <SubNavLine isHome={isHome}/>}
                    </SubNavContainer>
                </Transition>
            )}
        </StyledLi>
    );
};

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    showSubs: navbar.showSubs,
    isExpanded: navbar.isExpanded,
});

export default connect<NavBarLinkStateToProps, NavBarLinkDispatchToProps, NavBarLinkOwnProps>(
    mapStateToProps,
    {
        toggleSubNav,
        toggleExpanded,
    },
// )(React.memo(NavBarLink, subsAreEqual));
)(NavBarLink);
