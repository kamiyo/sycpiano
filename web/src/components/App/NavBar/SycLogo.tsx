import { hiDPI } from 'polished';
import styled from 'react-emotion';

import { LogoInstance } from 'src/components/LogoSVG';

export const SycLogo = styled(LogoInstance)`
    /* stylelint-disable-next-line */
    ${hiDPI(2)} {
        width: 90px;
        height: 90px;
    }

    width: 150px;
    height: 150px;
    float: left;
`;
