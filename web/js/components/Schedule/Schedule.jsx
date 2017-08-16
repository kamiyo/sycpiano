import '@/less/Schedule/schedule.less';

import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import {VelocityComponent, VelocityTransitionGroup} from 'velocity-react';


import SycCalendar from '@/js/components/Schedule/SycCalendar.jsx';
import EventList from '@/js/components/Schedule/EventList.jsx';

const Schedule = ({store, match}) => (
    <Provider store={store}>
        <div className="schedule">
            <div className="schedule__calendar">
                <SycCalendar />
            </div>
            <div className="schedule__events">
                <VelocityTransitionGroup
                    enter={{duration: 500, animation: {opacity: 1, translateZ: 0}}}
                    leave={{duration: 500, animation: {opacity: 0, translateZ: 0}}}
                    runOnMount={true}
                >
                {match.params.id ?
                    null : <EventList />
                }
                </VelocityTransitionGroup>
            </div>
        </div>
    </Provider>
);

export default Schedule;
