import * as React from 'react';
import { css } from 'react-emotion';
import { Redirect, Route, Switch } from 'react-router-dom';

import EventList from 'src/components/Schedule/EventList';

import { container, pushed } from 'src/styles/mixins';

import { DateIconSVG } from 'src/components/Schedule/DateIconSVG';
import { LocationIconSVG } from 'src/components/Schedule/LocationIconSVG';
import { TrebleIconSVG } from 'src/components/Schedule/TrebleIconSVG';

const scheduleStyles = css`
    ${pushed}
    ${container}
    width: 100%;
    box-sizing: border-box;
`;

const Schedule: React.SFC<{ isMobile: boolean; }> = () => (
    <div className={scheduleStyles}>
        <div className={css` height: 100%; `}>
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
                    render={(routeProps) => (
                        <EventList {...routeProps} type="upcoming" />
                    )}
                />
                <Route
                    path="/schedule/archive/:date?"
                    exact={true}
                    render={(routeProps) => (
                        <EventList {...routeProps} type="archive" />
                    )}
                />
            </Switch>
        </div>
        <DateIconSVG />
        <LocationIconSVG />
        <TrebleIconSVG />
    </div>
);

export const Component = Schedule;
export default { Component };
