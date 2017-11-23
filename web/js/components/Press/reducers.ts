import PRESS_ACTIONS from 'js/components/Press/actionTypeKeys';

import ActionTypes from 'js/components/Press/actionTypes';
import { AcclaimItemShape } from 'js/components/Press/types';

export interface AcclaimsListStateShape {
    isFetching: boolean;
    items: AcclaimItemShape[];
}

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
