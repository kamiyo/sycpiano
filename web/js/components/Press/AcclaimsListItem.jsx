import '@/less/Press/acclaims-list-item.less';

import React from 'react';

const AcclaimsListItem = ({ acclaim, style }) => {
    return (
        <div className="acclaims-list-item" style={style}>
            <div className="acclaims-list-item__quote">
                {!!acclaim.short ? acclaim.short : acclaim.quote}
            </div>
            <div className="acclaims-list-item__author">
                {'–\t'}{acclaim.author}
            </div>
        </div>
    );
};

export default AcclaimsListItem;
