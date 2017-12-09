import 'less/Admin/components/calendar-admin.less';

import * as React from 'react';

import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { CLIENT_ID, validateToken } from 'src/services/GoogleOAuth';

import {
    eventFormReducer,
    eventListReducer,
} from 'src/admin/components/reducers';

import AuthInterface from 'src/admin/components/AuthInterface';
import EventForm from 'src/admin/components/EventForm';
import EventList from 'src/admin/components/EventList';

import { AdminStoreShape } from 'src/admin/components/types';

const reducersMap = {
    eventForm: eventFormReducer,
    eventList: eventListReducer,
};

const store = createStore(combineReducers<AdminStoreShape>(reducersMap), applyMiddleware(thunk));

interface CalendarAdminProps {
    readonly token: string;
}

interface CalendarAdminState {
    readonly authInProgress: boolean;
    readonly isAuthorized: boolean;
}

export default class CalendarAdmin extends React.Component<CalendarAdminProps, CalendarAdminState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthorized: false,
            authInProgress: false,
        };
    }

    componentWillMount() {
        if (!this.props.token) {
            return;
        }
        this.setState({ authInProgress: true });
        validateToken(this.props.token)
            .then((response) => {
                this.setState({
                    isAuthorized: (
                        response.status === 200 &&
                        response.data.aud === CLIENT_ID
                    ),
                    authInProgress: false,
                });
            })
            .catch(() => {
                this.setState({
                    isAuthorized: false,
                    authInProgress: false,
                });
            });
    }

    render() {
        return (
            <div className='calendar-admin'>
                {
                    this.state.authInProgress ? <div>Authorizing...</div> :
                        !this.state.isAuthorized ? <AuthInterface /> :
                            <Provider store={store}>
                                <div className='admin__calendar'>
                                    <div className='admin__event_form'>
                                        <EventForm accessToken={this.props.token} />
                                    </div>
                                    <div className='admin__list_events'>
                                        <EventList />
                                    </div>
                                </div>
                            </Provider>
                }
            </div>
        );
    }
}
