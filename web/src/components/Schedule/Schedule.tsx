import moment from 'moment-timezone';
import { parse } from 'qs';
import * as React from 'react';

import { css } from '@emotion/react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import EventList from 'src/components/Schedule/EventList';
import { SearchWithHistory as Search } from 'src/components/Schedule/Search';
import { EventListName } from 'src/components/Schedule/types';

import { container, pushed } from 'src/styles/mixins';

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

    ${screenXSorPortrait} {
        font-size: 80%;
    }
`;

type ScheduleProps = { isMobile: boolean } & RouteComponentProps<{ type: string }>;

class Schedule extends React.Component<ScheduleProps, { search: string }> {
    constructor(props: ScheduleProps) {
        super(props);
        const q = parse(props.location.search, { ignoreQueryPrefix: true }).q as string;
        const search = q || '';
        this.state = {
            search,
        };
    }

    setSearch = (search: string): void => {
        this.setState({
            search,
        });
    }

    render(): JSX.Element {
        const { isMobile } = this.props;
        return (
            <div css={scheduleStyles}>
                <Search search={this.state.search} setSearch={this.setSearch} />
                <div css={css` height: 100%; `}>
                    <Switch>
                        <Route
                            path="/schedule/upcoming/:date?"
                            exact={true}
                            render={(routeProps: RouteComponentProps<{ date: string }>) => (
                                <EventList
                                    {...routeProps}
                                    date={routeProps.match.params.date}
                                    type={'upcoming'}
                                    isMobile={isMobile}
                                />
                            )}
                        />
                        <Route
                            path="/schedule/archive/:date?"
                            exact={true}
                            render={(routeProps: RouteComponentProps<{ date: string }>) => (
                                <EventList
                                    {...routeProps}
                                    date={routeProps.match.params.date}
                                    type={'archive'}
                                    isMobile={isMobile}
                                />
                            )}
                        />
                        <Route
                            path="/schedule/search"
                            exact={true}
                            render={(routeProps: RouteComponentProps<unknown>) => (
                                <EventList
                                    {...routeProps}
                                    type={'search'}
                                    search={this.state.search}
                                    isMobile={isMobile}
                                />
                            )}
                        />
                        <Route
                            path="/schedule/:date"
                            exact={true}
                            render={(routeProps: RouteComponentProps<{ date: string }>) => {
                                const now = moment().startOf('day');
                                const momentDate = moment(routeProps.match.params.date, 'YYYY-MM-DD');
                                const type: EventListName = (momentDate.isBefore(now)) ? 'archive' : 'upcoming';
                                return (
                                    <Redirect to={`/schedule/${type}/${routeProps.match.params.date}`} />
                                );
                            }}
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

export type ScheduleType = React.Component<ScheduleProps>;
export type RequiredProps = ScheduleProps;
export default Schedule;
