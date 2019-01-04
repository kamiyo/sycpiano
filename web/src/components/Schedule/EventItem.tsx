import * as React from 'react';

import { EventItemBody } from 'src/components/Schedule/EventItemBody';
import { DayItem, EventListName } from 'src/components/Schedule/types';

interface EventItemProps {
    readonly event: DayItem;
    readonly style: React.CSSProperties;
    readonly handleSelect: () => void;
    readonly measure: () => void;
    readonly active: boolean;
    readonly type: EventListName;
    readonly isMobile?: boolean;
    readonly permaLink: string;
}

const EventItem: React.FC<EventItemProps> = ({ event, style, isMobile, permaLink, type }) => (
    <div style={style}>
        <EventItemBody {...event} isMobile={isMobile} permaLink={permaLink} listType={type} />
    </div>
);

export default EventItem;
