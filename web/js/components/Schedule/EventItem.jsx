import '@/less/Schedule/event-item.less';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import classNames from 'classnames';

import { titleCase } from '@/js/utils.js';

const DateContainer = ({ dateTime }) => (
    <div className="event-item__date-container">
        <div className="event-item__date">
            <div className="event-item__day">
                {parseInt(dateTime.format('D'))}
            </div>
            <div className="event-item__day-of-week">
                {dateTime.format('ddd')}
            </div>
        </div>
    </div>
);

const EventName = ({ name }) => <div className="event-item__info-name">{name}</div>;

const EventBody = ({ program, collaborators }) => (
    <div className="event-item__info-body">
        <ul className="event-item__info-program">
            {
                Object.keys(program).map(key => (
                    <li key={key}>{program[key]}</li>
                ))
            }
        </ul>
        <ul className="event-item__info-collaborators">
            {
                Object.keys(collaborators).map(key => (
                    <li key={key}>{collaborators[key]}</li>
                ))
            }
        </ul>
    </div>
);

const EventItem = ({
    event,
    style,
    gridState,
    handleSelect,
    active,
}) => {
    const time = event.dateTime.format('h:mm z');
    return (
        <Link
            to={`/schedule/${event.dateTime.format('YYYY-MM-DD')}`}
            onClick={handleSelect}
            style={style}
        >
            <div className={classNames('event-item', { 'event-item--active': active })}>
                <DateContainer dateTime={event.dateTime} />
                <div className="event-item__info">
                    <EventName name={event.name} />
                    <div className="event-item__info-time">
                        {time}
                    </div>
                    <div className="event-item__info-type">
                        {titleCase(event.eventType)}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default EventItem;
