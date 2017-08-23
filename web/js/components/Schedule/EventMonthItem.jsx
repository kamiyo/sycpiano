import '@/less/Schedule/event-month-item.less';

import React from 'react';

const EventMonthItem = ({ style, month }) => (
    <div className="event-month-item" style={style}>
        <div>
            {month}
        </div>
    </div>
);

export default EventMonthItem;