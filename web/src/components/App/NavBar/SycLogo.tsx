import styled from '@emotion/styled';

import { LogoInstance } from 'src/components/LogoSVG';
import { screenXSorPortrait } from 'src/styles/screens';

export const SycLogo = styled(LogoInstance)({
    width: 150,
    height: 150,
    float: 'left',
    WebkitTapHighlightColor: 'transparent',
    [screenXSorPortrait]: {
        width: 120,
        height: 120,
    },
});
