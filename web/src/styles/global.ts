import { css } from '@emotion/react';

import { logoBlue } from 'src/styles/colors';
import { link } from 'src/styles/mixins';

// font face helper
const loadFont = (fileName: string, fontFamily: string) => (
    `@font-face {
    	font-family: ${fontFamily};
        src: url('/static/fonts/${fileName}.eot'); /* IE9 Compat Modes */
        src: url('/static/fonts/${fileName}.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
             url('/static/fonts/${fileName}.woff2') format('woff2'), /* Modern Browsers */
             url('/static/fonts/${fileName}.woff') format('woff'), /* Modern Browsers */
             url('/static/fonts/${fileName}.ttf') format('truetype'),
             url('/static/fonts/${fileName}.svg#${fontFamily}') format('svg');
        font-weight: normal;
        font-style: normal;
    }`
);

// global CSS to be injected by <Global> component in App.tsx
export const globalCss = css`
    * {
        box-sizing: border-box;
        outline: none;
    }

    html {
        height: 100%;
        overflow: hidden;
    }

    body {
        margin: 0;
        height: 100%;
        background-color: #fff;
    }

    #hero-container {
        height: 100%;
    }

    a {
        ${link(logoBlue)}
    }

    ${loadFont('lato-hairline', 'LatoHairline')}
    ${loadFont('lato-thin', 'LatoThin')}
    ${loadFont('lato-light', 'LatoLight')}
    ${loadFont('lato-black', 'LatoBlack')}
    ${loadFont('lato-medium', 'LatoMedium')}
    ${loadFont('lato-bold', 'LatoBold')}
    ${loadFont('lato-semibold', 'LatoSemibold')}
    ${loadFont('lato-regular', 'LatoRegular')}
    ${loadFont('lato-heavy', 'LatoHeavy')}
    ${loadFont('lato-hairlineitalic', 'LatoHairlineItalic')}
    ${loadFont('lato-thinitalic', 'LatoThinItalic')}
    ${loadFont('lato-lightitalic', 'LatoLightItalic')}
    ${loadFont('lato-blackitalic', 'LatoBlackItalic')}
    ${loadFont('lato-mediumitalic', 'LatoMediumItalic')}
    ${loadFont('lato-bolditalic', 'LatoBoldItalic')}
    ${loadFont('lato-semibolditalic', 'LatoSemiboldItalic')}
    ${loadFont('lato-italic', 'LatoItalic')}
    ${loadFont('lato-heavyitalic', 'LatoHeavyItalic')}
`;
