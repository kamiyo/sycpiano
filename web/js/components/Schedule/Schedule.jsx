import 'less/Schedule/schedule.less';

import React from 'react';
import { connect } from 'react-redux';
import { createFetchEventsAction } from 'js/components/Schedule/actions.js'
import { Switch, Route } from 'react-router-dom';
import ConnectedEventDetails from 'js/components/Schedule/EventDetails.jsx';
import EventList from 'js/components/Schedule/EventList.jsx';

class Schedule extends React.Component {
    componentWillMount() {
        this.props.createFetchEventsAction(this.props.match.params.date);
    }

    render() {
        return (
            <div className="schedule container">
                <div className="schedule__event-details">
                    <ConnectedEventDetails />
                </div>
                <div className="schedule__events">
                    <Switch>
                        <Route path='/schedule/:date' component={EventList} exact/>
                        <Route path='/schedule' component={EventList} exact/>
                    </Switch>
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
