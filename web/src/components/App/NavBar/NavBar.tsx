import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import ReactMedia from 'react-media';
import { connect } from 'react-redux';

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

const navBarStyle = css`
    height: ${navBarHeight.desktop}px;
    padding: 0 30px 0 0;

    ${/* sc-selector */ screenMandPortrait}, {
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
    background-color: white;
    transition: background-color 0.25s;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.3);
`;

const homeNavBarStyle = (isExpanded: boolean) => css`
    background-color: ${isExpanded ? 'white' : 'transparent'};
`;

const StyledNavBarLogo = styled(NavBarLogo) `
    display: inline-flex;
`;

const NavBar: React.SFC<NavBarProps & NavBarStateToProps> = ({
    currentBasePath,
    isExpanded,
    specificRouteName,
    className,
}) => {
    const isHome = currentBasePath === '/';
    return (
        <ReactMedia query={reactMediaMediumQuery}>
            {(matches: boolean) =>
                <div
                    className={cx(
                        className,
                        navBarStyle,
                        { [homeNavBarStyle(isExpanded)]: isHome },
                    )}
                >
                    <StyledNavBarLogo
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
                </div >
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
