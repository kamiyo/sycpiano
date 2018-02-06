import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { Link } from 'react-router-dom';

import { LogoInstance } from 'src/components/LogoSVG';

import { hiDPI } from 'polished';
import { logoBlue } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { navBarHeight } from 'src/styles/variables';

interface NavBarLogoProps {
    isHome: boolean;
}

const LogoText = styled('div')`
    ${noHighlight}
    display: inline-block;
    margin-left: 20px;
    vertical-align: middle;
    ${hiDPI(2)} {
        line-height: ${navBarHeight.hdpi}px;
    }
    line-height: ${navBarHeight.nonHdpi}px;

    span {
        vertical-align: -3px;
    }
`;

const logoStyle = css`
    ${hiDPI(2)} {
        font-size: 35px;
    }
    font-family: ${lato2};
    font-size: 40px;
    letter-spacing: 0.05em;
    height: 100%;
    color: ${logoBlue};
    fill: ${logoBlue};
    transition: all 0.3s;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    svg {
        ${hiDPI(2)} {
            width: 90px;
            height: 90px;
        }
        width: 150px;
        height: 150px;
        float: left;
    }
`;

const NavBarLogo: React.SFC<React.HTMLAttributes<HTMLDivElement> & NavBarLogoProps> = ({ isHome }) => (
    <Link to="/" className={cx(logoStyle, { [css`fill: white;`]: isHome })}>
        <LogoInstance />
        { !isHome &&
            <LogoText>
                <span>SEAN CHEN</span>
            </LogoText>
        }
    </Link>
);

export default NavBarLogo;
