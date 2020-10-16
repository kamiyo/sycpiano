import { ReferenceObject } from 'popper.js';
import * as React from 'react';
import ReactMedia from 'react-media';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import CartButton from 'src/components/App/NavBar/CartButton';
import HamburgerNav from 'src/components/App/NavBar/HamburgerNav';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';

import { reactMediaMediumQuery, screenMandPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

interface NavBarProps {
    readonly currentBasePath: string;
    readonly className?: string;
    readonly specificRouteName: string;
    setReferenceElement: React.Dispatch<React.SetStateAction<ReferenceObject>>;
}

const StyledNavBar = styled.div<{ isHome: boolean; isExpanded: boolean }>`
    visibility: hidden;
    height: ${navBarHeight.desktop}px;
    padding: 0 30px 0 0;

    ${screenMandPortrait} {
        height: ${navBarHeight.mobile}px;
        padding-right: 15px;
    }

    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5000;
    background-color: ${props => (props.isExpanded || !props.isHome) ? 'white' : 'transparent'};
    transition: background-color 0.25s;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.3);
`;

const StyledNavAndCart = styled.div<{}>({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
});

const NavBar = ({
        currentBasePath,
        specificRouteName,
        setReferenceElement,
}: NavBarProps) => {
    const isExpanded = useSelector(({ navbar }: GlobalStateShape) => navbar.isExpanded);
    const cartItems = useSelector(({ cart }: GlobalStateShape) => cart.items);

    const isHome = currentBasePath === '/';
    return (
        <ReactMedia query={reactMediaMediumQuery}>
            {(mobile: boolean) => (
                <StyledNavBar
                    isHome={isHome}
                    isExpanded={isExpanded}
                >
                    <NavBarLogo
                        isHome={isHome}
                        isExpanded={isExpanded}
                        specificRouteName={specificRouteName}
                    />
                    {mobile ?
                        (
                            <>
                                {cartItems.length !== 0 &&
                                    <CartButton
                                        isHome={isHome}
                                        setReferenceElement={setReferenceElement}
                                    />
                                }
                                <HamburgerNav
                                    currentBasePath={currentBasePath}
                                    isMobile={true}
                                    key="hamburger-nav"
                                />
                            </>
                        ) : (
                            <StyledNavAndCart>
                                <NavBarLinks
                                    currentBasePath={currentBasePath}
                                    isMobile={false}
                                />
                                {cartItems.length !== 0 &&
                                    <CartButton
                                        isHome={isHome}
                                        setReferenceElement={setReferenceElement}
                                    />
                                }
                            </StyledNavAndCart>
                        )
                    }
                </StyledNavBar >
            )}
        </ReactMedia>
    );
};

export default NavBar;
