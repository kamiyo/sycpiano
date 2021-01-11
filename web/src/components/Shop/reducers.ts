import { Reducer } from 'redux';
import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import * as ActionTypes from 'src/components/Shop/actionTypes';
import { ShopStateShape } from 'src/components/Shop/types';

export const shopReducer: Reducer<ShopStateShape, ActionTypes.Types> = (state: ShopStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: {},
}, action: ActionTypes.Types) => {
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