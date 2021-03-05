import styled from '@emotion/styled';
import { gsap } from 'gsap';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transition } from 'react-transition-group';

import { toggleExpanded } from 'src/components/App/NavBar/actions';
import HamburgerMenu from 'src/components/App/NavBar/HamburgerMenu';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import { NavBarLinksProps } from 'src/components/App/NavBar/types';

import { GlobalStateShape } from 'src/types';
import { logoBlue } from 'src/styles/colors';

const MenuContainer = styled.div` margin: auto 0; `;

const onEnter = (el: HTMLDivElement) => {
    gsap.to(el, { autoAlpha: 1, duration: 0.3 });
    gsap.fromTo('.navlink-entry', { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.3 });
};

const onExit = (el: HTMLDivElement) => {
    gsap.to('.navlink-entry', { autoAlpha: 0, x: 80, stagger: 0.05, duration: 0.25, });
    gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.15 });
}

const HamburgerNav: React.FC<NavBarLinksProps> = ({ currentBasePath, isMobile }) => {
    const isExpanded = useSelector(({ navbar }: GlobalStateShape) => navbar.isExpanded);
    const dispatch = useDispatch();

    return (
        <MenuContainer>
            <HamburgerMenu
                isExpanded={isExpanded}
                onClick={() => dispatch(toggleExpanded())}
                layerColor={currentBasePath === '/' ? 'white' : logoBlue}
            />
            <Transition<undefined>
                in={isExpanded}
                onEnter={onEnter}
                onExit={onExit}
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
};

export default HamburgerNav;