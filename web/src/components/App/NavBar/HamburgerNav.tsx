import styled from '@emotion/styled';
import { TweenLite } from 'gsap';
import * as React from 'react';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

import { toggleExpanded } from 'src/components/App/NavBar/actions';
import HamburgerMenu from 'src/components/App/NavBar/HamburgerMenu';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import { NavBarLinksProps } from 'src/components/App/NavBar/types';

import { GlobalStateShape } from 'src/types';

interface HamburgerNavStateToProps {
    isExpanded: boolean;
}

interface HamburgerNavDispatchToProps {
    toggleExpanded: typeof toggleExpanded;
}

const MenuContainer = styled.div` margin: auto 0; `;

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
                layerColor={currentBasePath === '/' && !isExpanded ? 'white' : 'black'}
            />
            <Transition
                in={isExpanded}
                onEnter={(el) => TweenLite.to(el, 0.25, { autoAlpha: 1 })}
                onExit={(el) => TweenLite.to(el, 0.25, { autoAlpha: 0 })}
                timeout={250}
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
