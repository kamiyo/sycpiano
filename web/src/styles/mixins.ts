import { css } from 'emotion';
import { hiDPI } from 'polished';

import { navBarHeight } from 'src/styles/variables';

const pushedHelper = (marginTop: string) => ({
    height: `calc(100% - ${marginTop})`,
    marginTop,
});

export const pushed = css({
    ...pushedHelper(navBarHeight.nonHdpi),
    [hiDPI(2)]: pushedHelper(navBarHeight.hdpi),
});

export const link = (color: string, hoverDelta = '#444') => css`
    color: ${color};
    text-decoration: none;
    cursor: pointer;
    transition: color: 0.5s;

    &:hover {
        color: calc(${color} - ${hoverDelta});
    }
`;

export const container = css`
    position: absolute;
    top: 0;
    left: 0;
`;

export const noHighlight = css`
    user-select: none;
`;
