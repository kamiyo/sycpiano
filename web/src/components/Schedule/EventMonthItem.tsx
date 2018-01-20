import 'less/Schedule/event-month-item.less';

import * as React from 'react';

interface EventMonthItemProps {
    readonly style: React.CSSProperties;
    readonly month: string;
    readonly year: number;
    readonly measure: () => void;
}

class EventMonthItem extends React.Component<EventMonthItemProps, {}> {
    componentDidMount() {
        this.props.measure();
    }

    render() {
        return (
            <div className="event-month-item-container" style={this.props.style}>
                <div className="event-month-item">
                    {`${this.props.month} ${this.props.year}`}
                </div>
                <div className="event-month-item-border" />
            </div>
        );
    }
}

export default EventMonthItem;
