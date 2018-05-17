import ABOUT_ACTIONS from 'src/components/About/actionTypeKeys';
import ActionTypes from 'src/components/About/actionTypes';
import { AboutStateShape } from 'src/components/About/types';

export const aboutReducer = (state: AboutStateShape = {
    isFetching: false,
    bio: [],
}, action: ActionTypes) => {
    switch (action.type) {
        case ABOUT_ACTIONS.FETCH_BIO_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case ABOUT_ACTIONS.FETCH_BIO_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case ABOUT_ACTIONS.FETCH_BIO_SUCCESS:
            return {
                isFetching: false,
                bio: action.bio,
            };
        default:
            return state;
    }
};
