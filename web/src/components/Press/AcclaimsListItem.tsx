import 'less/Press/acclaims-list-item.less';

import * as React from 'react';

import { AcclaimItemShape } from 'src/components/Press/types';

const AcclaimsListItem: React.SFC<{ acclaim: AcclaimItemShape; style: React.CSSProperties }> = ({ acclaim, style }) => (
    <div className="acclaims-list-item" style={style}>
        <div className="acclaims-list-item__container">
            <div className="acclaims-list-item__quote">
                {!!acclaim.short ? acclaim.short : acclaim.quote}
            </div>
            <div className="acclaims-list-item__author">
                {'–\t'}{acclaim.author}
            </div>
        </div>
    </div>
);

export default AcclaimsListItem;
