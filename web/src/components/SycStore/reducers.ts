import * as _ from 'lodash';

import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';
<<<<<<< HEAD
import { CartStateShape, SycStoreStateShape } from 'src/components/SycStore/types';
=======
import { SycStoreStateShape } from 'src/components/SycStore/types';
>>>>>>> origin/add_store_checkout

export const sycStoreReducer = (state: SycStoreStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: [],
<<<<<<< HEAD
}, action: ActionTypes.FetchItemsActions) => {
=======
    cart: { items: [], itemSet: new Set() },
    isSubmitting: false,
    submitSuccess: false,
}, action: ActionTypes.Types) => {
>>>>>>> origin/add_store_checkout
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

export const cartReducer = (state: CartStateShape = {
    cartError: false,
    isFetching: false,
    order: null,
}, action: ActionTypes.FetchCartActions | ActionTypes.UpdateCartOptions) => {
    // let notExists;
    switch (action.type) {
        case STORE_ACTIONS.FETCH_CART_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case STORE_ACTIONS.FETCH_CART_ERROR:
            return {
                ...state,
                isFetching: false,
                cartError: true,
            };
        case STORE_ACTIONS.FETCH_CART_SUCCESS:
            return {
                ...state,
                cartError: false,
                isFetching: false,
                items: action.order,
            };
        // case STORE_ACTIONS.ADD_ITEM_TO_CART:
        //     notExists = state.items.indexOf(action.sku) === -1;
        //     return {
        //         ...state,
        //         items: notExists ? [...state.items, action.sku] : state.items,
        //     };
        // case STORE_ACTIONS.REMOVE_ITEM_FROM_CART:
        //     notExists = state.items.indexOf(action.sku) === -1;
        //     return {
        //         ...state,
        //         items: notExists ? state.items : state.items.filter(sku => sku !== action.sku),
        //     };
        default:
            return state;
    }
};
