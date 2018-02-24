import { hiDPI } from 'polished';
import styled from 'react-emotion';

import { LogoInstance } from 'src/components/LogoSVG';
import { screenPortrait, screenXS } from 'src/styles/screens';

export const SycLogo = styled(LogoInstance)`
    /* stylelint-disable-next-line rule-empty-line-before, declaration-block-semicolon-newline-after, no-duplicate-selectors */
    ${hiDPI(2)} {
        width: 90px;
        height: 90px;
    }

    width: 150px;
    height: 150px;
    float: left;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        margin-top: -20px;
    }
`;
