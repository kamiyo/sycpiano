import '@/less/Schedule/event-month-item.less';

import React from 'react';

const EventMonthItem = ({ style, months }) => (
    <div className="event-month-item" style={style}>
        <div>{month}</div>
    </div>
);

export default EventMonthItem;
