import * as React from 'react';

import { EventListName } from 'src/components/Schedule/actionTypes';
import { EventItemBody } from 'src/components/Schedule/EventItemBody';
import { DayItem } from 'src/components/Schedule/types';

interface EventItemProps {
    readonly event: DayItem;
    readonly style: React.CSSProperties;
    readonly handleSelect: () => void;
    readonly measure: () => void;
    readonly active: boolean;
    readonly type: EventListName;
}

class EventItem extends React.Component<EventItemProps, {}> {
    componentDidMount() {
        this.props.measure();
    }

    render() {
        const { event, style } = this.props;

        // permalink creation: {`/schedule/${type}/${event.dateTime.format('YYYY-MM-DD')}`
        return (
            <div style={style}>
                <EventItemBody {...event} />
            </div>
        );
    }
}

export default EventItem;
