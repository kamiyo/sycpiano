import '@/less/Schedule/schedule.less';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import { googleAPI } from '@/js/services/GoogleAPI.js';

import SycCalendar from '@/js/components/Schedule/SycCalendar.jsx';

class Schedule extends React.Component {
    componentWillMount() {
        this.props.fetchEvents();
    }

    render () {
        return (
            <div className="schedule">
                <div className="schedule__calendar">
                    <SycCalendar />
                </div>
                <div className="schedule__events">
                    <VelocityTransitionGroup
                        enter={{ duration: 500, animation: { opacity: 1, translateZ: 0 } }}
                        leave={{ duration: 500, animation: { opacity: 0, translateZ: 0 } }}
                        runOnMount={true}
                    >
                        {React.cloneElement(this.props.children, {
                            key: this.props.location.pathname.split('/')[2] || '/'
                        })}
                    </VelocityTransitionGroup>
                </div>
            </div>
        );
    }
}

function getInitialEventItems() {
    return new Promise((resolve, reject) => googleAPI.getCalendarEvents().then(
        response => resolve(response.data.items)
    ));
}

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
});

const mapDispatchToProps = dispatch => ({
    fetchEvents: () => {
        getInitialEventItems().then(items => (
            dispatch({
                type: 'SCHEDULE--FETCH_EVENTS_SUCCESS',
                fetchedEvents: items,
            })
        ));
        dispatch({ type: 'SCHEDULE--FETCHING_EVENTS' });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Schedule);
