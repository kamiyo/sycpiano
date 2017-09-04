import '@/less/Schedule/schedule.less';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { googleAPI } from '@/js/services/GoogleAPI.js';

import ConnectedEventDetails from '@/js/components/Schedule/EventDetails.jsx';


class Schedule extends React.Component {
    componentWillMount() {
        this.props.fetchEvents();
    }

    render () {
        return (
            <div className="schedule">
                <div className="schedule__event-details">
                    <ConnectedEventDetails />
                </div>
                <div className="schedule__events">
                    {this.props.children}
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
        getInitialEventItems()
            .then(items => {
                dispatch({
                    type: 'SCHEDULE--FETCH_EVENTS_SUCCESS',
                    fetchedEvents: items,
                })
            });
        dispatch({ type: 'SCHEDULE--FETCHING_EVENTS' });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Schedule);
