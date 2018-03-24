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

const scheduleStyles = (isMobile?: boolean) => css`
    ${pushed}
    ${container}
    font-size: ${isMobile ? 80 : 100}%;
    width: 100%;
    box-sizing: border-box;
`;

class Schedule extends React.Component<{ isMobile: boolean; }, {}> {
    render() {
        return (
            <div className={scheduleStyles(this.props.isMobile)}>
                <div className={css` height: 100%; `}>
                    <Switch>
                        <Route
                            path="/schedule/:type/:date?"
                            exact={true}
                            render={(routeProps: RouteComponentProps<{ type: string; date: string; }>) => (
                                <EventList {...routeProps} date={routeProps.match.params.date} type={routeProps.match.params.type as EventListName} isMobile={this.props.isMobile} />
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
    }
}

export type ScheduleType = typeof Schedule;
export default Schedule;
