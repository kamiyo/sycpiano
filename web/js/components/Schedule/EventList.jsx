import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';

import EventListMonth from '@/js/components/Schedule/EventListMonth.jsx';

class EventListPresentation extends React.Component {
    render() {
        return (
            <div className="event-list">
                {
                    _.map(this.props.eventsByMonth, (events, month) => {
                        return <EventListMonth month={month} events={events} key={month}/>
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {eventsByMonth: state.eventsByMonth};
};

const mapDispatchToProps = (dispatch) => {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventListPresentation);
