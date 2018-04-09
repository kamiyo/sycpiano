import * as React from 'react';
import { css } from 'react-emotion';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import EventList from 'src/components/Schedule/EventList';

import { container, pushed } from 'src/styles/mixins';

import { EventListName } from 'src/components/Schedule/actionTypes';
import { DateIconSVG } from 'src/components/Schedule/DateIconSVG';
import { LinkIconSVG } from 'src/components/Schedule/LinkIconSVG';
import { LocationIconSVG } from 'src/components/Schedule/LocationIconSVG';
import { TrebleIconSVG } from 'src/components/Schedule/TrebleIconSVG';
import { screenXSorPortrait } from 'src/styles/screens';

const scheduleStyles = css`
    ${pushed}
    ${container}
    font-size: 100%;
    width: 100%;
    box-sizing: border-box;

    ${/* sc-selector */ screenXSorPortrait} {
        font-size: 80%;
    }
`;

const Schedule: React.SFC<{ isMobile: boolean; }> = ({ isMobile }) => (
    <div className={scheduleStyles}>
        <div className={css` height: 100%; `}>
            <Switch>
                <Route
                    path="/schedule/:type/:date?"
                    exact={true}
                    render={(routeProps: RouteComponentProps<{ type: string; date: string; }>) => (
                        <EventList
                            {...routeProps}
                            date={routeProps.match.params.date}
                            type={routeProps.match.params.type as EventListName}
                            isMobile={isMobile}
                        />
                    )}
                />
                <Route
                    path="/schedule"
                    render={() => (
                        <Redirect to="/schedule/upcoming" />
                    )}
                />
            </Switch>
        </div>
        <DateIconSVG />
        <LocationIconSVG />
        <TrebleIconSVG />
        <LinkIconSVG />
    </div>
);

export type ScheduleType = typeof Schedule;
export default Schedule;
