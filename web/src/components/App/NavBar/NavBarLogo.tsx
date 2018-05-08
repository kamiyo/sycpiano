import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import ReactMedia from 'react-media';
import { Link } from 'react-router-dom';

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

const LogoText = styled<{ isMobile: boolean }, 'div'>('div') `
    ${noHighlight}
    display: inline-block;
    margin-left: 20px;
    vertical-align: middle;
    line-height: ${navBarHeight.desktop}px;
    height: ${navBarHeight.desktop}px;

    ${/* sc-selector */ screenXSorPortrait} {
        margin-left: 0;
        line-height: ${navBarHeight.mobile}px;
        height: ${navBarHeight.mobile}px;
    }
`;

const logoStyle = css`
    font-family: ${lato2};
    font-size: ${navBarFontSizeREM}rem;
    letter-spacing: 0.05em;
    height: 100%;
    color: ${logoBlue};
    fill: ${logoBlue};
    transition: all 0.3s;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    ${/* sc-selector */ screenXSorPortrait} {
        font-size: ${navBarFontSizeREM * 0.75}rem;
    }
`;

const SeanChenText = styled('span')`
    vertical-align: middle;
`;

const RouteText = styled('span')`
    font-size: ${navBarFontSizeREM * 0.8}rem;
    vertical-align: middle;
    margin-left: 10px;
`;

const NavBarLogo: React.SFC<React.HTMLAttributes<HTMLDivElement> & NavBarLogoProps> = ({
    isHome,
    isExpanded,
    specificRouteName,
}) => (
        <Link to="/" className={cx(logoStyle, { [css` fill: white; `]: isHome && !isExpanded })}>
            <ReactMedia query={reactMediaMobileQuery}>
                {(xs: boolean) =>
                    <ReactMedia query={reactMediaMediumQuery}>
                        {(medium: boolean) =>
                            <>
                                <SycLogo />
                                <LogoText isMobile={xs}>
                                    {!isHome && !xs && <SeanChenText>{'SEAN CHEN' + (medium ? ' |' : '')}</SeanChenText>}
                                    {!isHome && (xs || medium) && <RouteText>{specificRouteName}</RouteText>}
                                </LogoText>
                            </>
                        }
                    </ReactMedia>
                }
            </ReactMedia>
        </Link>
    );

export default NavBarLogo;
