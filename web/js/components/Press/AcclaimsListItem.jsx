import React from 'react';

const AcclaimsListItem = ({ acclaim, index }) => {
    return (
        <div className="acclaims-list-item">
            {acclaim.short}
        </div>
    );
};

export default AcclaimsListItem;
