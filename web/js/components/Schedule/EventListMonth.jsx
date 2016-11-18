import '@/less/event-list-month.less';

import React from 'react';

import EventItem from '@/js/components/Schedule/EventItem.jsx';

export default class EventListMonth extends React.Component {
    render() {
        return (
            <div className="event-list-month">
                <div className="event-list-month__name">
                    {this.props.month}
                </div>
                <div className="event-list-month__list">
                    {this.props.events.map((ev, i) => {
                        return <EventItem event={ev} key={i}/>
                    })}
                </div>
            </div>
        );
    }
}
