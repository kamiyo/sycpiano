import '@/less/schedule.less';

import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import {
    dateReducer,
    eventItemsReducer,
} from '@/js/components/Schedule/ScheduleReducers.js';
import SycCalendar from '@/js/components/Schedule/SycCalendar.jsx';
import EventList from '@/js/components/Schedule/EventList.jsx';

const reducersMap = {
    date: dateReducer,
    eventItems: eventItemsReducer,
};

const store = createStore(combineReducers(reducersMap));

export default class Schedule extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div className="schedule">
                    <div className="schedule__calendar">
                        <SycCalendar/>
                    </div>
                    <div className="schedule__events">
                        <EventList/>
                    </div>
                </div>
            </Provider>
        );
    }
}
