import { css } from 'emotion';
import { hiDPI } from 'polished';

import color from 'color';

import { navBarHeight } from 'src/styles/variables';

const pushedHelper = (marginTop: number) => ({
    height: `calc(100% - ${marginTop}px)`,
    marginTop,
});

export const pushed = css({
    ...pushedHelper(navBarHeight.nonHdpi),
    [hiDPI(2)]: pushedHelper(navBarHeight.hdpi),
});

export const link = (colorString: string, hoverDelta = 0.2) => css`
    color: ${colorString};
    text-decoration: none;
    cursor: pointer;
    transition: color 0.5s;

    &:hover {
        color: ${color(colorString).darken(hoverDelta).string()};
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
