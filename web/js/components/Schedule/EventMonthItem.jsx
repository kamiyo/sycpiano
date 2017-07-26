import '@/less/Schedule/event-month-item.less';

import React from 'react';

export default class EventMonthItem extends React.Component {
    render() {
        return (
            <div className="event-month-item" style={this.props.style}>
                <div>
                    {this.props.month}
                </div>
            </div>
        );
    }
}
