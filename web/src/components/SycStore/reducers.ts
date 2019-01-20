import * as _ from 'lodash';

import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';
import { SycStoreStateShape } from 'src/components/SycStore/types';

export const sycStoreReducer = (state: SycStoreStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: [],
    cart: { items: [], itemSet: new Set() },
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
        case STORE_ACTIONS.ADD_TO_CART:
            const newItems = [...state.cart.items, action.skuId];
            return {
                ...state,
                cart: {
                    items: newItems,
                    itemSet: new Set(newItems),
                },
            };
        case STORE_ACTIONS.REMOVE_FROM_CART:
            const itemsWithout = _.without(state.cart.items, action.skuId);
            return {
                ...state,
                cart: {
                    items: itemsWithout,
                    itemSet: new Set(itemsWithout),
                },
            };
        default:
            return state;
    }
};
