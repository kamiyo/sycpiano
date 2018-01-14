import 'less/Schedule/schedule.less';

import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ConnectedEventDetails from 'src/components/Schedule/EventDetails';
import EventList from 'src/components/Schedule/EventList';

import { DateIconSVG } from 'src/components/Schedule/DateIconSVG';
import { LocationIconSVG } from 'src/components/Schedule/LocationIconSVG';
import { TrebleIconSVG } from 'src/components/Schedule/TrebleIconSVG';

const Schedule: React.SFC<{}> = () => (
    <div className="schedule container">
        <div className="schedule__event-details">
            <ConnectedEventDetails />
        </div>
        <div className="schedule__events">
            <Switch>
                <Route
                    path="/schedule"
                    exact={true}
                    render={() => (
                        <Redirect to="/schedule/upcoming" />
                    )}
                />
                <Route
                    path="/schedule/upcoming/:date?"
                    exact={true}
                    render={(routeProps) => {
                        return (
                            <EventList {...routeProps} type="upcoming" />
                        );
                    }}
                />
                <Route
                    path="/schedule/archive/:date?"
                    exact={true}
                    render={(routeProps) => {
                        return (
                            <EventList {...routeProps} type="archive" />
                        );
                    }}
                />
            </Switch>
        </div>
        <DateIconSVG />
        <LocationIconSVG />
        <TrebleIconSVG />
    </div>
);

export default Schedule;
