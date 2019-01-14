import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import ActionTypes from 'src/components/SycStore/actionTypes';
import { SycStoreStateShape } from 'src/components/SycStore/types';

export const sycStoreReducer = (state: SycStoreStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: [],
}, action: ActionTypes) => {
    switch (action.type) {
        case STORE_ACTIONS.FETCH_ITEMS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case STORE_ACTIONS.FETCH_ITEMS_ERROR:
            return {
                ...state,
                fetchSuccess: false,
                isFetching: false,
            };
        case STORE_ACTIONS.FETCH_ITEMS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetchSuccess: true,
                items: action.items,
            };
        default:
            return state;
    }
};
