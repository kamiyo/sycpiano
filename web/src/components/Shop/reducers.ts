import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import * as ActionTypes from 'src/components/Shop/actionTypes';
import { ShopStateShape } from 'src/components/Shop/types';

export const shopReducer = (state: ShopStateShape = {
    isFetching: false,
    fetchSuccess: false,
    items: [],
    cartIsInit: false,
    cart: { items: [] },
    isCheckingOut: false,
    // submitSuccess: false,
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
                    items: action.items,
                },
            };
        case STORE_ACTIONS.INIT_CART_ERROR:
            return {
                ...state,
                cartIsInit: false,
            };
        case STORE_ACTIONS.ADD_TO_CART: {
            const retArray = state.cart.items.splice(0);
            retArray.push(action.skuId)
            return {
                ...state,
                cart: {
                    items: retArray,
                },
            };
        }
        case STORE_ACTIONS.REMOVE_FROM_CART: {
            const retArray = state.cart.items.splice(0);
            retArray.splice(retArray.findIndex((v: string) => v === action.skuId), 1);
            console.log(retArray);
            return {
                ...state,
                cart: {
                    items: retArray,
                },
            };
        }
        case STORE_ACTIONS.CHECKOUT_REQUEST: {
            return {
                ...state,
                isCheckingOut: true,
            };
        }
        case STORE_ACTIONS.CHECKOUT_ERROR: {
            return {
                ...state,
                isCheckingOut: false,
            };
        }
        case STORE_ACTIONS.CHECKOUT_SUCCESS: {
            return {
                ...state,
                isCheckingOut: false,
            };
        }
        default:
            return state;
    }
};