import styled from '@emotion/styled';
import { gsap } from 'gsap';
import * as React from 'react';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

import { toggleExpanded } from 'src/components/App/NavBar/actions';
import HamburgerMenu from 'src/components/App/NavBar/HamburgerMenu';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import { NavBarLinksProps } from 'src/components/App/NavBar/types';

import { GlobalStateShape } from 'src/types';
import { logoBlue } from 'src/styles/colors';

interface HamburgerNavStateToProps {
    isExpanded: boolean;
}

interface HamburgerNavDispatchToProps {
    toggleExpanded: typeof toggleExpanded;
}

const MenuContainer = styled.div` margin: auto 0; `;

const onEnter = (isHome: boolean) => (el: HTMLDivElement) => {
    !isHome && gsap.to(el, { autoAlpha: 1, duration: 0.3 });
    gsap.fromTo('.navlink-entry', { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.3 });
};

const onExit = (isHome: boolean) => (el: HTMLDivElement) => {
    gsap.to('.navlink-entry', { autoAlpha: 0, x: 80, stagger: 0.05, duration: 0.25, });
    !isHome && gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.15 });
}

const HamburgerNav = React.memo(function HamburgerNav({
    isExpanded,
    toggleExpanded: toggleExpand,
    currentBasePath,
    isMobile,
}: NavBarLinksProps & HamburgerNavDispatchToProps & HamburgerNavStateToProps) {

    return (
        <MenuContainer>
            <HamburgerMenu
                isExpanded={isExpanded}
                onClick={() => toggleExpand()}
                layerColor={currentBasePath === '/' ? 'white' : logoBlue}
            />
            <Transition<undefined>
                in={isExpanded}
                onEnter={onEnter(currentBasePath === '/')}
                onExit={onExit(currentBasePath === '/')}
                timeout={1000}
                unmountOnExit={true}
                mountOnEnter={true}
            >
                <NavBarLinks
                    currentBasePath={currentBasePath}
                    isMobile={isMobile}
                />
            </Transition>
        </MenuContainer>
    );
});

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    isExpanded: navbar.isExpanded,
});

export default connect<HamburgerNavStateToProps, HamburgerNavDispatchToProps, NavBarLinksProps>(
    mapStateToProps,
    { toggleExpanded },
)(HamburgerNav);
