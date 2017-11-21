import 'less/Admin/components/auth-interface.less';

import React from 'react';
import Button from 'js/components/_reusable/Button';
import { authorize } from 'js/services/GoogleOAuth.js';
import { calendarScopes } from 'js/services/GoogleOAuthScopes.js';


export default class AuthInterface extends React.Component {
    authorizeGoogleAccount = () => {
        authorize([calendarScopes.manage]);
    }

    render() {
        return (
            <div className='auth-interface'>
                <div className='auth-button-description'>You must authenticate in order to use this tool!</div>
                <Button onClick={this.authorizeGoogleAccount} extraClasses='auth-button'>
                    Authenticate
                </Button>
            </div>
        );
    }
};
