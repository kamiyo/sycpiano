import { injectGlobal } from 'emotion';

import { logoBlue } from 'src/styles/colors';
import { link } from 'src/styles/mixins';

/* tslint:disable:no-unused-expression */
injectGlobal`
* {
    box-sizing: border-box;
    outline: none;
}

html {
    height: 100%;
    overflow: hidden;
}

body {
    margin: 0px;
    height: 100%;
    background-color: #FFF;
}

#hero-container {
    height: 100%;
}

a {
    ${link(logoBlue)}
}
`;
/* tslint:enable:no-unused-expression */
