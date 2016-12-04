import '@/less/event-month-item.less';

import React from 'react';

export default class EventMonthItem extends React.Component {
    render() {
        return <div className="event-month-item">{this.props.month}</div>;
    }
}
