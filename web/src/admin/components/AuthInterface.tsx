import 'less/Admin/components/auth-interface.less';

import * as React from 'react';

import Button from 'src/components/_reusable/Button';

import { authorize } from 'src/services/GoogleOAuth';
import { calendarScopes } from 'src/services/GoogleOAuthScopes';

export default class AuthInterface extends React.Component<{}> {
    authorizeGoogleAccount = () => {
        authorize([calendarScopes.manage]);
    }

    render() {
        return (
            <div className="auth-interface">
                <div className="auth-button-description">You must authenticate in order to use this tool!</div>
                <Button onClick={this.authorizeGoogleAccount} extraClasses={['auth-button']}>
                    Authenticate
                </Button>
            </div>
        );
    }
}
