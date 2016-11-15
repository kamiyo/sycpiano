import '@/less/admin/components/calendar-admin.less';

import React from 'react';
import {validateToken, CLIENT_ID} from '@/js/services/GoogleOAuth.js';
import AuthInterface from '@/js/admin/components/AuthInterface.jsx';
import {AddEventForm} from '@/js/admin/components/AddEventForm.jsx';

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
        this.setState({authInProgress: true});
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
            .catch(response => {
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
                        return <div>Authorizing...</div>
                    }
                    if (!this.state.isAuthorized) {
                        return <AuthInterface/>;
                    }
                    return <AddEventForm accessToken={this.props.token}/>
                })()}
            </div>
        );
    }
};
