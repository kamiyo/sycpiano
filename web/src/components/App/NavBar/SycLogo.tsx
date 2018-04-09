import styled from 'react-emotion';

import { LogoInstance } from 'src/components/LogoSVG';
import { screenXSorPortrait } from 'src/styles/screens';

export const SycLogo = styled(LogoInstance)`
    width: 150px;
    height: 150px;
    float: left;

    ${/* sc-selector */ screenXSorPortrait} {
        width: 120px;
        height: 120px;
    }
`;
