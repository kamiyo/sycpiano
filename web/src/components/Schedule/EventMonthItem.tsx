import 'less/Schedule/event-month-item.less';

import * as React from 'react';

interface EventMonthItemProps {
    readonly style: React.CSSProperties;
    readonly month: string;
    readonly year: number;
    readonly setRef: (el: HTMLDivElement) => void;
    readonly removeRef: (el: HTMLDivElement) => void;
}

class EventMonthItem extends React.Component<EventMonthItemProps, {}> {
    ref: HTMLDivElement;

    componentWillUnmount() {
        this.props.removeRef(this.ref);
    }

    componentDidMount() {
        this.props.setRef(this.ref);
    }

    render() {
        return (
            <div
                className='event-month-item'
                style={this.props.style}
                ref={(div) => {
                    this.ref = div;
                }}
            >
                {`${this.props.month} ${this.props.year}`}
            </div>
        );
    }
}

export default EventMonthItem;
