import '@/less/Schedule/schedule.less';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { fetchEvents } from '@/js/components/Schedule/actions.js'
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

const mapStateToProps = state => ({
    eventItems: state.schedule_eventItems.items,
});

export default connect(
    mapStateToProps,
    { fetchEvents }
)(Schedule);
