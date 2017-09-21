import axios from 'axios';
import URI from 'urijs';
import Q from 'q';

export const CLIENT_ID = '250749672169-jch94h118cjh3e7t02lvr9p0u2p6qoek.apps.googleusercontent.com';

/**
 * Validates the given access token via Google OAuth.
 *
 * @param  {string} accessToken - The access token to be validated.
 * @return {Promise} - Whether we've finished validating the access token.
 */
export function validateToken(accessToken) {
    return axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
    );
}

/**
 * The entry point to the Google OAuth process.
 * Opens a window with the Google choose account page.
 *
 * @param  {array[string]} scopes - authorizations to request for
 *
 * Example usage:
 *     authorize(['https://www.googleapis.com/auth/calendar']).then((token) => {
 *         // Make requests with token.
 *     })
 */
export function authorize(scopes) {
    const googleURL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectURI = window.location.href.split('#')[0];
    const oauthURI = URI(googleURL).query({
        response_type: 'token',
        client_id: CLIENT_ID,
        redirect_uri: redirectURI,
        scope: scopes.join(' '),
    });
    window.location = oauthURI.toString();
}
