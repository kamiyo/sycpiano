import 'less/Schedule/schedule.less';

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { createFetchEventsAction } from 'js/components/Schedule/actions';
import ConnectedEventDetails from 'js/components/Schedule/EventDetails';
import EventList from 'js/components/Schedule/EventList';
import { EventItemShape } from 'js/components/Schedule/types';
import { GlobalStateShape } from 'js/types';

interface ScheduleProps {
    createFetchEventsAction: (date: string) => void;
    eventItems: EventItemShape[];
}

class Schedule extends React.Component<RouteComponentProps<{ date: string }> & ScheduleProps, {}> {
    componentWillMount() {
        this.props.createFetchEventsAction(this.props.match.params.date);
    }

    render() {
        return (
            <div className='schedule container'>
                <div className='schedule__event-details'>
                    <ConnectedEventDetails />
                </div>
                <div className='schedule__events'>
                    <Switch>
                        <Route path='/schedule/:date' component={EventList} exact={true}/>
                        <Route path='/schedule' component={EventList} exact={true}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    eventItems: state.schedule_eventItems.items,
});

interface StateFromProps {
    eventItems: EventItemShape[];
}

interface DispatchFromProps {
    createFetchEventsAction: (date: string) => void;
}

export default connect<StateFromProps, DispatchFromProps, void>(
    mapStateToProps,
    { createFetchEventsAction },
)(Schedule);
