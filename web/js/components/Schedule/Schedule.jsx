import '@/less/schedule.less';

import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { dateReducer, eventItemsReducer } from '@/js/components/Schedule/ScheduleReducers.js';
import SycCalendar from '@/js/components/Schedule/SycCalendar.jsx';
import EventList from '@/js/components/Schedule/EventList.jsx';

let store = createStore(combineReducers({
    date: dateReducer,
    eventItems: eventItemsReducer
}));

export default class Schedule extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div className="schedule">
                    <div className="schedule__events">
                        <EventList/>
                    </div>
                    <div className="schedule__calendar">
                        <SycCalendar/>
                    </div>
                </div>
            </Provider>
        );
    }
}
