import '@/less/schedule.less';

import React from 'react';

import Calendar from 'rc-calendar';
import EventList from '@/js/components/Schedule/EventList.jsx';

export default class Schedule extends React.Component {
    render() {
        return (
            <div className="schedule">
                <div className="schedule__events">
                    <EventList/>
                </div>
                <div className="schedule__calendar">
                    <Calendar
                        showDateInput={false}
                        showToday={false}
                        enablePrev={true}
                        enableNext={true}
                    />
                </div>
            </div>
        );
    }
}
