import '@/less/Schedule/schedule.less';

import React from 'react';
import { connect } from 'react-redux';
import { createFetchEventsAction } from '@/js/components/Schedule/actions.js'
import ConnectedEventDetails from '@/js/components/Schedule/EventDetails.jsx';

class Schedule extends React.Component {
    componentWillMount() {
        this.props.createFetchEventsAction(this.props.params.date);
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
    { createFetchEventsAction }
)(Schedule);
