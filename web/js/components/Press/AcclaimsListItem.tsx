import 'less/Press/acclaims-list-item.less';

import * as React from 'react';

import { AcclaimItemShape } from 'js/components/Press/types';

const AcclaimsListItem = ({ acclaim, style }: { acclaim: AcclaimItemShape; style: React.CSSProperties }) => (
    <div className='acclaims-list-item' style={style}>
        <div className='acclaims-list-item__container'>
            <div className='acclaims-list-item__quote'>
                {!!acclaim.short ? acclaim.short : acclaim.quote}
            </div>
            <div className='acclaims-list-item__author'>
                {'–\t'}{acclaim.author}
            </div>
        </div>
    </div>
);

export default AcclaimsListItem;
