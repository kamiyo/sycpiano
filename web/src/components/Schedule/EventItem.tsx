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
    readonly isMobile?: boolean;
    readonly permaLink: string;
}

const EventItem: React.SFC<EventItemProps> = ({ event, style, isMobile, permaLink }) => (
    <div style={style}>
        <EventItemBody {...event} isMobile={isMobile} permaLink={permaLink} />
    </div>
);

export default EventItem;
