// Various CSS emotion mixins

import { css, SerializedStyles } from '@emotion/react';
import darken from 'polished/lib/color/darken';

import { screenMorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

export const pushedHelper = (marginTop: number): { height: string; marginTop: string } => ({
    height: `calc(100% - ${marginTop}px)`,
    marginTop: `${marginTop}px`,
});

export const pushedDesktop = css(pushedHelper(navBarHeight.desktop));
export const pushedMobile = css(pushedHelper(navBarHeight.mobile));

export const pushed = css({
    ...pushedHelper(navBarHeight.desktop),
    [screenMorPortrait]: {
        ...pushedHelper(navBarHeight.mobile),
    },
});

export const link = (colorString: string, hoverDelta = 0.2): SerializedStyles => css`
    color: ${colorString};
    text-decoration: none;
    cursor: pointer;
    transition: color 0.5s;

    :hover {
        color: ${darken(hoverDelta, colorString)};
    }
`;

export const container = css`
    position: absolute;
    top: 0;
    left: 0;
`;

export const noHighlight = css({
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
})
