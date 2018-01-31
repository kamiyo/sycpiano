import { JWT } from 'google-auth-library';

/*tslint:disable:no-var-requires*/
const authInfo = require('../../sycpiano-7657a76435d9.json');
/*tslint:enable:no-var-requires*/

import db from '../models/index';
const models = db.models;

import { TokenModel } from 'types';

export const getToken = async () => {
    const tokenModel: TokenModel = models.token;
    const tokenInstance = await tokenModel.findById('access_token');
    if (tokenInstance) {
        const expired = Date.now() > tokenInstance.expires.valueOf();
        if (!expired) {
            return tokenInstance.token;
        }
    }
    const credentials = await authorize();
    await tokenModel.upsert({
        id: 'access_token',
        token: credentials.access_token,
        expires: new Date(credentials.expiry_date),
    });

    return credentials.access_token;
};

const authorize = async () => {
    const jwt = new JWT(
        authInfo.client_email,
        null,
        authInfo.private_key,
        ['https://www.googleapis.com/auth/calendar'],
        null
    );

    try {
        const response = await jwt.authorize();
        return response;
    } catch (e) {
        console.log(e);
    }
};

getToken();