import * as React from 'react';
import styled, { css, cx } from 'react-emotion';

import { AcclaimItemShape } from 'src/components/Press/types';
import { lato1, lato2 } from 'src/styles/fonts';
import { screenXS } from 'src/styles/screens';

const AcclaimContainer = styled('div')({
    margin: '0 auto',
    maxWidth: '600px',
    [screenXS]: {
        fontSize: '20px',
        padding: '0 15px',
    },
});

interface QuoteProps {
    short: string;
    quote: string;
    className?: string;
}

let Quote: React.SFC<QuoteProps> = (props) => (
    <div className={props.className}>
        {props.short ? props.short : props.quote}
    </div>
);

Quote = styled(Quote)`
    font-family: ${lato2};
    margin-bottom: 20px;
    text-align: center;
    line-height: 1.5em;
`;

interface AuthorProps { author: string; className?: string; }

let Author: React.SFC<AuthorProps> = (props) => (
    <div className={props.className}>
        {'–\t'}{props.author}
    </div>
);

Author = styled(Author)`
    font-family: ${lato1};
    text-align: center;
`;

interface AcclaimsListItemProps {
    acclaim: AcclaimItemShape;
    style: React.CSSProperties;
    className?: string;
}

const AcclaimsListItem: React.SFC<AcclaimsListItemProps> = (props) => (
    <div
        className={cx(props.className, css`
            padding: 20px 0;

            &:first-child {
                padding-top: 40px;
            }
        `)}
        style={props.style}
    >
        <AcclaimContainer>
            <Quote short={props.acclaim.short} quote={props.acclaim.quote} />
            <Author author={props.acclaim.author} />
        </AcclaimContainer>
    </div>
);

export default AcclaimsListItem;
