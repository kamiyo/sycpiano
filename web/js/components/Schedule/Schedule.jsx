import '@/less/schedule.less';

import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';

import SycCalendar from '@/js/components/Schedule/SycCalendar.jsx';
import EventList from '@/js/components/Schedule/EventList.jsx';

const Schedule = ({store}) => {
    return (
        <Provider store={store}>
            <div className="schedule">
                <div className="schedule__calendar">
                    <SycCalendar />
                </div>
                <div className="schedule__events">
                    <EventList />
                </div>
            </div>
        </Provider>
    );
}

export default Schedule;
