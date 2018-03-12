import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import ReactMedia from 'react-media';
import { Link } from 'react-router-dom';

import { SycLogo } from 'src/components/App/NavBar/SycLogo';

import { logoBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { reactMediaMobileQuery, screenPortrait, screenXS } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

const navBarFontSizeREM = 2.5;

interface NavBarLogoProps {
    isHome: boolean;
    isExpanded: boolean;
    specificRouteName: string;
}

const LogoText = styled<{ isMobile: boolean }, 'div'>('div')`
    ${noHighlight}
    display: inline-block;
    margin-left: ${({ isMobile }) => isMobile ? 0 : '20px'};
    vertical-align: middle;
    line-height: ${navBarHeight.nonHdpi}px;

    span {
        vertical-align: -3px;

        /* stylelint-disable-next-line */
        ${screenPortrait}, ${screenXS} {
            vertical-align: initial;
            margin-left: 10px;
        }
    }
`;

const logoStyle = css`
    font-family: ${lato2};
    font-size: ${navBarFontSizeREM}rem;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        font-size: ${navBarFontSizeREM * 0.6}rem;
    }

    letter-spacing: 0.05em;
    height: 100%;
    color: ${logoBlue};
    fill: ${logoBlue};
    transition: all 0.3s;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
`;

const NavBarLogo: React.SFC<React.HTMLAttributes<HTMLDivElement> & NavBarLogoProps> = ({
    isHome,
    isExpanded,
    specificRouteName,
}) => (
    <Link to="/" className={cx(logoStyle, { [css` fill: white; `]: isHome && !isExpanded })}>
        <ReactMedia query={reactMediaMobileQuery}>
            {(matches: boolean) => matches
                ? (
                    <>
                        <SycLogo />
                        <LogoText isMobile={matches}>
                            <span>{isHome ? '' : specificRouteName}</span>
                        </LogoText>
                    </>
                )
                : (
                    <>
                        <SycLogo />
                        {!isHome &&
                            <LogoText isMobile={matches}>
                                <span>SEAN CHEN</span>
                            </LogoText>
                        }
                    </>
                )
            }
        </ReactMedia>
    </Link>
);

export default NavBarLogo;
