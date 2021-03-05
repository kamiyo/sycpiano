import { Reducer } from 'redux';
import DISCS_ACTIONS from 'src/components/About/Discs/actionTypeKeys';
import { ActionTypes } from 'src/components/About/Discs/actionTypes';
import { DiscsStateShape } from 'src/components/About/Discs/types';

export const discsReducer: Reducer<DiscsStateShape, ActionTypes> = (state = {
    isFetching: false,
    discs: [],
}, action) => {
    switch (action.type) {
        case DISCS_ACTIONS.FETCH_DISCS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case DISCS_ACTIONS.FETCH_DISCS_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case DISCS_ACTIONS.FETCH_DISCS_SUCCESS:
            return {
                isFetching: false,
                discs: action.discs,
            };
        default:
            return state;
    }
};
