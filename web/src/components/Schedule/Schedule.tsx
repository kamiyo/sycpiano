import 'less/Schedule/schedule.less';

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { createFetchEventsAction } from 'src/components/Schedule/actions';
import ConnectedEventDetails from 'src/components/Schedule/EventDetails';
import EventList from 'src/components/Schedule/EventList';
import { EventItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

interface ScheduleStateFromProps {
    readonly eventItems: EventItemShape[];
}

interface ScheduleDispatchFromProps {
    readonly createFetchEventsAction: (date: string) => void;
}

type ScheduleProps = ScheduleStateFromProps & ScheduleDispatchFromProps;

interface ParamProps {
    readonly date: string;
}

class Schedule extends React.Component<RouteComponentProps<ParamProps> & ScheduleProps, {}> {
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

export default connect<ScheduleStateFromProps, ScheduleDispatchFromProps>(
    mapStateToProps,
    { createFetchEventsAction },
)(Schedule);
