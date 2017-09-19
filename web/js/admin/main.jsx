import React from 'react';
import ReactDOM from 'react-dom';
import URI from 'urijs';
import CalendarAdmin from '@/js/admin/components/CalendarAdmin.jsx';
import { TOKEN_KEY } from '@/js/admin/constants.js';

main();

/**
 * Extracts the oauth access token from the response, and returns it.
 * @return {string} The oauth access token.
 */
function getTokenFromHash() {
    // Following snippet is from google. It parses the response.
    // https://developers.google.com/identity/protocols/OAuth2UserAgent#handlingtheresponse
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g;
    var queryString = location.hash.substring(1);
    var m;
    while (m = regex.exec(queryString)) {
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
    ReactDOM.render(<CalendarAdmin token={token}/>, document.getElementById('main'));
}