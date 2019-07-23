import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';
import { CartStateShape, SycStoreStateShape } from 'src/components/SycStore/types';

export const sycStoreReducer = (state: SycStoreStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: [],
}, action: ActionTypes.FetchItemsActions) => {
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

export const cartReducer = (state: CartStateShape = {
    cartError: false,
    items: [],
}, action: ActionTypes.FetchCartActions | ActionTypes.UpdateCartOptions) => {
    let notExists;
    switch (action.type) {
        case STORE_ACTIONS.FETCH_CART_ERROR:
            return {
                ...state,
                cartError: true,
            };
        case STORE_ACTIONS.FETCH_CART_SUCCESS:
            return {
                ...state,
                cartError: false,
                items: action.cart,
            };
        case STORE_ACTIONS.ADD_ITEM_TO_CART:
            notExists = state.items.indexOf(action.sku) === -1;
            return {
                ...state,
                items: notExists ? [...state.items, action.sku] : state.items,
            };
        case STORE_ACTIONS.REMOVE_ITEM_FROM_CART:
            notExists = state.items.indexOf(action.sku) === -1;
            return {
                ...state,
                items: notExists ? state.items : state.items.filter(sku => sku !== action.sku),
            };
        default:
            return state;
    }
};
