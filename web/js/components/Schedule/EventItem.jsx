import '@/less/Schedule/event-item.less';

import React from 'react';

const EventItem = ({ style, event }) => (
    <div className="event-item" style={style}>
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
            <div className="event-item__info-body">
                <ul className="event-item__info-program">
                {
                    Object.keys(event.program).map(key => (
                        <li key={key}>{event.program[key]}</li>
                    ))
                }
                </ul>
                <ul className="event-item__info-collaborators">
                {
                    Object.keys(event.collaborators).map(key => (
                        <li key={key}>{event.collaborators[key]}</li>
                    ))
                }
                </ul>
            </div>
        </div>
    </div>
);

export default EventItem;
