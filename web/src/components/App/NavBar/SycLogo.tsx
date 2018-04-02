import styled from 'react-emotion';

import { LogoInstance } from 'src/components/LogoSVG';
import { screenXS } from 'src/styles/screens';

export const SycLogo = styled(LogoInstance)`
    width: 150px;
    height: 150px;
    float: left;

    ${screenXS} {
        width: 120px;
        height: 120px;
    }
`;
