import _ from 'lodash'
import '@/less/Schedule/event-item.less';

import React from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

const DateContainer = ({ day }) => (
    <div className="event-item__date-container">
        <div className="event-item__date">
            {day}
        </div>
    </div>
);

const EventName = ({ date, name, storeScroll, gridState }) => (
    <Link
        to={'/schedule/' + date.format('YYYY-MM-DD')}
        onClick={(e) => {
            storeScroll(gridState.scrollTop);
        }}
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
                Object.keys(program).map((key) => {
                    return <li key={key}>{program[key]}</li>
                })
            }
        </ul>
        <ul className="event-item__info-collaborators">
            {
                Object.keys(collaborators).map((key) => {
                    return <li key={key}>{collaborators[key]}</li>
                })
            }
        </ul>
    </div>
)

const EventItem = ({ event, style, storeScroll, gridState }) => {
    const date = moment(event.dateTime);
    return (
        <div className="event-item" style={style}>
            <DateContainer day={event.day} />
            <div className="event-item__info">
                <EventName
                    date={date}
                    name={event.name}
                    storeScroll={storeScroll}
                    gridState={gridState}
                />
                <div className="event-item__info-time">
                    {event.time}
                </div>
                <div className="event-item__info-type">
                    {_.startCase(event.eventType)}
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    storeScroll: scrollTop => {
        dispatch({type: 'SCHEDULE--STORE_SCROLL', scrollTop});
    },
});

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(EventItem));