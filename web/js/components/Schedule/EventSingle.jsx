import _ from 'lodash'
import '@/less/Schedule/event-month-item.less';
import '@/less/Schedule/event-item.less';

import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';

import EventMonthItem from '@/js/components/Schedule/EventMonthItem.jsx';

const NoEventsScheduled = ({ date }) => (
    <div className="event-item">
        <div className="event-item__date-container">
            <div className="event-item__date">
                {date.format("DD")}
            </div>
        </div>
        <div className="event-item__info">
            Sorry, there are no events scheduled for {date.format("MMMM DD, YYYY")}.
        </div>
    </div>
);

const EventInfo = ({ event }) => (
    <div className="event-item">
        <div className="event-item__date-container">
            <div className="event-item__date">
                {event.day}
            </div>
        </div>
        <div className="event-item__info">
            <div className="event-item__info-name">
                {event.name}
            </div>

            <div className="event-item__info-time">
                {event.time}
            </div>
            <div className="event-item__info-type">
                {_.startCase(event.eventType)}
            </div>
            <div className="event-item__info-body">
                <ul className="event-item__info-program">
                    {
                        Object.keys(event.program).map((key) => {
                            return <li key={key}>{event.program[key]}</li>
                        })
                    }
                </ul>
                <ul className="event-item__info-collaborators">
                    {
                        Object.keys(event.collaborators).map((key) => {
                            return <li key={key}>{event.collaborators[key]}</li>
                        })
                    }
                </ul>
            </div>
        </div>
    </div>
);

const EventSingle = ({ id, eventItems }) => {
    const date = moment(id);
    const event = eventItems.find((item) => item.type === 'day' && date.isSame(item.dateTime, 'day'));
    return (
        <div className="event-single">
            <EventMonthItem month={date.format('MMMM')} />
            {
                event ? <EventInfo event={event} />
                    : <NoEventsScheduled date={date} />
            }
        </div>
    );
}

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
    date: state.schedule_date.date,
});

export default connect(
    mapStateToProps,
    () => ({})
)(EventSingle);