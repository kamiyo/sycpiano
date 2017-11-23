import 'less/Admin/components/calendar-admin.less';

import React from 'react';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import {
    eventFormReducer,
    eventListReducer,
} from 'js/admin/components/reducers.js';

import { validateToken, CLIENT_ID } from 'js/services/GoogleOAuth';
import AuthInterface from 'js/admin/components/AuthInterface.jsx';
import EventForm from 'js/admin/components/EventForm.jsx';
import EventList from 'js/admin/components/EventList.jsx';

const reducersMap = {
    eventForm: eventFormReducer,
    eventList: eventListReducer,
};

const store = createStore(combineReducers(reducersMap));

export default class CalendarAdmin extends React.Component {
    constructor(props) {
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
            .then(response => {
                this.setState({
                    isAuthorized: (
                        response.status == 200 &&
                        response.data.aud == CLIENT_ID
                    ),
                    authInProgress: false,
                });
            })
            .catch(error => {
                this.setState({
                    isAuthorized: false,
                    authInProgress: false,
                });
            });
    }

    render() {
        return (
            <div className="calendar-admin">
                {(() => {
                    if (this.state.authInProgress) {
                        return <div>Authorizing...</div>;
                    }
                    if (!this.state.isAuthorized) {
                        return <AuthInterface />;
                    }
                    return (
                        <Provider store={store}>
                            <div className="admin__calendar">
                                <div className="admin__event_form">
                                    <EventForm accessToken={this.props.token} />
                                </div>
                                <div className="admin__list_events">
                                    <EventList />
                                </div>
                            </div>
                        </Provider>
                    )

                })()}
            </div>
        );
    }
};
