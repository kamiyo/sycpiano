import styled from '@emotion/styled';

import { LogoInstance } from 'src/components/LogoSVG';
import { screenMorPortrait } from 'src/styles/screens';

export const SycLogo = styled(LogoInstance)({
    width: 150,
    height: 150,
    float: 'left',
    flex: '0 0 auto',
    WebkitTapHighlightColor: 'transparent',
    [screenMorPortrait]: {
        width: 120,
        height: 120,
    },
});
