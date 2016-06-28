import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import URI from 'urijs';
import CalendarAdmin from '@/js/admin/components/CalendarAdmin.jsx';

var TOKEN_KEY = 'sycpiano-token'

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
    let calAdmin;
    if (token) {
        calAdmin = React.createElement(CalendarAdmin, {token});
        localStorage.setItem(TOKEN_KEY, token);
    } else if (localStorage.getItem(TOKEN_KEY)) {
        token = localStorage.getItem(TOKEN_KEY);
        calAdmin = React.createElement(CalendarAdmin, {
            token: localStorage.getItem(TOKEN_KEY)
        });
    }
    else {
        calAdmin = React.createElement(CalendarAdmin);
    }
    ReactDOM.render(calAdmin, document.getElementById('main'));
}
