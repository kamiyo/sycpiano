import { Reducer } from 'redux';
import PRESS_ACTIONS from 'src/components/About/Press/actionTypeKeys';

import { ActionTypes } from 'src/components/About/Press/actionTypes';
import { AcclaimsListStateShape } from 'src/components/About/Press/types';

export const acclaimsListReducer: Reducer<AcclaimsListStateShape, ActionTypes> = (state = {
    isFetching: false,
    items: [],
}, action) => {
    switch (action.type) {
        case PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.items,
            };
        case PRESS_ACTIONS.FETCH_ACCLAIMS_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST:
            return state.isFetching ?
                state
                : {
                    ...state,
                    isFetching: true,
                };
        default:
            return state;
    }
};
