import 'less/Schedule/event-month-item.less';

import * as React from 'react';

interface EventMonthItemProps {
    style: React.CSSProperties;
    month: string;
}

const EventMonthItem: React.SFC<EventMonthItemProps> = ({ style, month }) => (
    <div className='event-month-item' style={style}>
        {month}
    </div>
);

export default EventMonthItem;
