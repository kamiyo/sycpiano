import { Reducer } from 'redux';
import BIO_ACTIONS from 'src/components/About/Bio/actionTypeKeys';
import { ActionTypes } from 'src/components/About/Bio/actionTypes';
import { BioStateShape } from 'src/components/About/Bio/types';

export const bioReducer: Reducer<BioStateShape, ActionTypes> = (state = {
    isFetching: false,
    bio: [],
}, action) => {
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
