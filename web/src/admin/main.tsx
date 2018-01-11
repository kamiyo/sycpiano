import * as React from 'react';
import ReactDOM from 'react-dom';

import CalendarAdmin from 'src/admin/components/CalendarAdmin';
import { TOKEN_KEY } from 'src/admin/constants';

global.Promise = require('bluebird');

main();

/**
 * Extracts the oauth access token from the response, and returns it.
 * @return {string} The oauth access token.
 */
function getTokenFromHash() {
    // Following snippet is from google. It parses the response.
    // https://developers.google.com/identity/protocols/OAuth2UserAgent#handlingtheresponse
    const params: {
        [key: string]: string;
    } = {};
    const regex = /([^&=]+)=([^&]*)/g;
    const queryString = location.hash.substring(1);
    let m: string[];
    for (m = regex.exec(queryString); m; m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params.access_token;
}

function main() {
    let token = getTokenFromHash();
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else if (localStorage.getItem(TOKEN_KEY)) {
        token = localStorage.getItem(TOKEN_KEY);
    } else {
        token = null;
    }
    ReactDOM.render(<CalendarAdmin token={token} />, document.getElementById('main'));
}
