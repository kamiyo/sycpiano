import { OrderedSet } from 'immutable';

import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import * as ActionTypes from 'src/components/Shop/actionTypes';
import { ShopStateShape } from 'src/components/Shop/types';

export const shopReducer = (state: ShopStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: [],
    cartIsInit: false,
    cart: { items: OrderedSet() },
    isSubmitting: false,
    submitSuccess: false,
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
        case STORE_ACTIONS.INIT_CART_SUCCESS:
            return {
                ...state,
                cartIsInit: true,
                cart: {
                    items: state.cart.items.union(action.items),
                },
            };
        case STORE_ACTIONS.INIT_CART_ERROR:
            return {
                ...state,
                cartIsInit: false,
            };
        case STORE_ACTIONS.ADD_ITEM_TO_CART:
            return {
                ...state,
                cart: {
                    item: state.cart.items.add(action.skuId),
                },
            };
        case STORE_ACTIONS.REMOVE_ITEM_FROM_CART:
            return {
                ...state,
                cart: {
                    item: state.cart.items.delete(action.skuId),
                },
            };
        default:
            return state;
    }
};
