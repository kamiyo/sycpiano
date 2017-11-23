import 'less/Schedule/event-item.less';

import _ from 'lodash';
import { Moment } from 'moment-timezone';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { DayItemShape } from 'js/components/Schedule/types';

const DateContainer = ({ dateTime }: { dateTime: Moment }) => (
    <div className='event-item__date-container'>
        <div className='event-item__date'>
            <div className='event-item__day'>
                {parseInt(dateTime.format('D'), 10)}
            </div>
            <div className='event-item__day-of-week'>
                {dateTime.format('ddd')}
            </div>
        </div>
    </div>
);

interface EventNameProps {
    dateTime: Moment;
    name: string;
    handleSelect: () => void;
}

const EventName = ({ dateTime, name, handleSelect }: EventNameProps) => (
    <Link
        to={`/schedule/${dateTime.format('YYYY-MM-DD')}`}
        onClick={handleSelect}
    >
        <div className='event-item__info-name'>
            {name}
        </div>
    </Link>
);

interface EventItemProps {
    event: DayItemShape;
    style: React.CSSProperties;
    handleSelect: () => void;
}

const EventItem = ({ event, style, handleSelect }: EventItemProps) => {
    const time = event.dateTime.format('h:mm z');
    return (
        <div className='event-item' style={style}>
            <DateContainer dateTime={event.dateTime} />
            <div className='event-item__info'>
                <EventName
                    dateTime={event.dateTime}
                    name={event.name}
                    handleSelect={handleSelect}
                />
                <div className='event-item__info-time'>
                    {time}
                </div>
                <div className='event-item__info-type'>
                    {_.startCase(event.eventType)}
                </div>
            </div>
        </div>
    );
};

export default EventItem;
