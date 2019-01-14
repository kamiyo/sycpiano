import * as React from 'react';
import ReactMedia from 'react-media';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';

import { SycLogo } from 'src/components/App/NavBar/SycLogo';

import { logoBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { reactMediaMediumQuery, reactMediaMobileQuery, screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

const navBarFontSizeREM = 2.5;

interface NavBarLogoProps {
    isHome: boolean;
    isExpanded: boolean;
    specificRouteName: string;
}

const LogoText = styled.div`
    ${noHighlight}
    display: inline-block;
    margin-left: 20px;
    vertical-align: middle;
    line-height: ${navBarHeight.desktop}px;
    height: ${navBarHeight.desktop}px;
    text-transform: uppercase;

    ${screenXSorPortrait} {
        margin-left: 0;
        line-height: ${navBarHeight.mobile}px;
        height: ${navBarHeight.mobile}px;
    }
`;

const StyledLink = styled(Link, {
    shouldForwardProp: prop => prop !== 'isHome' && prop !== 'isExpanded',
}) <{ isHome: boolean; isExpanded: boolean }>`
    display: inline-flex;
    font-family: ${lato2};
    font-size: ${navBarFontSizeREM}rem;
    letter-spacing: 0.05em;
    height: 100%;
    color: ${logoBlue};
    fill: ${props => (props.isHome && !props.isExpanded) ? 'white' : logoBlue};
    transition: all 0.3s;
    overflow: hidden;
    cursor: pointer;
    align-items: center;
    -webkit-tap-highlight-color: transparent;

    ${screenXSorPortrait} {
        font-size: ${navBarFontSizeREM * 0.75}rem;
    }
`;

const SeanChenText = styled.span` vertical-align: middle; `;

const RouteText = styled.span`
    font-size: ${navBarFontSizeREM * 0.8}rem;
    vertical-align: middle;
    margin-left: 10px;
`;

const NavBarLogo: React.FC<React.HTMLAttributes<HTMLDivElement> & NavBarLogoProps> = ({
    isHome,
    isExpanded,
    specificRouteName,
}) => {
    const displayName = specificRouteName && specificRouteName.replace('discography', 'discog').replace('biography', 'bio');
    return (
        <StyledLink to="/" isHome={isHome} isExpanded={isExpanded}>
            <ReactMedia query={reactMediaMobileQuery}>
                {(xs: boolean) =>
                    <ReactMedia query={reactMediaMediumQuery}>
                        {(medium: boolean) =>
                            <React.Fragment>
                                <SycLogo />
                                <LogoText>
                                    {!isHome && !xs && <SeanChenText>{'SEAN CHEN' + (medium ? ' |' : '')}</SeanChenText>}
                                    {!isHome && (xs || medium) && <RouteText>{displayName}</RouteText>}
                                </LogoText>
                            </React.Fragment>
                        }
                    </ReactMedia>
                }
            </ReactMedia>
        </StyledLink>
    );
};

export default NavBarLogo;
