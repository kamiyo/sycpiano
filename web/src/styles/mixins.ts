import { css } from 'emotion';
import { hiDPI } from 'polished';

import { navBarHeight } from 'src/styles/variables';

const pushedHelper = (marginTop: string) => ({
    height: `calc(100% - ${marginTop})`,
    marginTop,
});

export const pushed = () => css({
    ...pushedHelper(navBarHeight.nonHdpi),
    [hiDPI(2)]: pushedHelper(navBarHeight.hdpi),
});
