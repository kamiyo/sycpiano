import PRESS_ACTIONS from 'src/components/Press/actionTypeKeys';

import ActionTypes from 'src/components/Press/actionTypes';
import { AcclaimsListStateShape } from 'src/components/Press/types';

export const acclaimsListReducer = (state: AcclaimsListStateShape = {
    isFetching: false,
    items: [],
}, action: ActionTypes) => {
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
