import * as React from 'react';
import ReactMedia from 'react-media';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import HamburgerNav from 'src/components/App/NavBar/HamburgerNav';
import { links } from 'src/components/App/NavBar/links';
import NavBarLinks from 'src/components/App/NavBar/NavBarLinks';
import NavBarLogo from 'src/components/App/NavBar/NavBarLogo';

import { reactMediaMediumQuery, screenMandPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

interface NavBarProps {
    readonly currentBasePath: string;
    readonly className?: string;
    readonly specificRouteName: string;
}

interface NavBarStateToProps {
    readonly isExpanded?: boolean;
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

const NavBar: React.FC<NavBarProps & NavBarStateToProps> = ({
    currentBasePath,
    isExpanded,
    specificRouteName,
}) => {
    const isHome = currentBasePath === '/';
    return (
        <ReactMedia query={reactMediaMediumQuery}>
            {(matches: boolean) =>
                <StyledNavBar
                    isHome={isHome}
                    isExpanded={isExpanded}
                >
                    <NavBarLogo
                        isHome={isHome}
                        isExpanded={isExpanded}
                        specificRouteName={specificRouteName}
                    />
                    {matches ?
                        <HamburgerNav
                            links={links}
                            currentBasePath={currentBasePath}
                            isMobile={true}
                        /> :
                        <NavBarLinks
                            links={links}
                            currentBasePath={currentBasePath}
                            isMobile={false}
                        />
                    }
                </StyledNavBar >
            }
        </ReactMedia>
    );
};

const mapStateToProps = ({ navbar }: GlobalStateShape) => ({
    isExpanded: navbar.isExpanded,
    showSubs: navbar.showSubs,
});

const connectedNavBar = connect<NavBarStateToProps, {}, NavBarProps>(
    mapStateToProps,
)(NavBar);

export default connectedNavBar;
