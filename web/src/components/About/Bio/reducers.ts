import BIO_ACTIONS from 'src/components/About/Bio/actionTypeKeys';
import { ActionTypes } from 'src/components/About/Bio/actionTypes';
import { BioStateShape } from 'src/components/About/Bio/types';

export const bioReducer = (state: BioStateShape = {
    isFetching: false,
    bio: [],
}, action: ActionTypes) => {
    switch (action.type) {
        case BIO_ACTIONS.FETCH_BIO_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case BIO_ACTIONS.FETCH_BIO_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case BIO_ACTIONS.FETCH_BIO_SUCCESS:
            return {
                isFetching: false,
                bio: action.bio,
            };
        default:
            return state;
    }
};
