import '@/less/Schedule/event-item.less';

import _ from 'lodash'
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

const DateContainer = ({ dateTime }) => (
    <div className="event-item__date-container">
        <div className="event-item__date">
            {parseInt(dateTime.format('D'))}
        </div>
    </div>
);

const EventName = ({ dateTime, name, storeScroll, gridState, handleSelect }) => (
    <Link
        to={`/schedule/${dateTime.format('YYYY-MM-DD')}`}
        onClick={handleSelect}
    >
        <div className="event-item__info-name">
            {name}
        </div>
    </Link>
)

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
)

const EventItem = ({
    event,
    style,
    gridState,
    handleSelect,
}) => {
    const time = event.dateTime.format('h:mm z');
    return (
        <div className="event-item" style={style}>
            <DateContainer dateTime={event.dateTime} />
            <div className="event-item__info">
                <EventName
                    dateTime={event.dateTime}
                    name={event.name}
                    gridState={gridState}
                    handleSelect={handleSelect}
                />
                <div className="event-item__info-time">
                    {time}
                </div>
                <div className="event-item__info-type">
                    {_.startCase(event.eventType)}
                </div>
            </div>
        </div>
    );
}

export default EventItem;
