import { JWT } from 'google-auth-library';
import { Sequelize } from 'sequelize/types';
import { ModelMap } from 'types';

/* eslint-disable-next-line @typescript-eslint/no-var-requires*/
const authInfo = require('../../gapi-key.json');

const authorize = async () => {
    const jwt = new JWT(
        authInfo.client_email,
        null,
        authInfo.private_key,
        ['https://www.googleapis.com/auth/calendar'],
        null,
    );

    try {
        const response = await jwt.authorize();
        return response;
    } catch (e) {
        console.log(e);
    }
};

export const getToken = async (sequelize: Sequelize) => {
    const tokenModel = (sequelize.models as ModelMap).token;
    const tokenInstance = await tokenModel.findByPk('access_token');
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
