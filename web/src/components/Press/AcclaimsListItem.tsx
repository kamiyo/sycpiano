import * as React from 'react';
import { css } from 'react-emotion';

import { AcclaimItemShape } from 'src/components/Press/types';
import { lato1, lato2 } from 'src/styles/fonts';

const itemStyle = css`
    &:first-child {
        padding-top: 40px;
    }
    padding: 20px 0;

`;

const itemContainerStyle = css`
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
`;

const quoteStyle = css`
    font-family: ${lato2};
    margin-bottom: 20px;
    text-align: center;
    line-height: 1.5em;
`;

const authorStyle = css`
    font-family: ${lato1};
    text-align: center;
`;

const AcclaimsListItem: React.SFC<{ acclaim: AcclaimItemShape; style: React.CSSProperties }> = ({ acclaim, style }) => (
    <div className={itemStyle} style={style}>
        <div className={itemContainerStyle}>
            <div className={quoteStyle}>
                {!!acclaim.short ? acclaim.short : acclaim.quote}
            </div>
            <div className={authorStyle}>
                {'–\t'}{acclaim.author}
            </div>
        </div>
    </div>
);

export default AcclaimsListItem;
