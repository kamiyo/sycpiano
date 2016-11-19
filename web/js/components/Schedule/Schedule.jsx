import '@/less/schedule.less';

import React from 'react';

import SycCalendar from '@/js/components/Schedule/SycCalendar.jsx';
import EventList from '@/js/components/Schedule/EventList.jsx';

export default class Schedule extends React.Component {
    render() {
        return (
            <div className="schedule">
                <div className="schedule__events">
                    <EventList/>
                </div>
                <div className="schedule__calendar">
                    <SycCalendar/>
                </div>
            </div>
        );
    }
}
